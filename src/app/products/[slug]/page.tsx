import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Check, Info, ShieldCheck, Download, Star, ExternalLink } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import BuyButton from "@/components/marketplace/BuyButton";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  // For now, if Prisma fails, we'll use mock data to show the layout
  let product;
  try {
    product = await prisma.product.findUnique({
      where: { slug },
      include: { seller: true },
    });
  } catch (e) {
    console.error("Prisma error, using temporary mock data", e);
  }

  if (!product) {
    // TEMPORARY MOCK FOR DEV
    if (process.env.NODE_ENV === "development") {
      product = {
        title: "Modern E-commerce React Template",
        price: 49.99,
        description: "A high-performance, SEO-friendly e-commerce template built with Next.js 16, Tailwind CSS, and Framer Motion. Features include a complex product grid, shopping cart logic, and a fully responsive checkout flow.",
        screenshots: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000"],
        techStack: ["React", "Next.js", "Tailwind", "Prisma"],
        category: "REACT",
        seller: { name: "CreativeCode", earnings: 0 },
        salesCount: 154,
        previewUrl: "https://example.com",
      };
    } else {
      notFound();
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Column: Media & Description */}
            <div className="lg:col-span-2 space-y-8">
              <div className="aspect-video relative rounded-3xl overflow-hidden border shadow-xl">
                <Image
                  src={product.screenshots[0]}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <h1 className="text-3xl md:text-4xl font-bold">{product.title}</h1>
                  <div className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                    {product.category}
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-foreground">4.9</span> (34 reviews)
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    <span className="font-medium text-foreground">{product.salesCount}</span> sales
                  </div>
                  <div>Last updated: April 2026</div>
                </div>

                <div className="prose prose-zinc dark:prose-invert max-w-none">
                  <h3 className="text-xl font-bold">About this item</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 pt-6">
                  {product.techStack.map((tech: string) => (
                    <div key={tech} className="flex items-center gap-2 p-3 bg-muted/50 rounded-xl border">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">{tech}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Actions & Seller info */}
            <div className="space-y-6">
              <div className="p-8 bg-card border rounded-3xl shadow-lg sticky top-28">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm font-medium text-muted-foreground">Regular License</span>
                  <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
                </div>

                <div className="space-y-4">
                  <BuyButton productId={product.id} />
                  {product.previewUrl && (
                    <a 
                      href={product.previewUrl} 
                      target="_blank"
                      className="w-full py-4 bg-muted text-foreground rounded-2xl font-bold hover:bg-muted/80 transition-all flex items-center justify-center gap-2"
                    >
                      Live Preview <ExternalLink className="w-4 h-4" />
                    </a>
                  ) }
                </div>

                <div className="mt-8 pt-8 border-t space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <ShieldCheck className="w-5 h-5 text-green-500" />
                    <span>Quality verified by MarketSpace</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Info className="w-5 h-5 text-blue-500" />
                    <span>Future updates included</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-muted/30 border rounded-3xl flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center font-bold text-primary">
                  {product.seller.name?.[0] || "S"}
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Sold by</div>
                  <div className="font-bold">{product.seller.name || "Elite Seller"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
