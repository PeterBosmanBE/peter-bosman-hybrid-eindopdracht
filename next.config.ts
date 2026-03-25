import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nrojpvs9hbuillom.public.blob.vercel-storage.com',
        port: '',
        pathname: '/uploads/**',
      },
    ],
  },
}

export default nextConfig;
