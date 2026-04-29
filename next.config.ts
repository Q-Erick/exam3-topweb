import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      // Cambiamos beforeFiles por afterFiles
      afterFiles: [
        {
          source: '/api/:path*',
          destination: 'https://sii.celaya.tecnm.mx/api/:path*',
        }
      ]
    }
  }
};

export default nextConfig;