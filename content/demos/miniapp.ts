// Демо-сценарий Mini App (SPEC.md §8): вымышленная кофейня. Цены и товары выдуманы для примера.
export type Product = {
  id: string;
  name: string;
  cat: "coffee" | "bakery";
  price: number;
  note: string;
  photo: string;
  detail: string;
};

export const shopName = "MOLA coffee";

export const categories = [
  { id: "coffee", label: "Кофе" },
  { id: "bakery", label: "Выпечка" },
] as const;

export const products: Product[] = [
  {
    id: "cap",
    name: "Капучино",
    cat: "coffee",
    price: 1200,
    note: "Баланс эспрессо и нежной пены",
    photo: "cappuccino",
    detail:
      "Двойной эспрессо на зерне из Бразилии. Шоколад, фундук и сливочное послевкусие.",
  },
  {
    id: "lat",
    name: "Латте",
    cat: "coffee",
    price: 1400,
    note: "Мягкий, сливочный, на каждый день",
    photo: "latte",
    detail:
      "Эспрессо, много тёплого молока и тонкий слой пены. Можно приготовить на овсяном молоке.",
  },
  {
    id: "ame",
    name: "Американо",
    cat: "coffee",
    price: 900,
    note: "Чистый вкус нашего эспрессо",
    photo: "americano",
    detail:
      "Двойной эспрессо и горячая вода. Мягкая кислотность, ноты какао и сухофруктов.",
  },
  {
    id: "flt",
    name: "Флэт уайт",
    cat: "coffee",
    price: 1500,
    note: "Больше кофе, меньше молока",
    photo: "flatwhite",
    detail:
      "Насыщенный двойной эспрессо с микропеной. Для тех, кто любит чувствовать вкус зерна.",
  },
  {
    id: "cro",
    name: "Круассан",
    cat: "bakery",
    price: 800,
    note: "Слоёное тесто на сливочном масле",
    photo: "croissant",
    detail:
      "Хрустящая корочка, воздушная середина. Подаём тёплым. Содержит глютен и молочные продукты.",
  },
  {
    id: "chs",
    name: "Чизкейк",
    cat: "bakery",
    price: 1600,
    note: "Классический на сливочном сыре",
    photo: "cheesecake",
    detail:
      "Нежный сливочный сыр на песочной основе. Содержит молочные продукты, глютен и яйца.",
  },
];

export const sizes = [
  { id: "S", label: "200 мл", add: 0 },
  { id: "M", label: "300 мл", add: 200 },
  { id: "L", label: "400 мл", add: 400 },
] as const;

export const milkOptions = [
  { id: "regular", label: "Обычное", add: 0 },
  { id: "oat", label: "Овсяное", add: 300 },
  { id: "lactose", label: "Без лактозы", add: 200 },
] as const;
export const coffeeCopy = {
  greeting: "Ваш кофе. Ваш ритм.",
  address: "Точка на Абая · самовывоз",
  pickup: ["Как можно скорее", "Через 15 минут", "Через 30 минут"],
  status: ["Заказ принят", "Бариста готовит", "Можно забирать"],
};

/** Собственный продукт Ильяса (SPEC.md §7 /work). */
export const ownBot = {
  handle: "@elazart_bot",
  url: "https://t.me/elazart_bot",
  what: "обучающий бот по ИИ",
};
