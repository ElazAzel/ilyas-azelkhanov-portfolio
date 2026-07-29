import type { Metadata, Viewport } from "next";
import "@/app/globals.css";
import { Header } from "@/src/components/layout/Header";
import { Footer } from "@/src/components/layout/Footer";
import { OfflineRegister } from "@/src/components/system/OfflineRegister";
import { siteConfig } from "@/src/data/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Ильяс Азелханов — разработка сайтов и веб-сервисов для бизнеса",
    template: "%s — Ильяс Азелханов",
  },
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: "Ильяс Азелханов — Digital Product Designer",
    description: siteConfig.description,
    type: "website",
    locale: "ru_RU",
    siteName: siteConfig.name,
  },
  twitter: { card: "summary_large_image", title: siteConfig.name, description: siteConfig.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#090A0C",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    jobTitle: siteConfig.title,
    url: siteConfig.url,
    knowsAbout: ["Digital product design", "UX/UI", "Web development", "Business analysis", "AI integrations"],
  };

  return (
    <html lang="ru" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#content">К содержанию</a>
        <Header />
        <main id="content">{children}</main>
        <Footer />
        <OfflineRegister />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      </body>
    </html>
  );
}
