/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enable static exports
  basePath: '/ethdam_25',
  images: {
    unoptimized: true, // Required for static export
  },
}

export default nextConfig
