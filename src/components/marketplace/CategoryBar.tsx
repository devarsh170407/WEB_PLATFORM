"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function CategoryBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  const setCategory = (category: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    router.push(`/browse?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
      <button
        onClick={() => setCategory(null)}
        className={cn(
          "px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-all",
          !currentCategory ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:border-primary/50"
        )}
      >
        All Assets
      </button>
      {CATEGORIES.map((cat) => (
        <button
          key={cat.value}
          onClick={() => setCategory(cat.value)}
          className={cn(
            "px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-all",
            currentCategory === cat.value ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:border-primary/50"
          )}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
