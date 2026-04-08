"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CATEGORIES } from "@/lib/constants";
import { useState } from "react";
import { Loader2, Upload, X, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const productSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z.preprocess((val) => Number(val), z.number().min(5, "Minimum price is $5")),
  category: z.string().min(1, "Select a category"),
  previewUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  techStack: z.string().min(3, "Add at least one technology (e.g. React, Nextjs)"),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function ProductForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [zipUrl, setZipUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
  });

  const uploadFile = async (file: File, bucket: string) => {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      return publicUrl;
    } catch (error: any) {
      toast.error(`Upload failed: ${error.message}`);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      const url = await uploadFile(file, "product-screenshots");
      if (url) setScreenshots(prev => [...prev, url]);
    }
  };

  const handleZipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadFile(file, "product-files"); // Note: Private bucket recommended for ZIPs
    if (url) {
      setZipUrl(url);
      toast.success("Project ZIP uploaded successfully");
    }
  };

  const onSubmit = async (values: ProductFormValues) => {
    if (screenshots.length === 0) return toast.error("Upload at least one screenshot");
    if (!zipUrl) return toast.error("Upload the project ZIP file");

    setIsSubmitting(true);
    try {
      // Here we would call a Server Action to save to DB
      /*
      await createProduct({
        ...values,
        screenshots,
        fileUrl: zipUrl,
      });
      */
      toast.success("Product submitted for review!");
      router.push("/seller/products");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
      <div className="bg-card border rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
        <h2 className="text-xl font-bold">General Information</h2>
        
        <div className="space-y-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Product Title</label>
            <input
              {...register("title")}
              placeholder="e.g. Modern SaaS Landing Page"
              className="w-full px-4 py-2 bg-background border rounded-lg outline-none focus:ring-2 ring-primary/20 transition-all font-sans"
            />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              {...register("description")}
              rows={5}
              placeholder="Explain what's included in your project..."
              className="w-full px-4 py-2 bg-background border rounded-lg outline-none focus:ring-2 ring-primary/20 transition-all font-sans"
            />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Category</label>
              <select
                {...register("category")}
                className="w-full px-4 py-2 bg-background border rounded-lg outline-none focus:ring-2 ring-primary/20 transition-all font-sans"
              >
                <option value="">Select a category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
              {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Price (USD)</label>
              <input
                {...register("price")}
                type="number"
                placeholder="29"
                className="w-full px-4 py-2 bg-background border rounded-lg outline-none focus:ring-2 ring-primary/20 transition-all font-sans"
              />
              {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Tech Stack (comma separated)</label>
            <input
              {...register("techStack")}
              placeholder="React, Next.js, Tailwind, Stripe"
              className="w-full px-4 py-2 bg-background border rounded-lg outline-none focus:ring-2 ring-primary/20 transition-all font-sans"
            />
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Separate with commas</p>
            {errors.techStack && <p className="text-xs text-destructive">{errors.techStack.message}</p>}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Screenshots Upload */}
        <div className="bg-card border rounded-2xl p-6 space-y-4 shadow-sm">
          <h2 className="text-lg font-bold flex items-center gap-2">
            Screenshots <span className="text-xs font-normal text-muted-foreground">({screenshots.length}/5)</span>
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {screenshots.map((url, i) => (
              <div key={i} className="relative aspect-video rounded-lg overflow-hidden border">
                <Image src={url} alt="Screenshot" fill className="object-cover" />
                <button 
                  type="button"
                  onClick={() => setScreenshots(prev => prev.filter((_, idx) => idx !== i))}
                  className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full hover:bg-black transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {screenshots.length < 5 && (
              <label className="aspect-video border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-all">
                <Upload className="w-6 h-6 text-muted-foreground" />
                <span className="text-xs mt-1">Add Image</span>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleScreenshotUpload} disabled={uploading} />
              </label>
            )}
          </div>
        </div>

        {/* File Upload */}
        <div className="bg-card border rounded-2xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Project Files</h2>
            <div className="p-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center space-y-4">
              {zipUrl ? (
                <div className="space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
                  <p className="text-sm font-medium">ZIP Uploaded Successfully</p>
                  <button 
                    type="button" 
                    onClick={() => setZipUrl(null)} 
                    className="text-xs text-destructive hover:underline"
                  >
                    Remove and re-upload
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-10 h-10 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Upload Project ZIP</p>
                    <p className="text-xs text-muted-foreground mt-1">Must be under 50MB</p>
                  </div>
                  <label className="px-4 py-2 bg-muted rounded-lg text-sm font-bold cursor-pointer hover:bg-muted/80 transition-all">
                    Choose File
                    <input type="file" accept=".zip" className="hidden" onChange={handleZipUpload} disabled={uploading} />
                  </label>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 items-center justify-end">
        <button 
          type="button" 
          onClick={() => router.back()}
          className="px-6 py-3 font-bold text-muted-foreground hover:text-foreground"
        >
          Cancel
        </button>
        <button 
          disabled={isSubmitting || uploading}
          className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
        >
          {(isSubmitting || uploading) && <Loader2 className="w-4 h-4 animate-spin" />}
          Submit Product
        </button>
      </div>
    </form>
  );
}
