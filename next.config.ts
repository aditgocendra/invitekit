import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "s3.nevaobjects.id",
      },

      {
        protocol: "https",
        hostname: "s3.nevaobjects.id",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externalize playwright-core di server-side
      config.externals.push("playwright-core");
    }
    return config;
  },
};

export default nextConfig;
