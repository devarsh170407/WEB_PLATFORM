"use server";

import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { PLATFORM_FEE_PERCENT } from "@/lib/constants";

export async function createCheckoutSession(productId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { seller: true }
  });

  if (!product) throw new Error("Product not found");

  const platformFee = (product.price * PLATFORM_FEE_PERCENT) / 100;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.title,
            description: product.category,
            images: product.screenshots.slice(0, 1),
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: 1,
      },
    ],
    metadata: {
      productId: product.id,
      buyerClerkId: userId,
    },
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/purchases?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/products/${product.slug}`,
    // If seller has Stripe Connect, we can route funds directly (Connect functionality)
    payment_intent_data: product.seller.stripeConnectId ? {
      application_fee_amount: Math.round(platformFee * 100),
      transfer_data: {
        destination: product.seller.stripeConnectId,
      },
    } : undefined,
  });

  return { url: session.url };
}
