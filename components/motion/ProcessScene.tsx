"use client";

import { useEffect, useRef } from "react";
import { play } from "@/lib/sfx";
import { haptic } from "@/lib/haptics";

type Step = { title: string; text: string };

/**
 * S4: on desktop the section pins and scroll draws a line through the 4 steps.
 * On phones each step lights up at mid-screen. Every step: sound + haptic. Reduced motion: static.
 * GSAP is loaded only when the section approaches the viewport.
 */
export function ProcessScene({ steps, title }: { steps: readonly Step[]; title: string }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let revert: (() => void) | undefined;
    let cancelled = false;

    const setup = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const fx = () => {
        play("step");
        haptic("light");
      };
      const mm = gsap.matchMedia(el);
      mm.add(
        { desk: "(min-width: 64rem)", phone: "(max-width: 63.99rem)" },
        (ctx) => {
          const { desk } = ctx.conditions as { desk: boolean };
          const items = gsap.utils.toArray<HTMLElement>("[data-step]");
          gsap.set(items.slice(1), { opacity: 0.25 });
          if (desk) {
            // Desktop: the section pins and scroll walks through the steps.
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: el,
                start: "top top",
                end: () => `+=${items.length * 55}%`,
                pin: true,
                pinSpacing: true, // parent <main> is flex: GSAP would otherwise default to false
                scrub: 0.6,
              },
            });
            tl.fromTo("[data-progress]", { scaleY: 0 }, { scaleY: 1, ease: "none", duration: items.length - 1 }, 0);
            items.slice(1).forEach((item, i) => {
              tl.to(item, { opacity: 1, duration: 0.25, ease: "power1.out" }, i + 0.75);
              tl.fromTo(item.querySelector("[data-dot]"), { scale: 0 }, { scale: 1, duration: 0.25 }, i + 0.75);
              tl.call(fx, [], i + 0.75);
            });
          } else {
            // Phone: four steps are taller than the screen, so instead of pinning
            // each step lights up as it reaches the middle — same line, sound and haptic.
            gsap.fromTo(
              "[data-progress]",
              { scaleY: 0 },
              { scaleY: 1, ease: "none", scrollTrigger: { trigger: "[data-list]", start: "top 55%", end: "bottom 55%", scrub: true } },
            );
            items.slice(1).forEach((item) => {
              const dot = item.querySelector("[data-dot]");
              gsap.set(dot, { scale: 0 });
              ScrollTrigger.create({
                trigger: item,
                start: "top 55%",
                onEnter: () => {
                  gsap.to(item, { opacity: 1, duration: 0.3 });
                  gsap.to(dot, { scale: 1, duration: 0.35, ease: "back.out(2.5)" });
                  fx();
                },
                onLeaveBack: () => {
                  gsap.to(item, { opacity: 0.25, duration: 0.3 });
                  gsap.to(dot, { scale: 0, duration: 0.2 });
                },
              });
            });
          }
        },
      );
      ScrollTrigger.refresh();
      revert = () => mm.revert();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          io.disconnect();
          void setup();
        }
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
      revert?.();
    };
  }, []);

  return (
    <section ref={root} className="grid-page content-center gap-y-7 py-8 lg:min-h-dvh">
      <h2 className="col-span-4 t-display-l md:col-span-8 lg:col-span-4">{title}</h2>
      <ol data-list className="relative col-span-4 flex flex-col gap-7 md:col-span-8 lg:col-span-7 lg:col-start-6">
          <span aria-hidden="true" className="absolute top-2 bottom-2 left-2 w-px bg-line" />
          <span
            aria-hidden="true"
            data-progress
            className="absolute top-2 bottom-2 left-2 w-px origin-top bg-primary"
          />
          {steps.map((s, i) => (
            <li key={s.title} data-step className="relative grid grid-cols-[auto_1fr] gap-x-5 pl-0">
              <span
                aria-hidden="true"
                data-dot
                className="relative z-10 mt-2 size-4 rounded-pill bg-primary ring-4 ring-paper"
              />
              <div className="flex flex-col gap-2">
                <h3 className="t-heading-m">
                  <span className="text-slate">{i + 1}. </span>
                  {s.title}
                </h3>
                <p className="measure t-body-l text-slate">{s.text}</p>
              </div>
            </li>
          ))}
      </ol>
    </section>
  );
}
