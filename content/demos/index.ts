// Complete interactive example projects available on the service pages.
export const DEMOS = ["bots", "mini-apps", "websites", "automation", "training"] as const;

const CAPTIONS: Record<string, string> = {
  bots: "Запишитесь в чате и подтвердите заявку у администратора. Демонстрационный проект.",
  "mini-apps": "Соберите заказ, затем приготовьте его на экране бариста. Демонстрационный проект.",
  websites: "Откройте проекты и соберите бриф на сайте интерьерной студии. Демонстрационный проект.",
  automation: "Обработайте сообщение, проверьте расчёт и согласуйте заявку в CRM. Демонстрационный проект.",
  training: "Программа - пример, цена - реальная.",
};

export function hasDemo(id: string): boolean {
  return (DEMOS as readonly string[]).includes(id);
}

export function demoCaption(id: string): string {
  return CAPTIONS[id] ?? "";
}
