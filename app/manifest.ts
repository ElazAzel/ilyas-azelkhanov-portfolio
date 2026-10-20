import type { MetadataRoute } from "next";
import { BASE_PATH } from "@/lib/base-path";
import tokens from "@/content/tokens.json";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  const p = (s: string) => `${BASE_PATH}${s}`;
  return {
    name: "Azelkhanov — сделаю и научу",
    short_name: "Azelkhanov",
    description: "Сайты, Telegram-боты, Mini Apps, AI-автоматизация и тренинги. Алматы.",
    lang: "ru",
    start_url: p("/"),
    scope: p("/"),
    display: "standalone",
    background_color: tokens.colors.paper,
    theme_color: tokens.colors.paper,
    icons: [
      { src: p("/icon-192.png"), sizes: "192x192", type: "image/png" },
      { src: p("/icon-512.png"), sizes: "512x512", type: "image/png" },
      { src: p("/icon-maskable.png"), sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Оценить задачу", url: p("/brief/") },
      { name: "Telegram-боты", url: p("/services/bots/") },
      { name: "Контакты", url: p("/contact/") },
    ],
  };
}
