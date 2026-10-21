import type { ServiceId } from "@/content/pricing";

/** Айдентика вымышленных демонстрационных проектов, не клиентские кейсы. */
export const projectArt: Record<
  ServiceId,
  { brand: string; category: string; title: [string, string]; note: string }
> = {
  "mini-apps": {
    brand: "mola®",
    category: "Кофе в вашем ритме",
    title: ["Сначала кофе.", "Потом всё."],
    note: "Выбрать. Забрать. Побежать.",
  },
  bots: {
    brand: "PITSTOP",
    category: "Сервис без пит-стопа в делах",
    title: ["Без звонков.", "Без тормозов."],
    note: "Ваш слот уже на стартовой линии.",
  },
  automation: {
    brand: "flowdesk",
    category: "Заявка → расчёт → CRM",
    title: ["Рутина.", "На выход."],
    note: "У задач появился свой маршрут.",
  },
  websites: {
    brand: "FORMA",
    category: "Студия интерьеров",
    title: ["Меньше стен.", "Больше воздуха."],
    note: "Пространство начинается с ощущения.",
  },
  training: {
    brand: "AI Workshop",
    category: "Практика × интеллект",
    title: ["Мышление", "в движении."],
    note: "От «а что, если» - к «уже работает».",
  },
};

export const artEvidence = {
  booking: "Запись подтверждена",
  slot: "Завтра · 11:30 · замена масла",
  incoming: "30 худи → Алматы",
  result: "Заявка готова к согласованию",
  interior: "Свет и воздух · дом, 148 м²",
  program: "Ваша программа",
  topics: ["ИИ в работе", "Практика отдела", "Данные и безопасность"],
  sample: "Демонстрационный проект",
};
