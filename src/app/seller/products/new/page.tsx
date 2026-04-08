import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductForm from "@/components/seller/ProductForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewProductPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-10 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto space-y-8">
            <Link href="/seller/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold">List a New Asset</h1>
              <p className="text-muted-foreground">Fill in the details below to submit your digital product for review.</p>
            </div>

            <ProductForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
