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
      },
      {
        protocol: 'https',
        hostname: 'i.postimg.cc'
      },
      {
        protocol: 'https',
        hostname: 'postimg.cc'
      },
      {
        protocol: 'https',
        hostname: 'www.google.com'
      }
    ]
  }
};

export default nextConfig;
