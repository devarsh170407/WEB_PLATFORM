import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowRight, Zap, Shield, Globe, Code, Layout, Palette } from "lucide-react";
import prisma from "@/lib/prisma";

export default async function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden lg:py-32">
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
                The Marketplace for <span className="text-primary italic">Premium</span> Digital Assets
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl">
                Browse thousands of high-quality HTML templates, React components, and full-stack scripts to accelerate your next big project.
              </p>
              <div className="flex items-center justify-center gap-4 flex-col sm:flex-row">
                <Link href="/browse" className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2">
                  Browse Marketplace <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/seller/dashboard" className="w-full sm:w-auto px-8 py-4 bg-muted text-foreground rounded-xl font-bold hover:bg-muted/80 transition-all">
                  Start Selling
                </Link>
              </div>
            </div>
          </div>
          
          {/* Decorative background blur */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px] rounded-full -z-10" />
        </section>

        {/* Categories Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Popular Categories</h2>
              <p className="text-muted-foreground mt-2">Explore top-tier assets by category</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: Layout, label: "Web Templates", color: "bg-blue-500/10 text-blue-600" },
                { icon: Code, label: "Scripts & Code", color: "bg-green-500/10 text-green-600" },
                { icon: Palette, label: "UI Kits", color: "bg-purple-500/10 text-purple-600" },
                { icon: Globe, label: "CMS Plugins", color: "bg-orange-500/10 text-orange-600" },
              ].map((cat, i) => (
                <Link 
                  key={i} 
                  href={`/browse?category=${cat.label}`}
                  className="p-6 bg-background border rounded-2xl hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all group"
                >
                  <div className={`w-12 h-12 ${cat.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <cat.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg">{cat.label}</h3>
                  <p className="text-sm text-muted-foreground mt-1">1,200+ assets</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Latest Products Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold">Latest Assets</h2>
                <p className="text-muted-foreground mt-2">Freshly added digital products from our community</p>
              </div>
              <Link href="/browse" className="hidden sm:flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            {/* Server-side data fetching */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {(await prisma.product.findMany({
                where: { status: 'APPROVED' },
                take: 4,
                orderBy: { createdAt: 'desc' },
                include: { seller: { select: { name: true } } }
              })).map(product => (
                <div key={product.id} className="group h-full flex flex-col bg-background border rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-xl transition-all">
                  <Link href={`/products/${product.slug}`} className="relative aspect-video overflow-hidden">
                    <img 
                      src={product.screenshots[0]} 
                      alt={product.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                      {product.category}
                    </div>
                  </Link>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex-1 space-y-2">
                      <Link href={`/products/${product.slug}`} className="font-bold text-lg hover:text-primary transition-colors line-clamp-1">
                        {product.title}
                      </Link>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t flex items-center justify-between">
                      <div className="text-primary font-black text-lg">
                        ${product.price}
                      </div>
                      <Link href={`/products/${product.slug}`} className="text-xs font-bold uppercase tracking-widest hover:text-primary transition-all">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Instant Delivery</h3>
                <p className="text-muted-foreground">Download your assets immediately after purchase. No waiting, no hassle.</p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Secure Payments</h3>
                <p className="text-muted-foreground">All transactions are encrypted and secured by Stripe. Buy with confidence.</p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Global Community</h3>
                <p className="text-muted-foreground">Join thousands of developers and designers from around the world.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
