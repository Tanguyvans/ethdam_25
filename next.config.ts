// next.config.js or next.config.ts
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // For static HTML export
  images: {
    unoptimized: true, // GitHub Pages doesn't support Next.js image optimization by default
  },
  // Only use basePath in production
  basePath: process.env.NODE_ENV === 'production' ? '/ethdam_25' : '',
  // Only use assetPrefix in production
  assetPrefix: process.env.NODE_ENV === 'production' ? '/ethdam_25/' : '',
  // assetPrefix: '/ethdam_25/', // Often needed with basePath, especially for assets
                              // if Next.js doesn't handle it automatically with basePath alone.
                              // Test with and without this.
};

export default nextConfig; // Or module.exports = nextConfig; if using CommonJS