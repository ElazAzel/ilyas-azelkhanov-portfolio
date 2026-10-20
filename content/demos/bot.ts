// Демо-сценарий бота (SPEC.md §8): вымышленный автосервис. Все данные выдуманы для примера.
export type BotStep = {
  id: string;
  /** Сообщения бота; {service} и {time} подставляются из ответов */
  say: string[];
  buttons: { label: string; next: string; set?: { service?: string; time?: string } }[];
};

export const botName = "Автосервис «Демо»";
export const demoPhone = "+7 700 000 00 00";

export const botSteps: Record<string, BotStep> = {
  start: {
    id: "start",
    say: ["Здравствуйте! Я бот автосервиса «Демо». Чем помочь?"],
    buttons: [
      { label: "Записаться", next: "service" },
      { label: "Цены", next: "prices" },
      { label: "Адрес и часы", next: "address" },
    ],
  },
  prices: {
    id: "prices",
    say: ["Замена масла — от 8 000 ₸\nДиагностика — от 5 000 ₸\nШиномонтаж — от 6 000 ₸", "Цены выдуманы для демо."],
    buttons: [
      { label: "Записаться", next: "service" },
      { label: "Назад", next: "start" },
    ],
  },
  address: {
    id: "address",
    say: ["Алматы, ул. Примерная, 1. Работаем каждый день с 9:00 до 20:00.", "Адрес выдуман для демо."],
    buttons: [
      { label: "Записаться", next: "service" },
      { label: "Назад", next: "start" },
    ],
  },
  service: {
    id: "service",
    say: ["Что нужно сделать?"],
    buttons: [
      { label: "Замена масла", next: "time", set: { service: "Замена масла" } },
      { label: "Диагностика", next: "time", set: { service: "Диагностика" } },
      { label: "Шиномонтаж", next: "time", set: { service: "Шиномонтаж" } },
    ],
  },
  time: {
    id: "time",
    say: ["Когда вам удобно?"],
    buttons: [
      { label: "Сегодня, 17:00", next: "phone", set: { time: "Сегодня, 17:00" } },
      { label: "Завтра, 11:00", next: "phone", set: { time: "Завтра, 11:00" } },
      { label: "Завтра, 15:00", next: "phone", set: { time: "Завтра, 15:00" } },
    ],
  },
  phone: {
    id: "phone",
    say: ["Оставьте номер — менеджер подтвердит запись."],
    buttons: [{ label: "Отправить номер (демо)", next: "done" }],
  },
  done: {
    id: "done",
    say: ["Готово! Вы записаны: {service}, {time}.", "Менеджер уже получил заявку и подтвердит запись."],
    buttons: [{ label: "Начать заново", next: "start" }],
  },
};
