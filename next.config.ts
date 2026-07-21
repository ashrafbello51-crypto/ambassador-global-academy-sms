import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 768, 1024, 1280, 1536],
  },
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
