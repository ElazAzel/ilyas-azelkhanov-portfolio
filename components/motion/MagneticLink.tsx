"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { buttonClass } from "@/components/ui/Button";

type Props = { href: string; children: string; icon?: ReactNode; variant?: "primary" | "secondary" };

/** S3: the button leans toward the cursor (max 6px) and its label rolls on hover. Desktop only. */
export function MagneticLink({ href, children, icon, variant = "primary" }: Props) {
  const wrap = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    if (!matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let x = 0;
    let y = 0;
    let tx = 0;
    let ty = 0;
    const step = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      raf = Math.abs(tx - x) > 0.05 || Math.abs(ty - y) > 0.05 ? requestAnimationFrame(step) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(step);
    };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = ((e.clientX - (r.left + r.width / 2)) / r.width) * 12;
      ty = ((e.clientY - (r.top + r.height / 2)) / r.height) * 8;
      kick();
    };
    const leave = () => {
      tx = 0;
      ty = 0;
      kick();
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  const roll = "block transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)]";
  return (
    <span ref={wrap} className="inline-block will-change-transform">
      <a href={href} className={buttonClass(variant, "group")}>
        {icon}
        <span className="relative block overflow-hidden">
          <span className={`${roll} group-hover:-translate-y-full`}>{children}</span>
          <span aria-hidden="true" className={`${roll} absolute inset-0 translate-y-full group-hover:translate-y-0`}>
            {children}
          </span>
        </span>
      </a>
    </span>
  );
}
