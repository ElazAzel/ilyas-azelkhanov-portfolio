// Демо-сценарий Mini App (SPEC.md §8): вымышленная кофейня. Цены и товары выдуманы для примера.
export type Product = { id: string; name: string; cat: "coffee" | "bakery"; price: number; note: string };

export const shopName = "Кофейня «Демо»";

export const categories = [
  { id: "coffee", label: "Кофе" },
  { id: "bakery", label: "Выпечка" },
] as const;

export const products: Product[] = [
  { id: "cap", name: "Капучино", cat: "coffee", price: 1200, note: "Эспрессо и молочная пена" },
  { id: "lat", name: "Латте", cat: "coffee", price: 1400, note: "Больше молока, мягкий вкус" },
  { id: "ame", name: "Американо", cat: "coffee", price: 900, note: "Эспрессо и горячая вода" },
  { id: "flt", name: "Флэт уайт", cat: "coffee", price: 1500, note: "Двойной эспрессо, тонкая пена" },
  { id: "cro", name: "Круассан", cat: "bakery", price: 800, note: "Сливочное масло, хрустящий" },
  { id: "chs", name: "Чизкейк", cat: "bakery", price: 1600, note: "Классический, нежный" },
];

export const sizes = [
  { id: "S", label: "S", add: 0 },
  { id: "M", label: "M", add: 200 },
  { id: "L", label: "L", add: 400 },
] as const;

/** Собственный продукт Ильяса (SPEC.md §7 /work). */
export const ownBot = { handle: "@elazart_bot", url: "https://t.me/elazart_bot", what: "обучающий бот по ИИ" };
