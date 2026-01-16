import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Configuration pour Docker (standalone output)
  // Next.js va générer un serveur standalone optimisé
  output: 'standalone',
};

export default nextConfig;
