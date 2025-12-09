import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Enable image optimization
    formats: ['image/avif', 'image/webp'],
    // Optimize images for different device sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Allow external domains if needed (for S3 or CDN)
    remotePatterns: [],
    // Minimum quality for optimized images
    minimumCacheTTL: 60,
  },
  // Enable compression
  compress: true,
};

export default nextConfig;
