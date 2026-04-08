import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = (await headers()).get("stripe-signature") as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle successful checkout
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const { productId, buyerClerkId } = session.metadata;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { seller: true }
    });

    if (product) {
      const buyer = await prisma.user.findUnique({ where: { clerkId: buyerClerkId } });
      
      if (buyer) {
        // 1. Create Purchase record
        const platformFee = (product.price * 0.3); // 30% commission
        const sellerAmount = product.price - platformFee;

        await prisma.purchase.create({
          data: {
            productId: product.id,
            buyerId: buyer.id,
            amount: product.price,
            platformFee,
            sellerAmount,
            stripeSessionId: session.id,
            stripePaymentId: session.payment_intent as string,
          }
        });

        // 2. Update Seller earnings
        await prisma.user.update({
          where: { id: product.sellerId },
          data: { earnings: { increment: sellerAmount } }
        });

        // 3. Increment Product sales count
        await prisma.product.update({
          where: { id: product.id },
          data: { salesCount: { increment: 1 } }
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
