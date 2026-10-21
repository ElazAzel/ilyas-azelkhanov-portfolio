// Цифры доверия. Каждая выводится из подтверждённых данных, ничего не придумано:
// SLA - contacts.ts, гарантия - pricing.ts, предоплата - legal.ts, организации - partners.ts.
import { venues } from "./partners";
import { prepayment, company } from "./legal";

export type Fact = { value: number; suffix: string; label: string; href?: string };

export const facts: Fact[] = [
  { value: 2, suffix: " ч", label: "отвечаю в будни с 10 до 19", href: "/contact/" },
  { value: venues.length, suffix: "", label: "компаний и вузов в списке «Работал с»", href: "/about/" },
  { value: 1, suffix: " мес", label: "гарантия после сдачи" },
  { value: Number(prepayment.replace(/\D/g, "")), suffix: "%", label: `предоплата по договору с ${company.name}` },
];
