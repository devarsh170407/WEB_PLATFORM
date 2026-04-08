import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CategoryBar from "@/components/marketplace/CategoryBar";
import ProductGrid from "@/components/marketplace/ProductGrid";
import prisma from "@/lib/prisma";
import { Category } from "@prisma/client";

interface BrowsePageProps {
  searchParams: Promise<{
    query?: string;
    category?: string;
    price?: string;
  }>;
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const params = await searchParams;
  const { query, category, price } = params;

  // Fetch products with filters
  const products = await prisma.product.findMany({
    where: {
      ...(category ? { category: category as Category } : {}),
      ...(query ? {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ]
      } : {}),
    },
    include: {
      seller: {
        select: { name: true }
      }
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Browse Asset Marketplace</h1>
              <p className="text-muted-foreground">Discover the best digital assets from top creators.</p>
            </div>

            {/* Filters & Grid */}
            <div className="flex flex-col gap-6">
              <CategoryBar />
              
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Showing {products.length} {products.length === 1 ? "result" : "results"}
                </p>
                {/* Add sort dropdown here later */}
              </div>

              <ProductGrid products={products} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
