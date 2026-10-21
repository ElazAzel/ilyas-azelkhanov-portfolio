"use client";

import { useEffect, useState } from "react";
import { serviceById } from "@/content/services";
import { serviceMarkdown } from "@/content/llms";
import { BASE_PATH } from "@/lib/base-path";
import { play } from "@/lib/sfx";
import { haptic } from "@/lib/haptics";
import WebsiteProject from "./WebsiteProject";

type Metrics = {
  lcp: number | null;
  cls: number;
  jsKb: number;
  fontKb: number;
  requests: number;
  dom: number;
  components: number;
  tokens: { colors: number; type: number };
};

const kb = (b: number) => Math.round(b / 1024);

/** Everything here is measured in the visitor's browser right now - no invented numbers (SPEC.md §8). */
function useMetrics(active: boolean): Metrics | null {
  const [m, setM] = useState<Metrics | null>(null);
  useEffect(() => {
    let lcp: number | null = null;
    let cls = 0;
    const obs: PerformanceObserver[] = [];
    try {
      const o1 = new PerformanceObserver((list) => {
        const last = list.getEntries().at(-1);
        if (last) lcp = last.startTime;
      });
      o1.observe({ type: "largest-contentful-paint", buffered: true });
      obs.push(o1);
      const o2 = new PerformanceObserver((list) => {
        for (const e of list.getEntries() as (PerformanceEntry & {
          value: number;
          hadRecentInput: boolean;
        })[]) {
          if (!e.hadRecentInput) cls += e.value;
        }
      });
      o2.observe({ type: "layout-shift", buffered: true });
      obs.push(o2);
    } catch {
      /* Safari has no LCP / layout-shift entries: those fields stay empty */
    }
    const read = () => {
      const res = performance.getEntriesByType(
        "resource",
      ) as PerformanceResourceTiming[];
      const size = (r: PerformanceResourceTiming) =>
        r.transferSize || r.encodedBodySize || 0;
      const classes = Array.from(
        document.querySelectorAll<HTMLElement>("[class]"),
      ).flatMap((e) => Array.from(e.classList));
      setM({
        lcp,
        cls,
        jsKb: kb(
          res
            .filter((r) => r.name.endsWith(".js"))
            .reduce((a, r) => a + size(r), 0),
        ),
        fontKb: kb(
          res
            .filter((r) => r.name.endsWith(".woff2"))
            .reduce((a, r) => a + size(r), 0),
        ),
        requests: res.length + 1,
        dom: document.getElementsByTagName("*").length,
        components: document.querySelectorAll("[data-xray]").length,
        tokens: {
          colors: new Set(
            classes
              .filter((c) =>
                /^(bg|text|ring)-(paper|mist|ink|slate|line|primary|night|on-)/.test(
                  c,
                ),
              )
              .map((c) =>
                c.replace(/^(bg|text|ring)-/, "").replace(/\/.*/, ""),
              ),
          ).size,
          type: new Set(classes.filter((c) => c.startsWith("t-"))).size,
        },
      });
    };
    read();
    const id = window.setInterval(read, 1500);
    return () => {
      window.clearInterval(id);
      obs.forEach((o) => o.disconnect());
    };
  }, [active]);
  return m;
}

function SiteInspector() {
  const [xray, setXray] = useState(false);
  const [machine, setMachine] = useState(false);
  const metrics = useMetrics(xray);
  const md = serviceMarkdown(serviceById("websites"));

  useEffect(() => {
    document.documentElement.classList.toggle("xray", xray);
    return () => document.documentElement.classList.remove("xray");
  }, [xray]);

  const toggle = (on: boolean, set: (v: boolean) => void) => {
    set(on);
    play(on ? "step" : "tick");
    haptic("light");
  };

  const rows: [string, string][] = metrics
    ? [
        [
          "LCP - главный контент появился",
          metrics.lcp === null
            ? "браузер не отдаёт"
            : `${(metrics.lcp / 1000).toFixed(2)} с`,
        ],
        ["CLS - сдвиги вёрстки", metrics.cls.toFixed(3)],
        ["JavaScript загружено", `${metrics.jsKb} KB`],
        ["Шрифты", `${metrics.fontKb} KB`],
        ["Запросов", String(metrics.requests)],
        ["Элементов на странице", String(metrics.dom)],
        ["Размеченных компонентов", String(metrics.components)],
        [
          "Токенов цвета / текста в работе",
          `${metrics.tokens.colors} / ${metrics.tokens.type}`,
        ],
      ]
    : [];

  return (
    <div className="flex flex-col gap-4">
      {xray ? (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-40"
        >
          <div className="container-page grid-page h-full">
            {Array.from({ length: 12 }, (_, i) => (
              <span
                key={i}
                className={`h-full bg-primary/10 ${i >= 4 ? "max-md:hidden" : ""} ${i >= 8 ? "max-lg:hidden" : ""}`}
              />
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2" role="group" aria-label="Режимы">
        <button
          type="button"
          aria-pressed={xray}
          data-fx="select"
          onClick={() => toggle(!xray, setXray)}
          className={`min-h-7 rounded-pill px-5 py-3 t-label ${xray ? "bg-primary text-on-primary" : "bg-paper text-ink ring-[length:var(--stroke)] ring-ink ring-inset"}`}
        >
          {xray ? "Выключить рентген" : "Включить рентген"}
        </button>
        <button
          type="button"
          aria-pressed={machine}
          data-fx="select"
          onClick={() => toggle(!machine, setMachine)}
          className={`min-h-7 rounded-pill px-5 py-3 t-label ${machine ? "bg-primary text-on-primary" : "bg-paper text-ink ring-[length:var(--stroke)] ring-ink ring-inset"}`}
        >
          {machine ? "Показать как видит человек" : "Показать как видит машина"}
        </button>
      </div>

      {machine ? (
        <div className="flex flex-col gap-3">
          <pre className="max-h-[28rem] overflow-auto rounded-sm bg-night p-4 t-code whitespace-pre-wrap text-ink-inverse">
            {md}
          </pre>
          <p className="t-body-s text-slate">
            Так эту страницу читают ChatGPT, Claude и поисковые ИИ. Весь сайт в
            этом виде -{" "}
            <a
              href={`${BASE_PATH}/llms.txt`}
              className="link"
              target="_blank"
              rel="noopener"
            >
              llms.txt
            </a>
            .
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 rounded-sm bg-night p-4 text-ink-inverse">
          <p className="t-label text-slate-inverse">
            Измерено в вашем браузере прямо сейчас
          </p>
          <dl className="grid gap-x-4 gap-y-2 t-code">
            {rows.map(([k, v]) => (
              <div
                key={k}
                className="flex items-baseline justify-between gap-4 border-b-[length:var(--stroke)] border-line-inverse pb-2"
              >
                <dt className="text-slate-inverse">{k}</dt>
                <dd className="text-primary-light">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}

export default function XrayDemo() {
  const [tab, setTab] = useState("website");
  return (
    <div className="pd website-project">
      <div className="pd-demo-switch" aria-label="Режим проекта">
        <button
          type="button"
          aria-pressed={tab === "website"}
          onClick={() => setTab("website")}
        >
          Сайт интерьерной студии
        </button>
        <button
          type="button"
          aria-pressed={tab === "inspector"}
          onClick={() => setTab("inspector")}
        >
          Рентген этого сайта
        </button>
      </div>
      {tab === "website" ? <WebsiteProject /> : <SiteInspector />}
      <p className="pd-disclaimer">
        Демонстрационный проект: каталог, страницы проектов и рабочий
        конструктор брифа.
      </p>
    </div>
  );
}
