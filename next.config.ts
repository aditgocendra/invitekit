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
  transpilePackages: ["playwright-core"],
};

export default nextConfig;
