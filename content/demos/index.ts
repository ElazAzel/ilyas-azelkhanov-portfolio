// Services that already have a live demo (the rest show their scheme until their demo is built).
export const DEMOS = ["bots", "mini-apps", "websites", "automation", "training"] as const;

const CAPTIONS: Record<string, string> = {
  bots: "Демо-сценарий: нажимайте кнопки, как будто вы клиент. Данные выдуманы, ничего никуда не отправляется.",
  "mini-apps": "Демо-сценарий: соберите заказ, как будто вы гость кофейни. Данные выдуманы, ничего никуда не отправляется.",
  websites: "Рентген этой самой страницы: цифры измерены в вашем браузере прямо сейчас, ничего не придумано.",
  automation: "Демо: отправьте тестовую заявку в обоих режимах и сравните. Время — пример, на вашем процессе замерим реальное.",
  training: "Соберите тренинг для своей команды: программа — пример, цена — по реальной ставке.",
};

export function hasDemo(id: string): boolean {
  return (DEMOS as readonly string[]).includes(id);
}

export function demoCaption(id: string): string {
  return CAPTIONS[id] ?? "";
}
