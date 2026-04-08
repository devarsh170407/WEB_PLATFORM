import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
  allowedDevOrigins: ["192.168.31.112", "10.80.6.176", "localhost:3000"],
};

export default nextConfig;
