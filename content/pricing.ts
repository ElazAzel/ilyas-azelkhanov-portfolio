// Единственный источник цен на сайте (SPEC.md §5, утверждено 20.10.2026).
// Только «от». Любая страница берёт цены отсюда.

export type ServiceId = "websites" | "mini-apps" | "bots" | "automation" | "training";

export type Package = {
  id: string;
  service: ServiceId;
  title: string;
  /** Цена «от» в тенге. null - только по КП. */
  from: number | null;
  unit?: "project" | "hour" | "month";
  term?: string;
  note?: string;
};

export const packages: Package[] = [
  { id: "landing", service: "websites", title: "Лендинг", from: 120_000, unit: "project", term: "от 7 рабочих дней" },
  { id: "corporate-site", service: "websites", title: "Корпоративный сайт", from: 250_000, unit: "project", term: "от 3 недель" },
  { id: "bot", service: "bots", title: "Telegram-бот", from: 80_000, unit: "project", term: "от 7 рабочих дней" },
  { id: "mini-app", service: "mini-apps", title: "Telegram Mini App", from: 250_000, unit: "project", term: "от 3 недель" },
  { id: "automation", service: "automation", title: "Автоматизация процесса", from: 200_000, unit: "project", term: "от 2 недель" },
  { id: "automation-support", service: "automation", title: "Поддержка автоматизации", from: 30_000, unit: "month" },
  { id: "dashboards", service: "automation", title: "Дашборды", from: null, note: "по КП" },
  { id: "training-corporate", service: "training", title: "Корпоративный тренинг", from: 60_000, unit: "hour", note: "группа до 20 человек, минимум 2 часа" },
  { id: "training-personal", service: "training", title: "Личный тренинг", from: 15_000, unit: "hour", term: "по записи" },
];

export const guarantee = "1 месяц бесплатного исправления ошибок после сдачи";

const NBSP = " ";
const UNIT: Record<NonNullable<Package["unit"]>, string> = { project: "", hour: "/час", month: "/мес" };

/** «от 120 000 ₸», «от 15 000 ₸/час», «по КП». */
export function formatPrice(p: Package): string {
  if (p.from === null) return p.note ?? "по КП";
  const n = p.from.toLocaleString("ru-RU").replace(/\s/g, NBSP);
  return `от${NBSP}${n}${NBSP}₸${p.unit ? UNIT[p.unit] : ""}`;
}

export function packagesFor(service: ServiceId): Package[] {
  return packages.filter((p) => p.service === service);
}
