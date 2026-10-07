/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 828, 1080, 1280, 1600, 1920],
    // Images uploaded from the admin panel to Vercel Blob
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "@react-three/drei"],
    serverComponentsExternalPackages: ["@prisma/client", "bcryptjs", "sharp", "@vercel/blob"],
    serverActions: { bodySizeLimit: "8mb" },
  },
  transpilePackages: ["three"],
};

export default nextConfig;
