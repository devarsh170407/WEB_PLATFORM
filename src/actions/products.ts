"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { ProductStatus, Category } from "@/types";

export async function createProduct(data: {
  title: string;
  description: string;
  price: number;
  category: string;
  techStack: string;
  screenshots: string[];
  fileUrl: string;
  previewUrl?: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId }
  });

  if (!dbUser) throw new Error("User not found");

  const product = await prisma.product.create({
    data: {
      title: data.title,
      slug: data.title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""),
      description: data.description,
      price: data.price,
      category: data.category as Category,
      techStack: data.techStack.split(",").map(t => t.trim()),
      screenshots: data.screenshots,
      fileUrl: data.fileUrl,
      previewUrl: data.previewUrl,
      status: ProductStatus.APPROVED,
      sellerId: dbUser.id,
    }
  });

  revalidatePath("/seller/products");
  revalidatePath("/browse");
  return product;
}

export async function approveProduct(id: string) {
  const { userId } = await auth();
  // Check if admin (role check stubbed)
  
  await prisma.product.update({
    where: { id },
    data: { status: ProductStatus.APPROVED }
  });

  revalidatePath("/admin/dashboard");
  revalidatePath("/browse");
}
