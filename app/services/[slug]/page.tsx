import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicePage } from "@/components/site/ServicePage";
import { services } from "@/content/services";
import type { ServiceId } from "@/content/pricing";

const SLUGS = ["websites", "mini-apps", "bots", "automation"] as const satisfies readonly ServiceId[];

export const dynamicParams = false;

export function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = services.find((x) => x.id === slug);
  return s ? { title: s.title, description: s.offer } : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(SLUGS as readonly string[]).includes(slug)) notFound();
  return <ServicePage id={slug as ServiceId} />;
}
