import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'randomuser.me' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: 'homework-a36e3.firebasestorage.app' },
      { protocol: 'https', hostname: 'encrypted-tbn0.gstatic.com' },
      { protocol: 'https', hostname: 'cdn.simpleicons.org' },
      { protocol: 'https', hostname: 'i.pinimg.com' },
      { protocol: 'https', hostname: 's.pinimg.com' }
    ],
    deviceSizes: [480, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  
  
  // Performance optimizations
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Permanent redirects
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'homeworkuae.com' }],
        destination: 'https://www.homeworkuae.com/:path*',
        permanent: true,
      },

      // Feed redirects
      { source: '/feed', destination: '/', permanent: true },
      { source: '/:path*/feed', destination: '/:path*', permanent: true },

      // Sitemap redirects
      { source: '/sitemap_index.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/author-sitemap.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/category-sitemap.xml', destination: '/sitemap.xml', permanent: true },

      // Page redirects
      { source: '/booking-form', destination: '/booking', permanent: true },
      { source: '/faq', destination: '/faqs', permanent: true },
      { source: '/faqs/:slug', destination: '/faqs', permanent: true },
      { source: '/404', destination: '/', permanent: true },
      { source: '/not-found', destination: '/', permanent: true },

      // Broad service section redirects
      { source: '/cleaning-services/:slug*', destination: '/services', permanent: true },
      { source: '/cleaning-services2/:slug*', destination: '/services', permanent: true },
      { source: '/deep-cleaning/:slug*', destination: '/services', permanent: true },
      { source: '/techanical-cleaning/:slug*', destination: '/services', permanent: true },
      { source: '/services/deep-cleaning', destination: '/services', permanent: true },
      { source: '/cleaning-services/deep-cleaning', destination: '/services', permanent: true },

      // Specific service page redirects
      {
        source: '/services/move-in-move-out-cleaning',
        destination: '/services/move-in-out-cleaning',
        permanent: true,
      },
      {
        source: '/techanical-cleaning/ac-duct-cleaning-2',
        destination: '/services/ac-duct-cleaning',
        permanent: true,
      },
      {
        source: '/techanical-cleaning/grease-trap-cleaning-2',
        destination: '/services/grease-trap-cleaning',
        permanent: true,
      },
      {
        source: '/cleaning-services2/regular-office-cleaning',
        destination: '/services/office-cleaning',
        permanent: true,
      },
      {
        source: '/cleaning-services2/regular-residential-cleaning',
        destination: '/services/residential-cleaning',
        permanent: true,
      },
      {
        source: '/cleaning-services2/sofa-deep-cleaning-2',
        destination: '/services/sofa-deep-cleaning',
        permanent: true,
      },
      {
        source: '/cleaning-services2/mattress-deep-cleaning-2',
        destination: '/services/mattress-deep-cleaning',
        permanent: true,
      },
      {
        source: '/cleaning-services2/carpets-deep-cleaning-2',
        destination: '/services/carpets-deep-cleaning',
        permanent: true,
      },
      {
        source: '/cleaning-services2/window-cleaning-2',
        destination: '/services/window-cleaning',
        permanent: true,
      },
    ];
  },
  
  // Headers for better caching
  async headers() {
    return [
      {
        source: '/fonts/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/images/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

export default nextConfig;
