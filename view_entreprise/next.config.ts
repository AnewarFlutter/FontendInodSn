import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
import path from 'path';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',

  turbopack: {
    root: path.resolve(__dirname)
  },

  reactStrictMode: false,
    
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
        port: '',
        pathname: '/photo/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      // Domaine de l'API pour les avatars et photos uploadées
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },   
      {
        protocol: 'https',
        hostname: '*.test-vps-online.xyz',
        port: '',
        pathname: '/**',
      },
    ],
  },

  typescript: {
    ignoreBuildErrors: false,
  },

  // Configuration pour Server Actions (upload avatar + proxy Nginx)
  experimental: {
    serverActions: {
      // Augmenter la limite pour permettre l'upload de photos (défaut : 1mb)
      bodySizeLimit: '10mb',
      allowedOrigins: ['localhost:3000', 'localhost', '127.0.0.1:3000'],
    },
  },

  allowedDevOrigins: [
    'local-origin.dev',
    '*.local-origin.dev',
  ]
  
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
