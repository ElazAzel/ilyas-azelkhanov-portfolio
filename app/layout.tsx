import type { Metadata, Viewport } from "next";
import { PageTransition } from "@/components/motion/PageTransition";
import tokens from "@/content/tokens.json";
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
        <link rel="preload" href="/fonts/geologica.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
