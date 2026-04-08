"use client";

import { useState } from "react";
import { Loader2, ShoppingCart } from "lucide-react";
import { createCheckoutSession } from "@/actions/purchases";
import { toast } from "sonner";

interface BuyButtonProps {
  productId: string;
}

export default function BuyButton({ productId }: BuyButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    setLoading(true);
    try {
      const { url } = await createCheckoutSession(productId);
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("Failed to create checkout session");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to initiate checkout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleBuy}
      disabled={loading}
      className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          <ShoppingCart className="w-5 h-5" />
          Buy Now
        </>
      )}
    </button>
  );
}
