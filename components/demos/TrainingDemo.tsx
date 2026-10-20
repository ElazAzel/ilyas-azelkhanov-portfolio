"use client";

import { useMemo, useState } from "react";
import { baseModules, formats, groupSizes, places, roles } from "@/content/training";
import { packages } from "@/content/pricing";
import { whatsappLink } from "@/content/contacts";
import { WhatsAppIcon } from "@/components/ui/Icons";

const NBSP = " ";
const tenge = (n: number) => `${n.toLocaleString("ru-RU").replace(/\s/g, NBSP)}${NBSP}₸`;
const rate = packages.find((p) => p.id === "training-corporate")!.from!;

function Chips<T extends { id: string; label: string }>({ legend, items, value, onPick }: { legend: string; items: readonly T[]; value: string; onPick: (id: string) => void }) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 t-label">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {items.map((i) => (
          <button
            key={i.id}
            type="button"
            data-fx="select"
            aria-pressed={value === i.id}
            onClick={() => onPick(i.id)}
            className={`min-h-7 rounded-pill px-4 py-2 t-label transition-colors ${value === i.id ? "bg-primary text-on-primary" : "bg-paper text-ink ring-[length:var(--stroke)] ring-line ring-inset hover:ring-ink"}`}
          >
            {i.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

/** Training program builder (SPEC.md §8): department → format → group → sample program and price, request to WhatsApp. */
export default function TrainingDemo() {
  const [role, setRole] = useState(roles[0]!.id);
  const [format, setFormat] = useState<string>(formats[0].id);
  const [size, setSize] = useState<string>(groupSizes[1].id);
  const [place, setPlace] = useState<string>(places[0]);

  const r = roles.find((x) => x.id === role)!;
  const f = formats.find((x) => x.id === format)!;
  const g = groupSizes.find((x) => x.id === size)!;
  const modules = useMemo(() => {
    const n = f.id === "intensive" ? 3 : f.id === "day" ? 4 : 5;
    return [baseModules[0]!, ...r.modules, baseModules[1]!].slice(0, n);
  }, [r, f]);
  const price = f.hours * rate * g.groups;

  const text = [
    "Здравствуйте, Ильяс! Интересует корпоративный тренинг по ИИ.",
    `— Отдел: ${r.label}`,
    `— Формат: ${f.label} (${f.note}), ${place.toLowerCase()}`,
    `— Группа: ${g.label}`,
    `— Ориентир с сайта: ${tenge(price).replace(/ /g, " ")}`,
    "Пришлите, пожалуйста, программу.",
  ].join("\n");

  return (
    <div className="flex flex-col gap-5">
      <Chips legend="1. Для кого" items={roles} value={role} onPick={setRole} />
      <Chips legend="2. Формат" items={formats} value={format} onPick={setFormat} />
      <Chips legend="3. Сколько человек" items={groupSizes} value={size} onPick={setSize} />
      <Chips legend="4. Где" items={places.map((p) => ({ id: p, label: p }))} value={place} onPick={setPlace} />

      <div className="flex flex-col gap-4 rounded-md bg-night p-5 text-ink-inverse">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className="t-heading-s">Пример программы: {r.label.toLowerCase()}</p>
          <p className="t-body-s text-slate-inverse">{f.note}</p>
        </div>
        <ol key={`${role}-${format}`} className="flex flex-col gap-2">
          {modules.map((m, i) => (
            <li key={m} className="v-in flex gap-3 rounded-sm bg-night-raised px-3 py-2 t-body-s" style={{ animationDelay: `${i * 60}ms` }}>
              <span className="t-label text-primary-light">{i + 1}</span>
              {m}
            </li>
          ))}
        </ol>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="t-body-s text-slate-inverse">Ориентир</span>
            <span className="t-price">{tenge(price)}</span>
            <span className="t-body-s text-slate-inverse">
              {f.hours} ч × {tenge(rate)}
              {g.groups > 1 ? ` × ${g.groups} группы` : ""}
            </span>
          </div>
          <a href={whatsappLink(text)} data-fx="press" className="inline-flex min-h-7 items-center gap-2 rounded-pill bg-primary px-5 py-3 t-label text-on-primary active:scale-98">
            <WhatsAppIcon /> Запросить программу
          </a>
        </div>
        <p className="t-body-s text-slate-inverse">Пример. Финальная программа — под вашу команду.</p>
      </div>
    </div>
  );
}
