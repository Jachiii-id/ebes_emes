/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  experimental: {
    inspector: false
  },
  // Hide Next.js development indicator
  devIndicators: {
    buildActivity: false,
    buildActivityPosition: 'bottom-left',
  },
};

export default nextConfig;
