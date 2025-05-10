// next.config.js or next.config.ts
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/ethdam_25', // Crucial for gh-pages subpath
  // assetPrefix: '/ethdam_25/', // Often needed with basePath
};

export default nextConfig;