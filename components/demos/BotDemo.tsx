"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { botName, botSteps, demoPhone } from "@/content/demos/bot";
import { play } from "@/lib/sfx";
import { haptic } from "@/lib/haptics";

type Msg = { from: "bot" | "user"; text: string; key: number };
type Lead = { service: string; time: string; key: number };

let seq = 0;
const fill = (t: string, v: { service?: string; time?: string }) =>
  t.replace("{service}", v.service ?? "—").replace("{time}", v.time ?? "—");

/** Bot simulator (SPEC.md §8): scripted dialogue, manager notification on the side. Mock data only. */
export default function BotDemo() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [step, setStep] = useState("start");
  const [typing, setTyping] = useState(false);
  const [vars, setVars] = useState<{ service?: string; time?: string }>({});
  const [leads, setLeads] = useState<Lead[]>([]);
  const chat = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  const botSay = useCallback((id: string, v: { service?: string; time?: string }) => {
    const s = botSteps[id]!;
    setTyping(true);
    s.say.forEach((text, i) => {
      const t = window.setTimeout(() => {
        setMsgs((m) => [...m, { from: "bot", text: fill(text, v), key: ++seq }]);
        if (i === s.say.length - 1) {
          setTyping(false);
          setStep(id);
        }
      }, 650 + i * 700);
      timers.current.push(t);
    });
  }, []);

  useEffect(() => {
    botSay("start", {});
    const list = timers.current;
    return () => list.forEach((t) => window.clearTimeout(t));
  }, [botSay]);

  useEffect(() => {
    const el = chat.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  const press = (label: string, next: string, set?: { service?: string; time?: string }) => {
    if (typing) return;
    const v = { ...vars, ...set };
    if (next === "start" && step === "done") {
      setVars({});
      setMsgs([]);
      botSay("start", {});
      return;
    }
    setVars(v);
    setMsgs((m) => [...m, { from: "user", text: next === "done" ? demoPhone : label, key: ++seq }]);
    if (next === "done") {
      const t = window.setTimeout(() => {
        setLeads((l) => [{ service: v.service ?? "—", time: v.time ?? "—", key: ++seq }, ...l]);
        play("step");
        haptic("success");
      }, 1300);
      timers.current.push(t);
    }
    botSay(next, v);
  };

  const current = botSteps[step]!;

  return (
    <div className="grid gap-5 md:grid-cols-[minmax(0,5fr)_minmax(0,4fr)] md:items-start">
      {/* Client's phone */}
      <div className="mx-auto w-full max-w-[var(--phone-w)] rounded-phone bg-ink p-2 shadow-[var(--shadow-phone)]">
        <div className="flex aspect-[9/17] flex-col overflow-hidden rounded-[calc(var(--radius-phone)-var(--spacing-2))] bg-mist">
          <div className="flex items-center gap-3 bg-paper px-4 pt-6 pb-3">
            <span className="grid size-7 place-items-center rounded-pill bg-primary t-label text-on-primary">А</span>
            <span className="flex flex-col">
              <span className="t-label">{botName}</span>
              <span className="t-body-s text-slate">{typing ? "печатает…" : "бот"}</span>
            </span>
          </div>
          <div ref={chat} className="flex flex-1 flex-col gap-2 overflow-y-auto px-3 py-4 t-body-s" aria-live="polite">
            {msgs.map((m) => (
              <p
                key={m.key}
                className={`v-in max-w-[85%] rounded-sm px-3 py-2 whitespace-pre-line ${
                  m.from === "user" ? "self-end bg-primary text-on-primary" : "self-start bg-paper text-ink"
                }`}
              >
                {m.text}
              </p>
            ))}
            {typing ? (
              <span className="flex gap-1 self-start rounded-sm bg-paper px-3 py-3" aria-label="бот печатает">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="v-dot size-2 rounded-pill bg-slate" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </span>
            ) : null}
          </div>
          <div className="grid gap-2 bg-paper p-3">
            {current.buttons.map((b) => (
              <button
                key={b.label}
                type="button"
                data-fx="select"
                disabled={typing}
                onClick={() => press(b.label, b.next, b.set)}
                className="min-h-7 rounded-sm bg-mist px-3 py-2 t-label text-primary-deep transition-transform active:scale-98 disabled:opacity-40"
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Manager's side */}
      <div className="flex flex-col gap-3 rounded-md bg-night p-5 text-ink-inverse">
        <p className="t-label text-slate-inverse">Telegram менеджера</p>
        {leads.length === 0 ? (
          <p className="t-body-s text-slate-inverse">Запишитесь в боте слева — заявка придёт сюда.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {leads.map((l) => (
              <li key={l.key} className="v-in flex flex-col gap-1 rounded-sm bg-night-raised p-4 t-body-s">
                <span className="flex items-center gap-2 t-label">
                  <span className="size-2 rounded-pill bg-primary-light" aria-hidden="true" /> Новая заявка из бота
                </span>
                <span>Услуга: {l.service}</span>
                <span>Время: {l.time}</span>
                <span className="whitespace-nowrap">Телефон: {demoPhone}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
