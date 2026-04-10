import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Remotion compatibility
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    return config;
  },
};

export default nextConfig;
