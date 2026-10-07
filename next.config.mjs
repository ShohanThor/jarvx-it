/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 828, 1080, 1280, 1600, 1920],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "@react-three/drei"],
    serverComponentsExternalPackages: ["@prisma/client", "bcryptjs", "sharp"],
    serverActions: { bodySizeLimit: "8mb" },
  },
  transpilePackages: ["three"],
};

export default nextConfig;
