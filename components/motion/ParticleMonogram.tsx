"use client";

import { useEffect, useRef, useState } from "react";
import { Monogram } from "@/components/brand/Logo";

/**
 * S1: static monogram first (never blocks LCP), the 3D particle mark loads right after.
 * Same experience on phone and desktop. Only the OS "reduce motion" setting keeps the static mark.
 */
export function ParticleMonogram({ className = "" }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let stop: (() => void) | undefined;
    const go = () => {
      import("./particle-engine").then(({ startParticles }) => {
        if (cancelled || !canvas.current || !host.current) return;
        stop = startParticles(canvas.current, host.current, { onReady: () => setLive(true) });
      });
    };
    const idle = "requestIdleCallback" in window;
    const id = idle ? window.requestIdleCallback(go, { timeout: 600 }) : window.setTimeout(go, 300);
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
        className={`absolute inset-x-[6%] top-1/2 w-[88%] -translate-y-1/2 transition-opacity duration-[var(--dur-base)] ${live ? "opacity-0" : "opacity-100"}`}
      />
      <canvas ref={canvas} className="absolute inset-0 size-full cursor-pointer touch-pan-y" />
    </div>
  );
}
