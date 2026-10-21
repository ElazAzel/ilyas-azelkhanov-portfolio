import type { Metadata, Viewport } from "next";
import { PageTransition } from "@/components/motion/PageTransition";
import { Feedback } from "@/components/motion/Feedback";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FloatingContact } from "@/components/site/FloatingContact";
import tokens from "@/content/tokens.json";
import { BASE_PATH, SITE_URL } from "@/lib/base-path";
import { TabBar } from "@/components/site/TabBar";
import { services } from "@/content/services";
import { contacts } from "@/content/contacts";
import { company } from "@/content/legal";
import { FONT_FACES } from "./font-faces";
import "./globals.css";

const description = "Сайты, Telegram-боты, Mini Apps, AI-автоматизация и тренинги по ИИ. Алматы. Цены открыто, живые демо на сайте.";

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: { default: "Azelkhanov - сделаю и научу", template: "%s - Azelkhanov" },
  description,
  applicationName: "Azelkhanov",
  appleWebApp: { capable: true, title: "Azelkhanov", statusBarStyle: "default" },
  openGraph: {
    type: "website",
    locale: "ru_KZ",
    siteName: "Azelkhanov",
    title: "Azelkhanov - сделаю и научу",
    description,
    images: [{ url: `${BASE_PATH}/og.png`, width: 1200, height: 630, alt: "Azelkhanov - сделаю и научу" }],
  },
  twitter: { card: "summary_large_image", images: [`${BASE_PATH}/og.png`] },
};

// schema.org: the person behind the services and what he offers (SPEC.md §10).
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Azelkhanov",
  legalName: company.name,
  url: SITE_URL,
  image: `${SITE_URL}/og.png`,
  telephone: `+${contacts.whatsapp.number}`,
  address: { "@type": "PostalAddress", addressLocality: "Алматы", addressCountry: "KZ" },
  founder: { "@type": "Person", name: "Ильяс Азелханов", alternateName: "Elazart" },
  knowsLanguage: ["ru", "kk"],
  makesOffer: services.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.title, description: s.offer } })),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: tokens.colors.paper,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <link rel="preload" href={`${BASE_PATH}/fonts/geologica.woff2`} as="font" type="font/woff2" crossOrigin="anonymous" />
        <style dangerouslySetInnerHTML={{ __html: FONT_FACES.replaceAll('url("/fonts/', `url("${BASE_PATH}/fonts/`) }} />
      </head>
      <body>
        <Header />
        <PageTransition>{children}</PageTransition>
        <Footer />
        <FloatingContact />
        <TabBar />
        <Feedback />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
