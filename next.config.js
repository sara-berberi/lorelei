const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    // Product images are immutable once uploaded, so let them cache hard.
    minimumCacheTTL: 60 * 60 * 24 * 30,
    unoptimized: false,
  },
  compress: true,
  poweredByHeader: false,
  env: {
    _next_intl_trailing_slash: ""
  }
}


module.exports = withNextIntl(nextConfig);
