"use client";

import { useEffect, useRef, useState } from "react";
import { autoFlow, manualFlow, sampleRequest, type FlowStep } from "@/content/demos/automation";
import { play } from "@/lib/sfx";
import { haptic } from "@/lib/haptics";

type Mode = "manual" | "auto";
const WHO: Record<FlowStep["who"], string> = { client: "Клиент", human: "Человек", ai: "ИИ", system: "Система" };

const total = (f: FlowStep[]) => f.reduce((a, s) => a + s.minutes, 0);
const fmt = (min: number) => (min >= 1 ? `${Math.round(min)} мин` : `${Math.max(1, Math.round(min * 60))} с`);

/** Automation demo (SPEC.md §8): send one test request through the manual and the automated path and compare. */
export default function AutomationDemo() {
  const [mode, setMode] = useState<Mode>("manual");
  const [step, setStep] = useState(-1);
  const [clock, setClock] = useState(0);
  const [results, setResults] = useState<Partial<Record<Mode, number>>>({});
  const timers = useRef<number[]>([]);
  const running = step >= 0 && step < (mode === "manual" ? manualFlow : autoFlow).length;

  const flow = mode === "manual" ? manualFlow : autoFlow;
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const run = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const perStep = reduce ? 0 : mode === "manual" ? 1100 : 380;
    let acc = 0;
    setClock(0);
    setStep(0);
    play("press");
    flow.forEach((s, i) => {
      acc += s.minutes;
      const at = acc;
      timers.current.push(
        window.setTimeout(() => {
          setStep(i);
          setClock(at);
          if (i > 0) {
            play("tick");
            haptic("light");
          }
          if (i === flow.length - 1) {
            timers.current.push(
              window.setTimeout(() => {
                setStep(flow.length);
                setResults((r) => ({ ...r, [mode]: total(flow) }));
                play("step");
                haptic("success");
              }, perStep),
            );
          }
        }, i * perStep),
      );
    });
  };

  const switchMode = (m: Mode) => {
    if (running) return;
    setMode(m);
    setStep(-1);
    setClock(0);
  };

  const max = Math.max(total(manualFlow), total(autoFlow));

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2 rounded-pill bg-paper p-1" role="radiogroup" aria-label="Как обрабатывается заявка">
        {(["manual", "auto"] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={mode === m}
            data-fx="select"
            disabled={running}
            onClick={() => switchMode(m)}
            className={`min-h-7 rounded-pill px-4 py-2 t-label transition-colors ${mode === m ? "bg-ink text-paper" : "text-ink"}`}
          >
            {m === "manual" ? "Сейчас: вручную" : "С автоматизацией"}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 rounded-md bg-paper p-4 ring-[length:var(--stroke)] ring-line ring-inset">
        <div className="flex items-center justify-between gap-3">
          <p className="t-body-s text-slate">Тестовая заявка</p>
          <p className="t-label tabular-nums" aria-live="polite">
            {step >= 0 ? `прошло: ${fmt(clock)}` : "часы стоят"}
          </p>
        </div>
        <p className="rounded-sm bg-mist px-3 py-2 t-body-s">«{sampleRequest}»</p>
        <ol className="flex flex-col gap-2">
          {flow.map((s, i) => {
            const done = step > i || step === flow.length;
            const now = step === i;
            return (
              <li
                key={s.title}
                className={`flex items-center gap-3 rounded-sm px-3 py-2 transition-colors duration-[var(--dur-base)] ${
                  now ? "bg-primary text-on-primary" : done ? "bg-mist text-ink" : "text-slate"
                }`}
              >
                <span
                  className={`grid size-6 shrink-0 place-items-center rounded-pill t-label ${
                    now ? "bg-paper text-primary-deep" : done ? "bg-ink text-paper" : "bg-mist text-slate"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </span>
                <span className="flex-1 t-body-s">{s.title}</span>
                <span className={`rounded-pill px-2 py-1 t-label ${s.who === "ai" ? "bg-primary-light/30" : ""}`}>{WHO[s.who]}</span>
              </li>
            );
          })}
        </ol>
        <button
          type="button"
          data-fx="press"
          disabled={running}
          onClick={run}
          className="min-h-7 rounded-pill bg-primary px-5 py-3 t-label text-on-primary active:scale-98 disabled:opacity-50"
        >
          {running ? "Заявка в пути…" : step === flow.length ? "Отправить ещё раз" : "Отправить тестовую заявку"}
        </button>
      </div>

      <div className="flex flex-col gap-3 rounded-md bg-night p-4 text-ink-inverse">
        <p className="t-label text-slate-inverse">Клиент получил ответ через (пример)</p>
        {(["manual", "auto"] as const).map((m) => (
          <div key={m} className="flex flex-col gap-1">
            <div className="flex justify-between t-body-s">
              <span>{m === "manual" ? "Вручную" : "С автоматизацией"}</span>
              <span className="tabular-nums">{results[m] !== undefined ? fmt(results[m]!) : "запустите"}</span>
            </div>
            <span className="h-2 overflow-hidden rounded-pill bg-night-raised">
              <span
                className={`block h-full origin-left rounded-pill transition-transform duration-[var(--dur-scene,700ms)] ease-[var(--ease-out)] ${m === "auto" ? "bg-primary-light" : "bg-slate-inverse"}`}
                style={{ transform: `scaleX(${results[m] !== undefined ? Math.max(0.02, results[m]! / max) : 0})` }}
              />
            </span>
          </div>
        ))}
        <p className="t-body-s text-slate-inverse">Прогоните заявку в обоих режимах и сравните. Время — пример, на вашем процессе замерим реальное.</p>
      </div>
    </div>
  );
}
