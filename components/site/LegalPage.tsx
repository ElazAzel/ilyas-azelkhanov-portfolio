import type { ReactNode } from "react";
import { company } from "@/content/legal";

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <main className="container-page grid-page gap-y-7 pt-6 pb-9">
      <header className="col-span-4 flex flex-col gap-3 md:col-span-8 lg:col-span-8">
        <h1 className="t-display-xl">{title}</h1>
        <p className="t-body-s text-slate">Редакция от {updated}</p>
      </header>
      <article className="legal col-span-4 flex flex-col gap-6 md:col-span-8 lg:col-span-8">{children}</article>
      <aside className="col-span-4 flex flex-col gap-2 self-start rounded-md bg-mist p-5 t-body-s md:col-span-8 lg:col-span-4 lg:sticky lg:top-9">
        <h2 className="t-heading-s">Реквизиты</h2>
        <p>{company.name}</p>
        <p>ИИН/БИН: {company.iin}</p>
        <p>{company.address}</p>
        <p>Банк: {company.bank}</p>
        <p>БИК: {company.bik} · КБе: {company.kbe}</p>
        <p className="break-all">Счёт: {company.account}</p>
      </aside>
    </main>
  );
}
