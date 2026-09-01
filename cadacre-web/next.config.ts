import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingExcludes: {
    "*": [
      "node_modules/next/dist/compiled/@vercel/og/**",
      "node_modules/@napi-rs/**",
      "node_modules/@resvg/**",
    ],
  },
};

export default nextConfig;
