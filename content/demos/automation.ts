/** Fictional print studio; quote arithmetic is real, rates are demonstration data. */
export const printCatalog = [
  { id: "hoodie", name: "Худи", unit: 14500, keyword: /худи/i },
  { id: "shirt", name: "Футболки", unit: 6200, keyword: /футбол/i },
  { id: "bag", name: "Шопперы", unit: 3900, keyword: /шоппер|сумк/i },
];
export const requestSamples = [
  {
    label: "Мерч для команды",
    text: "Здравствуйте! Нужно 30 худи с вышивкой для команды. Доставка в Алматы, желательно к пятнице.",
  },
  {
    label: "Футболки для события",
    text: "Добрый день. Заказываем 80 футболок с логотипом. Город Астана, к концу месяца. Пришлите расчёт.",
  },
  {
    label: "Подарочные шопперы",
    text: "Нужны 50 шопперов с печатью для гостей. Самовывоз в Алматы, через две недели.",
  },
];
export const automationStages = [
  "Сообщение получено",
  "Данные извлечены",
  "Расчёт подготовлен",
  "Карточка в CRM",
];
