import type { NextConfig } from "next";

// Static export: the site is uploaded as plain files to hoster.kz (see SPEC.md §4).
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  images: { unoptimized: true },
};

export default nextConfig;
