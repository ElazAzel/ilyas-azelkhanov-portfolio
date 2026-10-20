import type { Metadata } from "next";
import { ServicePage } from "@/components/site/ServicePage";
import { formatPrice, packages } from "@/content/pricing";
import { whatsappLink } from "@/content/contacts";
import { venues } from "@/content/services";
import Link from "next/link";
import { buttonClass } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Тренинги по ИИ",
  description: "Корпоративные и личные тренинги по ИИ на ваших задачах. Алматы и онлайн.",
};

const corp = packages.find((p) => p.id === "training-corporate")!;
const personal = packages.find((p) => p.id === "training-personal")!;

export default function TrainingPage() {
  return (
    <ServicePage id="training">
      <section className="grid-page gap-y-4">
        <article className="col-span-4 flex flex-col gap-5 rounded-md bg-mist p-5 md:col-span-4 lg:col-span-7 lg:p-7">
          <h2 className="t-display-l">Для команды</h2>
          <p className="t-body-m text-slate">Программа под ваш отдел.</p>
          <p className="t-price">{formatPrice(corp)}</p>
          <p className="t-body-s text-slate">{corp.note}</p>
          <a href={whatsappLink("Здравствуйте, Ильяс! Интересует корпоративный тренинг по ИИ для нашей команды.")} data-fx="press" className={buttonClass("primary", "mt-auto self-start")}>
            <WhatsAppIcon /> Запросить программу
          </a>
        </article>
        <article className="col-span-4 flex flex-col gap-5 rounded-md bg-night p-5 text-ink-inverse md:col-span-4 lg:col-span-5 lg:p-7">
          <h2 className="t-display-l">Лично</h2>
          <p className="t-body-m text-slate-inverse">Один на один, в вашем темпе.</p>
          <p className="t-price">{formatPrice(personal)}</p>
          <p className="t-body-s text-slate-inverse">
            {personal.term}. Условия — в{" "}
            <Link href="/offer/" className="underline underline-offset-4">
              публичной оферте
            </Link>
            .
          </p>
          <a href={whatsappLink("Здравствуйте, Ильяс! Хочу записаться на личный тренинг по ИИ.")} data-fx="press" className={buttonClass("primary", "mt-auto self-start")}>
            <WhatsAppIcon /> Записаться
          </a>
        </article>
        <p className="col-span-4 t-body-s text-slate md:col-span-8 lg:col-span-12">Курс для студентов — в подготовке.</p>
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
    </ServicePage>
  );
}
