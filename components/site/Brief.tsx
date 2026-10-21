"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { formatPrice, packagesFor, type Package, type ServiceId } from "@/content/pricing";
import { services } from "@/content/services";
import { briefCopy, briefSteps, haveOptions, timing } from "@/content/brief";
import { contacts, telegramLink, whatsappLink } from "@/content/contacts";
import { buttonClass } from "@/components/ui/Button";
import { TelegramIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { CheckIcon } from "@/components/ui/Icons2";
import { play } from "@/lib/sfx";
import { haptic } from "@/lib/haptics";

type State = { service?: ServiceId; pkg?: string; timing?: string; have: string[]; note: string };
const EMPTY: State = { have: [], note: "" };
const NBSP = " ";

/** Animated «от 120 000 ₸»: the number rolls from the previous value. Instant with reduced motion. */
function RollingPrice({ pkg }: { pkg?: Package }) {
  const [shown, setShown] = useState(pkg?.from ?? 0);
  const from = useRef(shown);
  useEffect(() => {
    const target = pkg?.from ?? 0;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      from.current = target;
      setShown(target);
      return;
    }
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / 520);
      const v = a + (target - a) * (1 - (1 - k) ** 3);
      from.current = v;
      setShown(v);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [pkg]);

  if (!pkg) return <span className="text-slate-inverse">-</span>;
  if (pkg.from === null) return <>{formatPrice(pkg)}</>;
  // Round to thousands while rolling so the digits do not flicker.
  const n = (Math.round(shown / 1000) * 1000).toLocaleString("ru-RU").replace(/\s/g, NBSP);
  const unit = formatPrice(pkg).split("₸")[1] ?? "";
  return (
    <>
      от{NBSP}
      {n}
      {NBSP}₸{unit}
    </>
  );
}

