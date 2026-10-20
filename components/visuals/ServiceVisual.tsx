import type { CSSProperties } from "react";
import type { ServiceId } from "@/content/pricing";

// Small looping scenes, one per service. Pure HTML/CSS (keyframes in globals.css → "Service visuals"),
// only transform/opacity are animated. With reduced motion they stay as a still frame.

const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

function Website() {
  return (
    <div className="flex size-full flex-col overflow-hidden rounded-sm bg-paper ring-[length:var(--stroke)] ring-line ring-inset">
      <div className="flex items-center gap-1 px-3 py-2">
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-2 rounded-pill bg-ink/15" />
        ))}
        <span className="ml-3 h-2 flex-1 rounded-pill bg-mist" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <span className="v-build h-4 w-3/4 origin-left rounded-xs bg-ink" style={d(0)} />
        <span className="v-build h-2 w-1/2 origin-left rounded-xs bg-ink/30" style={d(0.2)} />
        <span className="v-build mt-1 h-5 w-1/3 origin-left rounded-pill bg-primary" style={d(0.4)} />
        <div className="mt-auto grid grid-cols-3 gap-2">
          {[0.6, 0.75, 0.9].map((t) => (
            <span key={t} className="v-build aspect-[4/3] origin-bottom rounded-xs bg-mist" style={d(t)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniApp() {
  return (
    <div className="mx-auto flex h-full aspect-[9/17] flex-col gap-2 rounded-[calc(var(--radius-md)+var(--spacing-1))] bg-ink p-2">
      <div className="grid flex-1 grid-cols-2 gap-2 rounded-md bg-paper p-2">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={`flex flex-col gap-1 rounded-sm bg-mist p-2 ${i === 3 ? "v-pick" : ""}`}>
            <span className="aspect-square rounded-xs bg-ink/10" />
            <span className="h-1 w-3/4 rounded-pill bg-ink/30" />
          </span>
        ))}
      </div>
      <span className="v-bump self-center whitespace-nowrap rounded-pill bg-primary px-3 py-1 t-label text-on-primary">Корзина · 2</span>
    </div>
  );
}

function Bot() {
  const msgs: [string, "in" | "out"][] = [
    ["Здравствуйте! Чем помочь?", "in"],
    ["Записаться", "out"],
    ["Выберите время:", "in"],
    ["Завтра, 11:00", "out"],
  ];
  return (
    <div className="flex size-full flex-col justify-end gap-2 overflow-hidden rounded-sm bg-paper p-4 t-body-s ring-[length:var(--stroke)] ring-line ring-inset">
      {msgs.map(([m, side], i) => (
        <span
          key={m}
          className={`v-msg max-w-[80%] rounded-sm px-3 py-2 ${side === "out" ? "self-end bg-primary text-on-primary" : "self-start bg-mist text-ink"}`}
          style={d(i * 0.9)}
        >
          {m}
        </span>
      ))}
    </div>
  );
}

function Automation() {
  const nodes = ["Заявка", "ИИ", "Таблица", "Ответ"];
  return (
    <div className="relative flex size-full items-center justify-between px-2">
      <span className="absolute inset-x-6 top-1/2 h-px -translate-y-1/2 bg-ink/20" />
      <span className="absolute inset-x-6 top-1/2 -translate-y-1/2 [container-type:inline-size]">
        <span className="v-travel block size-3 -translate-y-1/2 rounded-pill bg-primary" />
      </span>
      {nodes.map((n, i) => (
        <span
          key={n}
          className={`v-node relative z-10 rounded-pill px-3 py-2 t-label ${i === 1 ? "bg-primary text-on-primary" : "bg-paper text-ink ring-[length:var(--stroke)] ring-ink ring-inset"}`}
          style={d(i * 0.6)}
        >
          {n}
        </span>
      ))}
    </div>
  );
}

function Training() {
  return (
    <div className="flex size-full flex-col gap-3">
      <div className="flex flex-1 items-end gap-2 rounded-sm bg-night p-4">
        {[0.35, 0.55, 0.45, 0.8, 1].map((h, i) => (
          <span key={i} className="v-grow flex-1 origin-bottom rounded-xs bg-primary-light" style={{ ...d(i * 0.15), height: `${h * 100}%` }} />
        ))}
      </div>
      <div className="flex justify-center gap-2">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <span key={i} className="v-blink size-4 rounded-pill bg-ink" style={d(i * 0.25)} />
        ))}
      </div>
    </div>
  );
}

const MAP: Record<ServiceId, () => React.ReactElement> = {
  websites: Website,
  "mini-apps": MiniApp,
  bots: Bot,
  automation: Automation,
  training: Training,
};

export function ServiceVisual({ id, className = "" }: { id: ServiceId; className?: string }) {
  const V = MAP[id];
  return (
    <div aria-hidden="true" className={`service-visual relative overflow-hidden ${className}`}>
      <div className="absolute inset-0">
        <V />
      </div>
    </div>
  );
}
