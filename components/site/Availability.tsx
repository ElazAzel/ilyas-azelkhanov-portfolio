"use client";

import { useEffect, useState } from "react";
import { availability } from "@/content/contacts";

const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

type Now = { day: number; minutes: number; time: string };

/** Current time in Almaty, independent of the visitor's time zone. day: 0 = Monday. */
function almatyNow(): Now {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: availability.timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const day = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(get("weekday"));
  const h = Number(get("hour"));
  const m = Number(get("minute"));
  return { day, minutes: h * 60 + m, time: `${get("hour")}:${get("minute")}` };
}

function status(n: Now): { open: boolean; text: string } {
  const workday = n.day < 5;
  const start = availability.from * 60;
  const end = availability.to * 60;
  if (workday && n.minutes >= start && n.minutes < end) return { open: true, text: "Сейчас на связи - отвечу в течение 2 часов" };
  if (workday && n.minutes < start) return { open: false, text: `Отвечу сегодня после ${availability.from}:00` };
  // After hours: next working day.
  const next = n.day >= 4 ? "в понедельник" : "завтра";
  return { open: false, text: `Отвечу ${next} после ${availability.from}:00 - сообщение можно оставить сейчас` };
}

/** Live «on air» card: Almaty clock, working-hours track with a now marker, week strip. */
export function Availability() {
  const [now, setNow] = useState<Now | null>(null);
  useEffect(() => {
    const update = () => setNow(almatyNow());
    update();
    const id = window.setInterval(update, 20_000);
    return () => window.clearInterval(id);
  }, []);

  const s = now ? status(now) : null;
  return (
    <div className="night-stage flex flex-col gap-5 rounded-md bg-night p-5 text-ink-inverse" aria-live="polite">
      <div className="flex items-start justify-between gap-5">
        <div className="flex flex-col gap-2">
          <span className="flex items-center gap-3 t-label">
            <span
              className="avail-pulse"
              data-on={s?.open ? "" : undefined}
              style={{ "--avail-color": s?.open ? "var(--color-primary-light)" : "var(--color-slate-inverse)" } as React.CSSProperties}
            />
            {s ? (s.open ? "Онлайн" : "Не в сети") : "…"}
          </span>
          <p className="t-body-m text-slate-inverse">{s?.text ?? "Проверяю время в Алматы"}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="fact-num t-heading-m">{now?.time ?? "--:--"}</span>
          <span className="t-body-s text-slate-inverse">Алматы</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="avail-track" role="img" aria-label={`Рабочие часы с ${availability.from}:00 до ${availability.to}:00`}>
          <span className="avail-window" />
          {now ? <span className="avail-now" style={{ "--now": `${(now.minutes / 1440) * 100}%` } as React.CSSProperties} /> : null}
        </div>
        <div className="flex justify-between t-body-s text-slate-inverse">
          <span>0:00</span>
          <span>
            {availability.from}:00–{availability.to}:00
          </span>
          <span>24:00</span>
        </div>
      </div>

      <ul className="grid grid-cols-7 gap-1" aria-label="Рабочие дни">
        {DAYS.map((d, i) => (
          <li
            key={d}
            className={`grid min-h-7 place-items-center rounded-sm t-label ${
              now?.day === i ? "bg-primary text-on-primary" : i < 5 ? "bg-night-raised" : "text-slate-inverse ring-[length:var(--stroke)] ring-line-inverse ring-inset"
            }`}
          >
            {d}
          </li>
        ))}
      </ul>
    </div>
  );
}
