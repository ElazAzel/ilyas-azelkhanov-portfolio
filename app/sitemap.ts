import type { MetadataRoute } from "next";

export const dynamic = "force-static";
import { projects } from "@/src/data/projects";
import { siteConfig } from "@/src/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/projects", "/approach", "/about", "/contact"];
  return [
    ...pages.map((path) => ({ url: `${siteConfig.url}${path}`, lastModified: new Date(), changeFrequency: path ? "monthly" as const : "weekly" as const, priority: path ? 0.8 : 1 })),
    ...projects.map((project) => ({ url: `${siteConfig.url}/projects/${project.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
