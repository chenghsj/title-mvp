/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/sign-up',
          destination: '/',
        },
        {
          source: '/sign-in',
          destination: '/',
        },
      ],
    };
  },
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3030',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '**',
      },
    ],
  },
};

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin();

module.exports = {
  ...withPWA({
    reactStrictMode: true,
    swcMinify: true,
  }),
  ...withNextIntl(nextConfig),
  experimental: {
    serverComponentsExternalPackages: [
      '@aws-sdk/s3-request-presigner',
      '@aws-sdk/lib-storage',
    ],
  },
};
