import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'telegasonline.com.br'
      },
      {
        protocol: 'https',
        hostname: 'rescaroli.com.br'
      },
      {
        protocol: 'https',
        hostname: 'gasemaguaslindas.com.br'
      },
      {
        protocol: 'https',
        hostname: 'static.wixstatic.com'
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com'
      }
    ]
  }
};

export default nextConfig;
