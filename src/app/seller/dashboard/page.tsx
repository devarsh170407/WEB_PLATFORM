import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Plus, Package, DollarSign, ExternalLink, BarChart3 } from "lucide-react";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function SellerDashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();
  if (!userId || !user) redirect("/sign-in");

  // Sync user with DB (Get or Create)
  let dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { products: true }
  });

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        email: user.emailAddresses[0].emailAddress,
        name: `${user.firstName} ${user.lastName}`,
        avatarUrl: user.imageUrl,
        role: "SELLER",
      },
      include: { products: true }
    });
  }

  const earnings = dbUser.products.reduce((acc, p) => acc + (p.price * p.salesCount), 0);
  const totalSales = dbUser.products.reduce((acc, p) => acc + p.salesCount, 0);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-10">
        <div className="container mx-auto px-4 md:px-6 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Seller Dashboard</h1>
              <p className="text-muted-foreground">Manage your assets and track your performance.</p>
            </div>
            <Link 
              href="/seller/products/new" 
              className="w-full md:w-auto px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20"
            >
              <Plus className="w-5 h-5" />
              Upload New Asset
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="p-6 bg-card border rounded-2xl space-y-2 shadow-sm">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Net Earnings</p>
              <h2 className="text-2xl font-bold">${earnings.toFixed(2)}</h2>
            </div>
            <div className="p-6 bg-card border rounded-2xl space-y-2 shadow-sm">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm text-muted-foreground">Active Listings</p>
              <h2 className="text-2xl font-bold">{dbUser.products.length}</h2>
            </div>
            <div className="p-6 bg-card border rounded-2xl space-y-2 shadow-sm">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm text-muted-foreground">Total Sales</p>
              <h2 className="text-2xl font-bold">{totalSales}</h2>
            </div>
          </div>

          {/* Products List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">My Products</h2>
              {dbUser.products.length > 0 && <span className="text-sm text-muted-foreground">{dbUser.products.length} assets listed</span>}
            </div>
            
            {dbUser.products.length === 0 ? (
              <div className="py-20 border-2 border-dashed rounded-3xl text-center space-y-4 bg-muted/30">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <Package className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="max-w-xs mx-auto space-y-2">
                  <h3 className="font-bold">No products yet</h3>
                  <p className="text-sm text-muted-foreground">List your first digital asset and start earning today.</p>
                </div>
                <Link href="/seller/products/new" className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg font-bold hover:opacity-90">
                  Create First Listing
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {dbUser.products.map(product => (
                  <div key={product.id} className="p-4 bg-card border rounded-2xl flex items-center justify-between gap-4 hover:border-primary/50 transition-all group">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-16 h-10 relative rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                        {product.screenshots[0] && <Image src={product.screenshots[0]} alt="" fill className="object-cover" />}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold truncate">{product.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          <span className="font-bold text-foreground">${product.price}</span> • {product.salesCount} sales • 
                          <span className={`ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            product.status === "APPROVED" ? "bg-green-100 text-green-700" : 
                            product.status === "PENDING" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                          }`}>
                            {product.status}
                          </span>
                        </p>
                      </div>
                    </div>
                    <Link href={`/products/${product.slug}`} className="p-2 hover:bg-muted rounded-xl transition-colors shrink-0">
                      <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
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
