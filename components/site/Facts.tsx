"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { facts, type Fact } from "@/content/facts";

/** Number that counts up once when it scrolls into view. Static with reduced motion. */
function Count({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(value);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e?.isIntersecting) return;
      io.disconnect();
      setN(0);
      const start = performance.now();
      const tick = (t: number) => {
        const k = Math.min(1, (t - start) / 900);
        setN(Math.round(value * (1 - (1 - k) ** 3)));
        if (k < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);
  return <span ref={ref}>{n}</span>;
}

function Tile({ f, wide }: { f: Fact; wide: boolean }) {
  const body = (
    <>
      <span className={`fact-num ${wide ? "t-display-xl" : "t-display-l"}`}>
        <Count value={f.value} />
        <span className={wide ? "text-primary-light" : "text-primary-deep"}>{f.suffix}</span>
      </span>
      <span className={wide ? "t-heading-s text-ink-inverse" : "t-body-m text-slate"}>{f.label}</span>
    </>
  );
  const cls = `flex h-full justify-between gap-5 rounded-md p-5 lg:p-6 ${
    wide ? "night-stage flex-col bg-night text-ink-inverse" : "flex-col bg-mist text-ink"
  }`;
  return f.href ? (
    <Link href={f.href} data-fx="hover" className={`${cls} transition-transform duration-[var(--dur-quick)] hover:-translate-y-1`}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}

/** First fact spans the row (dark), the other two sit below it. */
export function Facts() {
  return (
    <ul className="grid h-full grid-cols-2 grid-rows-[auto_auto] gap-3 lg:gap-4">
      {facts.map((f, i) => (
        <li key={f.label} className={`min-w-0 ${i === 0 ? "col-span-2" : ""}`}>
          <Tile f={f} wide={i === 0} />
        </li>
      ))}
    </ul>
  );
}
