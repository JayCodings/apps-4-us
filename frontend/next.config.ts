import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,

  // Fix for cross-origin requests in dev mode
  allowedDevOrigins: ['app.apps-4-us.localhost'],

  // Optimize for Docker environment
  webpack: (config, { isServer }) => {
    // Enable file watching in Docker
    if (!isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

export default nextConfig;
