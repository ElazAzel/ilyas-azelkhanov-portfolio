import type { Metadata, Viewport } from "next";
import { PageTransition } from "@/components/motion/PageTransition";
import { Feedback } from "@/components/motion/Feedback";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FloatingContact } from "@/components/site/FloatingContact";
import tokens from "@/content/tokens.json";
import { BASE_PATH } from "@/lib/base-path";
import { FONT_FACES } from "./font-faces";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Azelkhanov — сделаю и научу", template: "%s — Azelkhanov" },
  description: "Сайты, Telegram Mini Apps, боты, AI-автоматизация и тренинги. Алматы.",
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
        <Feedback />
      </body>
    </html>
  );
}
