"use client";

import { useEffect, useRef, useState } from "react";
import { Monogram } from "@/components/brand/Logo";

type NavigatorHints = Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };

/**
 * S1: static monogram first (never blocks LCP), particles load after idle.
 * Reduced motion, Save-Data or a weak device keep the static mark.
 */
export function ParticleMonogram({ className = "" }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const nav = navigator as NavigatorHints;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || nav.connection?.saveData || (nav.deviceMemory !== undefined && nav.deviceMemory < 4)) return;

    let cancelled = false;
    let stop: (() => void) | undefined;
    const go = () => {
      import("./particle-engine").then(({ startParticles }) => {
        if (cancelled || !canvas.current || !host.current) return;
        stop = startParticles(canvas.current, host.current, { onReady: () => setLive(true) });
      });
    };
    const idle = "requestIdleCallback" in window;
    const id = idle ? window.requestIdleCallback(go, { timeout: 1500 }) : window.setTimeout(go, 300);
    return () => {
      cancelled = true;
      if (idle) window.cancelIdleCallback(id);
      else window.clearTimeout(id);
      stop?.();
    };
  }, []);

  return (
    <div ref={host} aria-hidden="true" className={`relative aspect-[951/445] ${className}`}>
      <Monogram
        className={`absolute inset-x-[4%] top-1/2 w-[92%] -translate-y-1/2 transition-opacity duration-[var(--dur-base)] ${live ? "opacity-0" : "opacity-100"}`}
      />
      <canvas ref={canvas} className="absolute inset-0 size-full touch-pan-y" />
    </div>
  );
}
