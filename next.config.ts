import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // This is critical
  images: {
    unoptimized: true,
  },
  // any other configurations
};

export default nextConfig;