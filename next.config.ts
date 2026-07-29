import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: { useTypeScriptCli: true },
};

export default nextConfig;
