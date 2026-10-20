// Services that already have a live demo (the rest show their scheme until their demo is built).
export const DEMOS = ["bots", "mini-apps", "websites"] as const;

const CAPTIONS: Record<string, string> = {
  bots: "Демо-сценарий: нажимайте кнопки, как будто вы клиент. Данные выдуманы, ничего никуда не отправляется.",
  "mini-apps": "Демо-сценарий: соберите заказ, как будто вы гость кофейни. Данные выдуманы, ничего никуда не отправляется.",
  websites: "Рентген этой самой страницы: цифры измерены в вашем браузере прямо сейчас, ничего не придумано.",
};

export function hasDemo(id: string): boolean {
  return (DEMOS as readonly string[]).includes(id);
}

export function demoCaption(id: string): string {
  return CAPTIONS[id] ?? "";
}