/** SPEC.md §7 /brief: 4 steps on the left, a live receipt with the ready message on the right. Nothing is sent to a server. */
export function Brief() {
  const [st, setSt] = useState<State>(EMPTY);
  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [done, setDone] = useState(false);
  const receipt = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("service");
    if (q && services.some((s) => s.id === q)) {
      setSt({ ...EMPTY, service: q as ServiceId });
      setStep(1);
    }
  }, []);

  const service = services.find((s) => s.id === st.service);
  const pkgs = st.service ? packagesFor(st.service) : [];
  const pkg = pkgs.find((p) => p.id === st.pkg);
  const ready = Boolean(service && pkg);

  const message = useMemo(() => {
    if (!service) return "";
    const lines = ["Здравствуйте, Ильяс! Бриф с сайта:", `- Услуга: ${service.title}`];
    if (pkg) lines.push(`- Объём: ${pkg.title} (${formatPrice(pkg).replace(/ /g, " ")})`);
    if (st.timing) lines.push(`- Сроки: ${st.timing}`);
    if (st.have.length) lines.push(`- Уже есть: ${st.have.join(", ").toLowerCase()}`);
    if (st.note.trim()) lines.push(`- Задача: ${st.note.trim()}`);
    lines.push("Хочу обсудить задачу.");
    return lines.join("\n");
  }, [service, pkg, st.timing, st.have, st.note]);

  const go = (next: number) => window.setTimeout(() => setStep(next), 160);
  const finish = () => {
    setDone(true);
    setStep(3);
    play("step");
    haptic("success");
    if (matchMedia("(max-width: 1023px)").matches) {
      receipt.current?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    }
  };

  const options: { key: string; label: string; meta?: string; on: boolean; pick: () => void }[][] = [
    services.map((s) => ({
      key: s.id,
      label: s.title,
      meta: formatPrice(packagesFor(s.id)[0]!),
      on: st.service === s.id,
      pick: () => {
        setSt((x) => ({ ...x, service: s.id, pkg: undefined, have: [] }));
        setDone(false);
        go(1);
      },
    })),
    pkgs.map((p) => ({
      key: p.id,
      label: p.title,
      meta: [formatPrice(p), p.term].filter(Boolean).join(" · "),
      on: st.pkg === p.id,
      pick: () => {
        setSt((x) => ({ ...x, pkg: p.id }));
        go(2);
      },
    })),
    timing.map((t) => ({
      key: t,
      label: t,
      on: st.timing === t,
      pick: () => {
        setSt((x) => ({ ...x, timing: t }));
        go(3);
      },
    })),
    (st.service ? haveOptions[st.service] : []).map((h) => ({
      key: h,
      label: h,
      on: st.have.includes(h),
      pick: () => setSt((x) => ({ ...x, have: x.have.includes(h) ? x.have.filter((y) => y !== h) : [...x.have, h] })),
    })),
  ];
  const multi = step === 3;

  // Keyboard: digits pick an option of the current step, Backspace goes back (not while typing).
  const current = options[step]!;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest("input, textarea, [contenteditable]") || e.metaKey || e.ctrlKey || e.altKey) return;
      const n = Number(e.key);
      if (n >= 1 && n <= current.length) {
        e.preventDefault();
        current[n - 1]!.pick();
        play("tick");
      } else if (e.key === "Backspace" && step > 0) {
        e.preventDefault();
        setStep(step - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, step]);

  const openTelegram = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
    } catch {
      setCopied(false);
    }
    window.open(telegramLink(), "_blank", "noopener");
  };

  const restart = () => {
    setSt(EMPTY);
    setStep(0);
    setDone(false);
    setCopied(false);
  };

  const rows: [string, string | undefined][] = [
    ["Услуга", service?.title],
    ["Объём", pkg?.title],
    ["Сроки", st.timing],
    ["Уже есть", st.have.length ? st.have.join(", ") : undefined],
  ];

  return (
    <div className="grid-page items-start gap-y-7">
      {/* Steps */}
      <div className="col-span-4 flex flex-col gap-6 md:col-span-8 lg:col-span-7">
        <ol className="grid grid-cols-4 gap-2" aria-label="Шаги брифа">
          {briefSteps.map((q, i) => {
            const reachable = i === 0 || (i === 1 && st.service) || (i >= 2 && st.pkg);
            return (
              <li key={q}>
                <button
                  type="button"
                  data-fx="select"
                  disabled={!reachable}
                  onClick={() => setStep(i)}
                  aria-current={i === step ? "step" : undefined}
                  className="flex w-full flex-col gap-2 text-left disabled:opacity-40"
                >
                  <span className="brief-bar h-2 overflow-hidden rounded-pill bg-mist">
                    <span className={`block h-full origin-left rounded-pill bg-primary transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)] ${done || i < step ? "scale-x-100" : i === step ? "scale-x-50" : "scale-x-0"}`} />
                  </span>
                  <span className="t-label max-md:hidden">
                    {i + 1}. {q}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <fieldset key={step} className="brief-step flex flex-col gap-5">
          <legend className="mb-5 t-display-l">
            <span className="text-slate">{step + 1}/4 </span>
            {briefSteps[step]}
          </legend>
          <div className="grid gap-3 md:grid-cols-2">
            {current.map((o, i) => (
              <button
                key={o.key}
                type="button"
                data-fx="select"
                aria-pressed={o.on}
                onClick={o.pick}
                style={{ "--i": i } as React.CSSProperties}
                className={`brief-option group flex min-h-8 items-center gap-4 rounded-md px-5 py-4 text-left transition-[background-color,color,transform] duration-[var(--dur-quick)] active:scale-98 ${
                  o.on ? "bg-primary text-on-primary" : "bg-mist text-ink hover:bg-line"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`grid size-6 shrink-0 place-items-center rounded-pill t-label transition-colors ${o.on ? "bg-paper text-primary-deep" : "bg-paper text-slate"}`}
                >
                  {o.on && multi ? <CheckIcon /> : i + 1}
                </span>
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="t-heading-s">{o.label}</span>
                  {o.meta ? <span className={`t-body-s ${o.on ? "text-on-primary" : "text-slate"}`}>{o.meta}</span> : null}
                </span>
              </button>
            ))}
          </div>

          {multi ? (
            <div className="flex flex-col gap-4">
              <label className="flex flex-col gap-2">
                <span className="t-label">{briefCopy.noteLabel}</span>
                <textarea
                  value={st.note}
                  maxLength={280}
                  rows={2}
                  onChange={(e) => setSt((x) => ({ ...x, note: e.target.value }))}
                  placeholder={briefCopy.notePlaceholder}
                  className="min-h-8 resize-y rounded-sm bg-paper px-4 py-3 t-body-m ring-[length:var(--stroke)] ring-line ring-inset placeholder:text-slate focus:ring-primary focus:outline-none"
                />
              </label>
              <button type="button" data-fx="press" onClick={finish} className={buttonClass("primary", "self-start")}>
                {st.have.length || st.note.trim() ? briefCopy.next : briefCopy.skip}
              </button>
            </div>
          ) : null}
          <p className="t-body-s text-slate max-lg:hidden">{briefCopy.keysHint} · Backspace - назад</p>
        </fieldset>
      </div>

      {/* Live receipt */}
      <aside ref={receipt} aria-live="polite" className="col-span-4 scroll-mt-9 md:col-span-8 lg:sticky lg:top-9 lg:col-span-5">
        <div className={`brief-receipt night-stage flex flex-col gap-5 rounded-md bg-night p-5 text-ink-inverse lg:p-6 ${done ? "is-done" : ""}`}>
          <div className="flex items-center justify-between gap-4">
            <h2 className="t-heading-s">{briefCopy.receipt}</h2>
            {done ? (
              <span className="brief-stamp inline-flex items-center gap-2 rounded-pill bg-primary px-4 py-1 t-label text-on-primary">
                <CheckIcon /> Готово
              </span>
            ) : null}
          </div>

          {service ? (
            <dl className="flex flex-col">
              {rows.map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-4 border-b border-dashed border-line-inverse py-3">
                  <dt className="t-body-s text-slate-inverse">{k}</dt>
                  <dd key={v ?? "-"} className={`text-right t-label ${v ? "brief-fill" : "text-slate-inverse"}`}>
                    {v ?? "-"}
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="t-body-m text-slate-inverse">{briefCopy.empty}</p>
          )}

          <div className="flex flex-col gap-1">
            <span className="t-body-s text-slate-inverse">{briefCopy.priceLabel}</span>
            <p className="t-price" aria-label={pkg ? formatPrice(pkg) : undefined}>
              {pkg ? <RollingPrice pkg={pkg} /> : service ? formatPrice(packagesFor(service.id)[0]!) : "-"}
            </p>
            {pkg?.term || pkg?.note ? <span className="t-body-s text-slate-inverse">{[pkg.term, pkg.note].filter(Boolean).join(" · ")}</span> : null}
          </div>

          {service ? (
            <div className="flex flex-col gap-2">
              <span className="t-body-s text-slate-inverse">{briefCopy.previewLabel}</span>
              <div className="brief-bubble self-start rounded-md rounded-tl-xs bg-night-raised p-4">
                <pre className="t-body-s whitespace-pre-wrap font-sans">{message}</pre>
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            {ready ? (
              <a href={whatsappLink(message)} target="_blank" rel="noopener" data-fx="press" className={buttonClass("primary")}>
                <WhatsAppIcon /> Отправить в WhatsApp
              </a>
            ) : (
              <span className={buttonClass("primary", "pointer-events-none opacity-50")} aria-disabled="true">
                <WhatsAppIcon /> Отправить в WhatsApp
              </span>
            )}
            <button type="button" data-fx="press" disabled={!ready} onClick={openTelegram} className={buttonClass("inverse")}>
              <TelegramIcon /> Telegram
            </button>
          </div>
          {copied ? <p className="t-body-s text-slate-inverse">Текст скопирован - вставьте его в чат с {contacts.telegram.display}.</p> : null}
        </div>

        <div className="flex flex-col gap-3 pt-5">
          <p className="t-body-s text-slate">{briefCopy.privacy}</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {service ? (
              <>
                <button type="button" data-fx="select" onClick={restart} className="link t-label">
                  {briefCopy.restart}
                </button>
                <Link href={service.href} className="link t-label">
                  Демо «{service.title}»
                </Link>
              </>
            ) : null}
          </div>
        </div>
      </aside>
    </div>
  );
}
