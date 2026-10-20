// Services that already have a live demo (the rest show their scheme until their demo is built).
export const DEMOS = ["bots", "mini-apps", "websites", "automation", "training"] as const;

const CAPTIONS: Record<string, string> = {
  bots: "Демо — нажимайте кнопки. Данные выдуманы.",
  "mini-apps": "Демо — соберите заказ. Данные выдуманы.",
  websites: "Цифры измерены в вашем браузере.",
  automation: "Демо. Время — для примера.",
  training: "Программа — пример, цена — реальная.",
};

export function hasDemo(id: string): boolean {
  return (DEMOS as readonly string[]).includes(id);
}

export function demoCaption(id: string): string {
  return CAPTIONS[id] ?? "";
}
