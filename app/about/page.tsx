import type { Metadata } from "next";
import Link from "next/link";
import { Monogram } from "@/components/brand/Logo";
import { CtaBand } from "@/components/site/CtaBand";
import { buttonClass } from "@/components/ui/Button";
import { CheckIcon } from "@/components/ui/Icons2";
import { venues } from "@/content/services";
import { company, prepayment } from "@/content/legal";

export const metadata: Metadata = {
  title: "Обо мне",
  description: "Ильяс Азелханов, Алматы. Делаю сайты, ботов, Mini Apps и AI-автоматизацию — и учу команды с этим работать.",
};

// TODO(ilyas): фото и 3–5 предложений о себе своими словами. До этого — только подтверждённые факты.
const principles = [
  "Цены открыто на сайте",
  `Договор с ${company.name}, предоплата ${prepayment}`,
  "Гарантия 1 месяц после сдачи",
  "Тренинги на русском и казахском",
];

export default function AboutPage() {
  return (
    <main className="container-page flex flex-col gap-9 pt-6 pb-8 lg:gap-10">
      <section className="grid-page items-center gap-y-7">
        <div className="col-span-4 flex flex-col gap-5 md:col-span-8 lg:col-span-7">
          <h1 className="t-display-xl">Ильяс Азелханов</h1>
          <p className="measure t-body-l">
            Алматы. Делаю сайты, ботов, Mini Apps и AI-автоматизацию — и учу команды этим пользоваться.
          </p>
          <p className="t-body-m text-slate">В соцсетях и Telegram — Elazart.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/work/" data-fx="press" className={buttonClass("primary")}>
              Посмотреть работы
            </Link>
            <Link href="/brief/" data-fx="press" className={buttonClass("secondary")}>
              Оценить задачу
            </Link>
          </div>
        </div>
        <div className="col-span-4 grid aspect-square place-items-center rounded-md bg-mist p-7 md:col-span-8 lg:col-span-5">
          <Monogram className="w-3/4" />
        </div>
      </section>

      <section className="grid-page gap-y-6">
        <h2 className="col-span-4 t-display-l md:col-span-8 lg:col-span-4">Условия</h2>
        <ul className="col-span-4 grid gap-3 md:col-span-8 md:grid-cols-2 lg:col-span-8">
          {principles.map((p) => (
            <li key={p} className="flex gap-3 rounded-md bg-mist p-4 t-body-m">
              <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-pill bg-primary text-on-primary">
                <CheckIcon />
              </span>
              {p}
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-5">
        <h2 className="t-display-l">Где выступал и преподавал</h2>
        <ul className="flex flex-wrap gap-2">
          {venues.map((v) => (
            <li key={v} className="rounded-pill bg-mist px-4 py-2 t-label">
              {v}
            </li>
          ))}
        </ul>
      </section>

      <CtaBand />
    </main>
  );
}
