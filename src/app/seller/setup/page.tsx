import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Check, Rocket, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SellerSetupPage() {
  const { userId } = await auth();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 bg-primary/5">
          <div className="container mx-auto px-4 md:px-6 text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Turn Your Code into <span className="text-primary italic">Revenue</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of developers selling premium templates, scripts, and components on MarketSpace.
            </p>
            <div className="flex justify-center">
              <Link 
                href={userId ? "/seller/dashboard" : "/sign-up"} 
                className="px-10 py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-xl shadow-primary/20"
              >
                {userId ? "Get Started Now" : "Sign Up to Sell"}
              </Link>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold">Fast Payouts</h3>
                <p className="text-muted-foreground">Get paid directly to your bank account via Stripe Connect. We handle the complexity.</p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold">Secure Delivery</h3>
                <p className="text-muted-foreground">Your assets are stored securely. We handle the license keys and instant downloads.</p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold">Reach Thousands</h3>
                <p className="text-muted-foreground">Your products are marketed to our global community of developers and businesses.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl">
            <div className="bg-card border rounded-3xl p-8 md:p-12 space-y-8">
              <h2 className="text-2xl font-bold text-center">Ready to start?</h2>
              <div className="space-y-4">
                {[
                  "Create high-quality digital assets",
                  "Provide clear documentation",
                  "Agree to our 30% platform fee",
                  "Support your buyers"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <Link 
                href={userId ? "/seller/dashboard" : "/sign-up"} 
                className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold text-center block"
              >
                Accept & Continue
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
