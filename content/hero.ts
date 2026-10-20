/** Cinematic hero on the home page: chapters shown over the 3D frame sequence while scrolling. */
import type { ServiceId } from "./pricing";

export const heroFrames = {
  count: 96,
  /** Rendered offline from brand/logo-full.svg (three.js, 1920×1080 and 1080×1920). */
  landscape: "/media/cinematic/l/",
  portrait: "/media/cinematic/p/",
};

export const heroIntro = {
  title: "Сделаю и научу",
  lead: "Сайты, Telegram-боты, Mini Apps и AI-автоматизация. И учу команды этим пользоваться.",
  hint: "Листайте вниз",
};

/** `at` — scroll progress 0…1 where the chapter is fully visible. Price comes from content/pricing.ts. */
export const heroChapters: { at: number; title: string; service: ServiceId; href: string }[] = [
  { at: 0.3, title: "Сайты и лендинги", service: "websites", href: "/services/websites/" },
  { at: 0.54, title: "Боты и Mini Apps", service: "bots", href: "/services/bots/" },
  { at: 0.76, title: "AI-автоматизация", service: "automation", href: "/services/automation/" },
];

export const heroOutro = {
  title: "Хотите так же?",
};
