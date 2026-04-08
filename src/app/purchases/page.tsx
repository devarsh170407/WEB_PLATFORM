import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Download, ShoppingBag, ExternalLink } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const dynamic = "force-dynamic";

export default async function MyPurchasesPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  let purchases: any[] = [];
  try {
    purchases = await prisma.purchase.findMany({
      where: {
        buyer: { clerkId: userId }
      },
      include: {
        product: true
      },
      orderBy: { createdAt: "desc" }
    });
  } catch (e) {
    // Mock for dev
    purchases = [
      { id: "p1", createdAt: new Date(), product: { title: "Modern E-commerce React Template", slug: "modern-ecommerce-react-template", screenshots: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000"] } }
    ];
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold">My Purchases</h1>
              <p className="text-muted-foreground">Access your downloaded assets and licenses.</p>
            </div>

            {purchases.length === 0 ? (
              <div className="py-20 text-center space-y-4 border-2 border-dashed rounded-3xl">
                <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto" />
                <h3 className="text-xl font-semibold">No purchases found</h3>
                <p className="text-muted-foreground">You haven't bought anything yet. Browse our marketplace!</p>
                <Link href="/browse" className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold">
                  Browse Marketplace
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {purchases.map((purchase) => (
                  <div key={purchase.id} className="bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                    <div className="aspect-video relative">
                      <Image src={purchase.product.screenshots[0]} alt="" fill className="object-cover" />
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <Link href={`/products/${purchase.product.slug}`} className="font-bold hover:text-primary transition-colors">
                          {purchase.product.title}
                        </Link>
                        <p className="text-xs text-muted-foreground mt-1 tabular-nums">
                          Purchased on {new Date(purchase.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      
                      {purchase.product.fileUrl.includes("supabase") ? (
                        <button className="w-full py-3 bg-primary/10 text-primary rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/20 transition-all">
                          <Download className="w-4 h-4" />
                          Download ZIP
                        </button>
                      ) : (
                        <a 
                          href={purchase.product.fileUrl}
                          target="_blank"
                          className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Visit Web App
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
