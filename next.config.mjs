/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // تم نقل serverComponentsExternalPackages خارج experimental
  serverExternalPackages: ['mongoose'],
  env: {
    PORT: process.env.PORT || '5050',
  },
  poweredByHeader: false,
  reactStrictMode: true,
  // swcMinify أصبح مفعلاً افتراضياً في Next.js 15
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'rima.example.com',
      },
    ],
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

export default nextConfig;