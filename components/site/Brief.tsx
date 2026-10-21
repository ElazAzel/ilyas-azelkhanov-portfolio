"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { formatPrice, packagesFor, type ServiceId } from "@/content/pricing";
import { services } from "@/content/services";
import { contacts, telegramLink, whatsappLink } from "@/content/contacts";
import { buttonClass } from "@/components/ui/Button";
import { TelegramIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { play } from "@/lib/sfx";
import { haptic } from "@/lib/haptics";

const TIMING = ["Срочно", "В течение месяца", "Не горит"] as const;
const CHANNEL = ["WhatsApp", "Telegram"] as const;

type State = { service?: ServiceId; pkg?: string; timing?: string; channel?: (typeof CHANNEL)[number] };

/** SPEC.md §7 /brief: 4 steps, price range from content/pricing.ts, nothing is sent to a server. */
export function Brief() {
  const [st, setSt] = useState<State>({});
  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("service");
    if (q && services.some((s) => s.id === q)) {
      setSt({ service: q as ServiceId });
      setStep(1);
    }
  }, []);

  const service = services.find((s) => s.id === st.service);
  const pkgs = st.service ? packagesFor(st.service) : [];
  const pkg = pkgs.find((p) => p.id === st.pkg);

  const message = useMemo(() => {
    if (!service || !pkg) return "";
    return [
      "Здравствуйте, Ильяс! Бриф с сайта:",
      `- Услуга: ${service.title}`,
      `- Объём: ${pkg.title} (${formatPrice(pkg).replace(/ /g, " ")})`,
      `- Сроки: ${st.timing ?? "-"}`,
      "Хочу обсудить задачу.",
    ].join("\n");
  }, [service, pkg, st.timing]);

  const choose = (patch: State, next: number) => {
    setSt((s) => ({ ...s, ...patch }));
    window.setTimeout(() => setStep(next), 180);
  };

  useEffect(() => {
    if (step === 4) {
      play("step");
      haptic("success");
    }
  }, [step]);

  const steps = [
    {
      q: "Что нужно сделать?",
      options: services.map((s) => ({ key: s.id, label: s.title, on: st.service === s.id, pick: () => choose({ service: s.id, pkg: undefined }, 1) })),
    },
    {
      q: "Какой объём?",
      options: pkgs.map((p) => ({ key: p.id, label: `${p.title} · ${formatPrice(p)}`, on: st.pkg === p.id, pick: () => choose({ pkg: p.id }, 2) })),
    },
    {
      q: "Когда нужно?",
      options: TIMING.map((t) => ({ key: t, label: t, on: st.timing === t, pick: () => choose({ timing: t }, 3) })),
    },
    {
      q: "Куда вам ответить?",
      options: CHANNEL.map((c) => ({ key: c, label: c, on: st.channel === c, pick: () => choose({ channel: c }, 4) })),
    },
  ];

  const openTelegram = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
    } catch {
      setCopied(false);
    }
    window.open(telegramLink(), "_blank", "noopener");
  };

  return (
    <div className="flex flex-col gap-7">
      <ol className="grid grid-cols-4 gap-2" aria-label="Шаги брифа">
        {steps.map((s, i) => (
          <li key={s.q}>
            <button
              type="button"
              data-fx="select"
              disabled={i > step}
              onClick={() => setStep(i)}
              aria-current={i === step ? "step" : undefined}
              className="flex w-full flex-col gap-2 text-left disabled:opacity-40"
            >
              <span className={`h-2 rounded-pill transition-colors duration-[var(--dur-base)] ${i <= step ? "bg-primary" : "bg-mist"}`} />
              <span className="t-label max-md:hidden">
                {i + 1}. {s.q}
              </span>
            </button>
          </li>
        ))}
      </ol>

      {step < 4 ? (
        <fieldset key={step} className="flex flex-col gap-6">
          <legend className="mb-6 t-display-l">
            <span className="text-slate">{step + 1}/4 </span>
            {steps[step]!.q}
          </legend>
          <div className="grid gap-3 md:grid-cols-2">
            {steps[step]!.options.map((o) => (
              <button
                key={o.key}
                type="button"
                data-fx="select"
                aria-pressed={o.on}
                onClick={o.pick}
                className={`min-h-8 rounded-md px-5 py-4 text-left t-heading-s transition-colors duration-[var(--dur-quick)] active:scale-98 ${
                  o.on ? "bg-primary text-on-primary" : "bg-mist text-ink hover:bg-line"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </fieldset>
      ) : (
        <section className="grid-page gap-y-6">
          <div className="col-span-4 flex flex-col gap-5 rounded-md bg-night p-5 text-ink-inverse md:col-span-8 lg:col-span-7 lg:p-7">
            <h2 className="t-display-l">Готово</h2>
            <p className="t-body-m text-slate-inverse">Ориентир по цене для вашей задачи:</p>
            <p className="t-price">{pkg ? formatPrice(pkg) : ""}</p>
            <pre className="rounded-sm bg-night-raised p-4 t-body-s whitespace-pre-wrap">{message}</pre>
            {st.channel === "Telegram" ? (
              <>
                <button type="button" data-fx="press" onClick={openTelegram} className={buttonClass("primary", "self-start")}>
                  <TelegramIcon /> Скопировать и открыть Telegram
                </button>
                {copied ? <p className="t-body-s text-slate-inverse">Текст скопирован - вставьте его в чат с {contacts.telegram.display}.</p> : null}
              </>
            ) : (
              <a href={whatsappLink(message)} data-fx="press" className={buttonClass("primary", "self-start")}>
                <WhatsAppIcon /> Отправить в WhatsApp
              </a>
            )}
          </div>
          <div className="col-span-4 flex flex-col gap-4 md:col-span-8 lg:col-span-4 lg:col-start-9">
            <p className="t-body-m text-slate">Сайт ничего не сохраняет: текст уходит только туда, куда вы его отправите сами.</p>
            <button type="button" data-fx="select" onClick={() => { setSt({}); setStep(0); }} className="link self-start t-label">
              Начать заново
            </button>
            {service ? (
              <Link href={service.href} className="link self-start t-label">
                Подробнее про «{service.title}»
              </Link>
            ) : null}
          </div>
        </section>
      )}
    </div>
  );
}
