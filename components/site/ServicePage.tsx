import Link from "next/link";
import { ViewTransition, type ReactNode } from "react";
import { formatPrice, packagesFor, type ServiceId } from "@/content/pricing";
import { prepayment } from "@/content/legal";
import { serviceById } from "@/content/services";
import { whatsappLink } from "@/content/contacts";
import { ServiceVisual } from "@/components/visuals/ServiceVisual";
import { MagneticLink } from "@/components/motion/MagneticLink";
import { buttonClass } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { CheckIcon } from "@/components/ui/Icons2";
import { CtaBand } from "./CtaBand";
import { NextService } from "./NextService";
import { DemoSlot } from "@/components/demos/DemoSlot";
import { demoCaption, hasDemo } from "@/content/demos";

// Short facts next to prices instead of a paragraph of explanations.
const terms = ["Точная цена - после разбора задачи", "Договор с ИП", `Предоплата ${prepayment}`, "Гарантия 1 месяц"];

/** One template for every service: offer → live demo → what's included → prices → FAQ → CTA. Few words, the demo does the talking. */
export function ServicePage({ id, children }: { id: ServiceId; children?: ReactNode }) {
  const s = serviceById(id);
  const pkgs = packagesFor(id);
  const first = pkgs[0]!;

  return (
    <main className="container-page flex flex-col gap-9 pb-8 lg:gap-10">
      {/* Offer + scene */}
      <section data-xray="ServicePage.Offer" className="grid-page items-center gap-y-7 pt-5 lg:min-h-[calc(100svh-var(--spacing-8))] lg:pt-0">
        <div className="col-span-4 flex flex-col gap-5 md:col-span-8 lg:col-span-5">
          <Link href="/#services" data-fx="select" className="link t-label">
            Все услуги
          </Link>
          <ViewTransition name={`svc-title-${s.id}`} share="morph" default="none">
            <h1 className="t-display-xl">{s.title}</h1>
          </ViewTransition>
          <p className="measure t-body-l">{s.offer}</p>
          <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="t-price">{formatPrice(first)}</span>
            {first.term ? <span className="t-body-s text-slate">{first.term}</span> : null}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <MagneticLink href={whatsappLink(s.ask)} icon={<WhatsAppIcon />}>
              Обсудить в WhatsApp
            </MagneticLink>
            <Link href={`/brief/?service=${s.id}`} data-fx="press" className={buttonClass("secondary")}>
              Оценить задачу
            </Link>
          </div>
        </div>
        <figure className="col-span-4 min-w-0 flex flex-col gap-3 md:col-span-8 lg:col-span-7">
          {hasDemo(s.id) ? (
            <div className="rounded-md bg-mist p-3 md:p-4">
              <DemoSlot id={s.id} poster={<ServiceVisual id={s.id} className="aspect-[4/3] w-full" />} />
            </div>
          ) : (
            <div className="px-tilt rounded-md bg-mist p-5 md:p-7">
              <ServiceVisual id={s.id} className="aspect-[4/3] w-full" />
            </div>
          )}
          <figcaption className="flex items-center gap-2 t-body-s text-slate">
            <span aria-hidden="true" className="size-2 rounded-pill bg-primary" />
            {hasDemo(s.id)
              ? demoCaption(s.id)
              : "Схема работы."}
          </figcaption>
        </figure>
      </section>

      {/* What's included - one compact block */}
      <section data-xray="IncludesList" className="flex flex-col gap-5">
        <h2 className="t-display-l">Что входит</h2>
        <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {s.includes.map((i) => (
            <li key={i} className="flex items-start gap-3 rounded-md bg-mist p-5 t-heading-s">
              <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-pill bg-primary text-on-primary">
                <CheckIcon />
              </span>
              {i}
            </li>
          ))}
        </ul>
        <p className="t-body-s text-slate">Не входит: {s.excludes.join(", ")}.</p>
      </section>

      {/* Packages */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h2 className="t-display-l">Цены</h2>
          <ul className="flex flex-wrap gap-2">
            {terms.map((t) => (
              <li key={t} className="rounded-pill bg-mist px-4 py-2 t-label">
                {t}
              </li>
            ))}
          </ul>
        </div>
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pkgs.map((p) => (
            <li key={p.id} data-xray="PriceCard" className="flex flex-col justify-between gap-6 rounded-md bg-night p-5 text-ink-inverse lg:p-6">
              <div className="flex flex-col gap-3">
                <h3 className="t-heading-s">{p.title}</h3>
                <p className="t-price">{formatPrice(p)}</p>
                {p.term || p.note ? <p className="t-body-s text-slate-inverse">{[p.term, p.note].filter(Boolean).join(" · ")}</p> : null}
              </div>
              <a href={whatsappLink(`Здравствуйте, Ильяс! Интересует: ${p.title}.`)} data-fx="press" className={buttonClass("primary", "self-start")}>
                <WhatsAppIcon /> Обсудить
              </a>
            </li>
          ))}
        </ul>
      </section>

      {children}

      {/* FAQ: only answered questions */}
      {s.faq.length ? (
        <section className="grid-page gap-y-6">
          <h2 className="col-span-4 t-display-l md:col-span-8 lg:col-span-4">Вопросы</h2>
          <div className="col-span-4 flex flex-col gap-3 md:col-span-8 lg:col-span-8">
            {s.faq.map((f) => (
              <details key={f.q} data-xray="Faq" className="group rounded-md bg-mist p-5 open:bg-paper open:ring-[length:var(--stroke)] open:ring-line open:ring-inset">
                <summary data-fx="select" className="flex cursor-pointer list-none items-center justify-between gap-5 t-heading-s [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-pill bg-ink text-paper transition-transform duration-[var(--dur-base)] group-open:rotate-45">
                    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </summary>
                <p className="measure pt-4 t-body-m text-slate">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      ) : null}

      <CtaBand ask={s.ask} />

      <NextService id={s.id} />
    </main>
  );
}
