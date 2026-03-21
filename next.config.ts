import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    domains: ['res.cloudinary.com'], // Permite imágenes de Cloudinary
  },
};

export default nextConfig;