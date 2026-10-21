"use client";

import { useEffect } from "react";
import { initSfx, play } from "@/lib/sfx";
import { haptic } from "@/lib/haptics";

/**
 * One delegated listener gives sound + haptics to anything marked with data-fx:
 *   data-fx="press"  - buttons and CTAs (press sound, medium haptic)
 *   data-fx="select" - chips, toggles (tick, light haptic)
 *   data-fx="hover"  - rows that tick on mouse hover (desktop) and press on tap
 */
export function Feedback() {
  useEffect(() => {
    initSfx();
    const down = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-fx]");
      if (!el) return;
      const fx = el.dataset.fx;
      if (fx === "select") {
        play("tick");
        haptic("light");
      } else {
        play("press");
        haptic("medium");
      }
    };
    let lastHover: Element | null = null;
    const over = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const el = (e.target as Element | null)?.closest("[data-fx]");
      if (el && el !== lastHover) play("tick");
      lastHover = el ?? null;
    };
    document.addEventListener("pointerdown", down, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    return () => {
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("pointerover", over);
    };
  }, []);
  return null;
}
