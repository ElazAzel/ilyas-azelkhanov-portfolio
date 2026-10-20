"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** S5: night surface with a dot grid; dots under the cursor light up. Pure CSS, the cursor only sets two variables. */
export function NightStage({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !matchMedia("(pointer: fine)").matches) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    el.addEventListener("pointermove", move);
    return () => el.removeEventListener("pointermove", move);
  }, []);

  return (
    <div ref={ref} className={`night-stage rounded-md bg-night text-ink-inverse ${className}`}>
      {children}
    </div>
  );
}
