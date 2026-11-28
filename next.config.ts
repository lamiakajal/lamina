import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // three ships modern ESM, let Next compile it with the rest of the app
  transpilePackages: ["three"],
};

export default config;
