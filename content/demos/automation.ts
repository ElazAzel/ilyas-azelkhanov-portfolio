// Демо автоматизации (SPEC.md §8): одна заявка, два пути. Время — пример для наглядности, не замер.
export type FlowStep = { title: string; who: "client" | "human" | "ai" | "system"; minutes: number };

export const manualFlow: FlowStep[] = [
  { title: "Клиент пишет в WhatsApp", who: "client", minutes: 0 },
  { title: "Менеджер замечает сообщение", who: "human", minutes: 10 },
  { title: "Копирует заявку в таблицу", who: "human", minutes: 5 },
  { title: "Ищет ответ и считает цену", who: "human", minutes: 10 },
  { title: "Отвечает клиенту", who: "human", minutes: 5 },
];

export const autoFlow: FlowStep[] = [
  { title: "Клиент пишет в WhatsApp", who: "client", minutes: 0 },
  { title: "ИИ разбирает заявку и считает цену", who: "ai", minutes: 0.05 },
  { title: "Заявка сама попадает в таблицу", who: "system", minutes: 0.02 },
  { title: "Клиент сразу получает ответ", who: "ai", minutes: 0.05 },
  { title: "Менеджер видит готовую карточку", who: "human", minutes: 0.03 },
];

export const sampleRequest = "Здравствуйте! Сколько стоит покраска двери? Нужно на этой неделе.";
