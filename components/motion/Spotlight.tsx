"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Pointer light shared by the service gallery and CTA. No React renders on movement. */
export function Spotlight({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const move = (event: PointerEvent) => {
      if (media.matches || event.pointerType === "touch") return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
        el.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
        el.style.setProperty(
          "--art-x",
          String((event.clientX - rect.left) / rect.width - 0.5),
        );
        el.style.setProperty(
          "--art-y",
          String((event.clientY - rect.top) / rect.height - 0.5),
        );
        el.dataset.lit = "true";
      });
    };
    const leave = () => {
      cancelAnimationFrame(frame);
      delete el.dataset.lit;
      el.style.setProperty("--art-x", "0");
      el.style.setProperty("--art-y", "0");
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);
  return (
    <div ref={ref} className={`spotlight ${className}`}>
      {children}
    </div>
  );
}
