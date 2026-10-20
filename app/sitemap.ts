import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/base-path";

export const dynamic = "force-static";

const ROUTES = [
  "/", "/services/websites/", "/services/mini-apps/", "/services/bots/", "/services/automation/", "/training/",
  "/work/", "/about/", "/brief/", "/contact/", "/offer/", "/privacy/",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((r) => ({ url: `${SITE_URL}${r}`, changeFrequency: "monthly", priority: r === "/" ? 1 : 0.7 }));
}
