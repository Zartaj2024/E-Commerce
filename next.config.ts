import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Allow Docker builds without all production secrets present
  // Runtime validation in server actions ensures secrets are available when needed
};

export default nextConfig;
