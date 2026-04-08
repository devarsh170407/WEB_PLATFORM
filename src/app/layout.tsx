import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Digital Marketplace | Buy & Sell Digital Assets",
  description: "A production-grade digital marketplace for scripts, templates, and UI kits.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans min-h-full flex flex-col`} suppressHydrationWarning>
        <ClerkProvider>
          {children}
          <Toaster position="top-center" richColors />
        </ClerkProvider>
      </body>
    </html>
  );
}
