/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize for Vercel
  experimental: {
    // This helps with build stability
    serverActions: {
      bodySizeLimit: '2mb',
    },
    // Explicitly disable PPR to avoid manifest issues
    ppr: false,
  },
};

export default nextConfig;
