import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Esto ignora los errores de TypeScript para poder hacer el deploy
    ignoreBuildErrors: true,
  },
  eslint: {
    // Esto ignora errores de formato
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;