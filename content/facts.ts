// Цифры на главной. Только факты от Ильяса, подписи - короткие, без пояснений.
// Срок ответа на сайте не пишем нигде (решение Ильяса 21.10.2026).
import { prepayment } from "./legal";

export type Fact = { value: number; suffix: string; label: string; href?: string };

export const facts: Fact[] = [
  // [факт] Ильяс 21.10.2026: работал более чем с 30 партнёрами (в списке «Работал с» показаны не все).
  { value: 30, suffix: "+", label: "партнёров", href: "/about/" },
  { value: 1, suffix: " мес", label: "сопровождения" },
  { value: Number(prepayment.replace(/\D/g, "")), suffix: "%", label: "предоплата" },
];
