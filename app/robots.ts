import type { MetadataRoute } from "next";

export const dynamic = "force-static";
import { siteConfig } from "@/src/data/site";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${siteConfig.url}/sitemap.xml`, host: siteConfig.url };
}
