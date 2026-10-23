import type { NextConfig } from 'next';
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

// Integrate the OpenNext Cloudflare adapter with the local `next dev` server so
// Cloudflare bindings work during development. Only runs in dev; `next build`
// (NODE_ENV=production) skips this entirely.
if (process.env.NODE_ENV === 'development') {
  initOpenNextCloudflareForDev();
}

const nextConfig: NextConfig = {
  // Use standard Next.js build (not static export) to support dynamic routes
  // and server-side features. OpenNext transforms this output to run on the
  // Cloudflare Workers runtime.
  trailingSlash: false,
  // Turbopack configuration (path aliases are picked up from tsconfig.json)
  turbopack: {},
  experimental: {
    // Inlines critical CSS and defers non-critical rules where possible.
    optimizeCss: true,
    optimizePackageImports: [
      '@radix-ui/react-accordion',
      '@radix-ui/react-avatar',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-popover',
      '@radix-ui/react-separator',
      '@radix-ui/react-slot',
      '@radix-ui/react-toast',
      '@tanstack/react-query',
      'lucide-react',
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
      'cmdk',
    ],
  },
  images: {
    remotePatterns: [
      // Allowlisted image hosts only - no wildcard patterns
      { protocol: 'https', hostname: 'api.perkscrowd.com' },
      { protocol: 'https', hostname: 'ik.imagekit.io' },
      { protocol: 'https', hostname: 'perkscrowd.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // Keep localhost for dev
      ...(process.env.NODE_ENV !== 'production'
        ? [{ protocol: 'http' as const, hostname: 'localhost' }]
        : []),
    ],
    formats: ['image/webp', 'image/avif'],
  },
  // Security headers applied to dynamically rendered responses. The same
  // headers are applied to static assets via public/_headers (the OpenNext
  // static-asset pipeline honours that file). Mirroring them here preserves
  // the previous Netlify behaviour, where _headers applied to all responses.
  // CSP allows inline scripts/styles because pages are prerendered at build
  // time: a per-request nonce could never match that static HTML.
  async headers() {
    // React dev mode uses eval() to reconstruct callstacks. Production never does.
    const scriptSrc =
      process.env.NODE_ENV === 'development'
        ? "'self' 'unsafe-inline' 'unsafe-eval'"
        : "'self' 'unsafe-inline'";

    const securityHeaders = [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      {
        key: 'Permissions-Policy',
        value: 'geolocation=(), microphone=(), camera=()',
      },
      { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
      { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
      {
        key: 'Content-Security-Policy',
        value: `default-src 'self'; script-src ${scriptSrc}; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.perkscrowd.com https://ik.imagekit.io; frame-ancestors 'none'; frame-src 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests`,
      },
      {
        key: 'Content-Security-Policy-Report-Only',
        value: `default-src 'self'; script-src ${scriptSrc}; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.perkscrowd.com https://ik.imagekit.io; frame-ancestors 'none'; frame-src 'none'; base-uri 'self'; form-action 'self'; object-src 'none'`,
      },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains; preload',
      },
    ];
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  // Build optimizations
  compiler: {
    // Remove all console methods in production (log, error, warn, info, debug, etc.)
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  // Reduce passive fingerprinting in production responses.
  poweredByHeader: false,
  // Generate ETags for caching
  generateEtags: true,
  // Enable compression
  compress: true,
  async redirects() {
    return [
      {
        source: '/auth/login',
        destination: '/login',
        permanent: true,
      },
      {
        source: '/auth/forgot-password',
        destination: '/forgot-password',
        permanent: true,
      },
      {
        source: '/auth/reset-password',
        destination: '/reset-password',
        permanent: true,
      },
      {
        source: '/admin',
        destination: '/dashboard',
        permanent: true,
      },
      {
        source: '/admin/:path*',
        destination: '/dashboard/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
