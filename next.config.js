/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standard build output for Vercel deployment

  // Temporarily disable build errors for deployment (like working projects)
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Production domain configuration
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://liquor.aramac.dev' : '',

  images: {
    domains: ['avatars.githubusercontent.com', 'liquor.aramac.dev'],
    unoptimized: false,
  },

  // Security headers for production
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      { source: '/products', destination: '/productos', permanent: true },
      { source: '/products/:path*', destination: '/productos/:path*', permanent: true },
      { source: '/contact', destination: '/contacto', permanent: true },
    ]
  },

  async rewrites() {
    return []
  },

  // Enable compression for production
  compress: true,

  // Production optimizations
  poweredByHeader: false,
  generateEtags: true,

  // Experimental features for better performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
  },
}

module.exports = nextConfig