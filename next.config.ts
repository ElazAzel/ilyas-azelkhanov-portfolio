import type { NextConfig } from "next";

// Static export: the site is uploaded as plain files to hoster.kz (see SPEC.md §4).
// NEXT_PUBLIC_BASE_PATH is set only for the GitHub Pages preview (served from a sub-folder).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  output: "export",
  // The app's preview opens the loopback IP; Next 16.4 guards dev assets by origin.
  allowedDevOrigins: ["127.0.0.1"],
  basePath,
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  images: { unoptimized: true },
};

export default nextConfig;
