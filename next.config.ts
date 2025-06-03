import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* other config options */
  eslint: {
    ignoreDuringBuilds: true, // <-- ignore ESLint errors during build
  },
   typescript: {
    // !! This disables type checking during the build !!
    ignoreBuildErrors: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
