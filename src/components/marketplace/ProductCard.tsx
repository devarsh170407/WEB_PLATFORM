"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart, Star, ExternalLink } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    slug: string;
    price: number;
    category: string;
    screenshots: string[];
    seller: { name: string | null };
    salesCount: number;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all"
    >
      <Link href={`/products/${product.slug}`} className="block relative aspect-video overflow-hidden">
        <Image
          src={product.screenshots[0] || "/images/placeholder.svg"}
          alt={product.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <Link href={`/products/${product.slug}`} className="p-3 bg-primary text-primary-foreground rounded-full hover:scale-110 transition-transform">
            <ShoppingCart className="w-5 h-5" />
          </Link>
          <button className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform">
            <ExternalLink className="w-5 h-5" />
          </button>
        </div>
        <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-sm text-[10px] uppercase font-bold text-white rounded-md tracking-wider">
          {product.category.replace("_", " ")}
        </div>
      </Link>

      <div className="p-5 space-y-3">
        <div>
          <Link href={`/products/${product.slug}`} className="font-bold text-lg line-clamp-1 hover:text-primary transition-colors">
            {product.title}
          </Link>
          <p className="text-sm text-muted-foreground">by {product.seller.name || "Elite Seller"}</p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">4.8</span>
            <span className="text-xs text-muted-foreground">({product.salesCount})</span>
          </div>
          <div className="text-xl font-bold text-primary">
            {formatPrice(product.price)}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
