// Демонстрационный автосервис. Название, цены и контакт - пример.
export const botName = "PITSTOP · запись в сервис";
export const demoPhone = "+7 700 000 00 00";

export const botServices = [
  {
    id: "oil",
    name: "Замена масла",
    price: 8000,
    duration: "45 минут",
    note: "Масло и фильтр оплачиваются отдельно",
  },
  {
    id: "diagnostic",
    name: "Диагностика",
    price: 5000,
    duration: "30 минут",
    note: "Проверка ошибок и основных систем",
  },
  {
    id: "tires",
    name: "Шиномонтаж",
    price: 6000,
    duration: "60 минут",
    note: "Снятие, установка и балансировка",
  },
] as const;
export const botSlots = ["10:00", "11:30", "14:00", "15:30", "17:00"];
export const botIntro =
  "Здравствуйте! Помогу записаться в PITSTOP: выберите услугу и удобное время. Здесь же можно посмотреть цены и статус записи.";
