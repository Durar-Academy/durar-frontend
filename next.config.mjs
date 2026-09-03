/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep deployments from being blocked by legacy lint findings. Run
  // `npm run lint` separately in CI while the codebase is being cleaned up.
  eslint: {
    ignoreDuringBuilds: true,
  },
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
