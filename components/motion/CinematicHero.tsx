"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { MagneticLink } from "@/components/motion/MagneticLink";
import { buttonClass } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { contacts, whatsappLink } from "@/content/contacts";
import { heroChapters, heroFrames, heroIntro, heroOutro } from "@/content/hero";
import { BASE_PATH } from "@/lib/base-path";
import { haptic } from "@/lib/haptics";
import { play } from "@/lib/sfx";

const hello = whatsappLink("Здравствуйте, Ильяс! Хочу обсудить задачу.");
const N = heroFrames.count;
const INTRO_END = 29; // frames 0–29: the parts fly in and assemble (plays once on load)
const INTRO_MS = 1800;

const src = (portrait: boolean, i: number) =>
  `${BASE_PATH}${portrait ? heroFrames.portrait : heroFrames.landscape}${String(i).padStart(3, "0")}.webp`;

/** Load order: the intro frames first, then the rest coarse-to-fine so scrubbing works before everything arrives. */
function loadOrder(): number[] {
  const seen = new Set<number>();
  const out: number[] = [];
  const add = (i: number) => {
    if (i < N && !seen.has(i)) {
      seen.add(i);
      out.push(i);
    }
  };
  for (let i = 0; i <= INTRO_END; i++) add(i);
  for (const step of [8, 4, 2, 1]) for (let i = INTRO_END; i < N; i += step) add(i);
  add(N - 1);
  return out;
}

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * S1: cinematic hero. A 3D render of the AZ mark (96 frames) is scrubbed by scroll on a canvas,
 * chapters of text change over it. On top of a plain frame sequence: tilt toward the cursor or the
 * phone's gyroscope, a sound and a tap of vibration on each chapter, frames loaded coarse-to-fine.
 */
export function CinematicHero() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = root.current;
    const cv = canvas.current;
    const wrap = media.current;
    if (!section || !cv || !wrap) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const chapters = Array.from(section.querySelectorAll<HTMLElement>("[data-ch]"));

    let portrait = innerWidth / innerHeight < 1;
    let images: (HTMLImageElement | null)[] = [];
    let drawn = -1;
    let cssW = 0;
    let cssH = 0;

    const load = () => {
      images = new Array(N).fill(null);
      drawn = -1;
      const set = portrait;
      const order = reduced ? [N - 1] : loadOrder();
      let k = 0;
      // Up to 6 requests in flight; each finished image starts the next one.
      const next = () => {
        const i = order[k++];
        if (i === undefined || set !== portrait) return;
        const img = new Image();
        img.decoding = "async";
        img.src = src(set, i);
        img
          .decode()
          .then(() => {
            if (set !== portrait) return;
            images[i] = img;
            if (Math.abs(i - frame) < Math.abs(drawn - frame) || drawn < 0) draw(true);
          })
          .catch(() => {})
          .finally(next);
      };
      for (let j = 0; j < 6; j++) next();
    };

    const nearest = (i: number) => {
      for (let d = 0; d < N; d++) {
        if (images[i - d]) return i - d;
        if (images[i + d]) return i + d;
      }
      return -1;
    };

    const resize = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, 2);
      cssW = r.width;
      cssH = r.height;
      cv.width = Math.round(r.width * dpr);
      cv.height = Math.round(r.height * dpr);
      const nowPortrait = innerWidth / innerHeight < 1;
      if (nowPortrait !== portrait) {
        portrait = nowPortrait;
        load();
      }
      draw(true);
    };

    let frame = reduced ? N - 1 : 0;
    const draw = (force = false) => {
      const i = nearest(Math.round(frame));
      if (i < 0 || (i === drawn && !force)) return;
      const img = images[i];
      if (!img) return;
      const s = Math.max(cv.width / img.naturalWidth, cv.height / img.naturalHeight);
      const w = img.naturalWidth * s;
      const h = img.naturalHeight * s;
      ctx.drawImage(img, (cv.width - w) / 2, (cv.height - h) / 2, w, h);
      if (drawn < 0) cv.dataset.ready = "";
      drawn = i;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(cv);
    load();
    if (reduced) return () => ro.disconnect();

    // Scroll → progress → frame. The intro assembles the mark once, then scroll takes over.
    const start = performance.now();
    let progress = 0;
    let active = -1;
    let raf = 0;
    let visible = true;
    let tiltX = 0;
    let tiltY = 0;
    let tTiltX = 0;
    let tTiltY = 0;

    const readProgress = () => {
      const r = section.getBoundingClientRect();
      const range = r.height - cssH;
      progress = range > 0 ? clamp(-r.top / range) : 0;
    };

    const chapterState = (p: number) => {
      const marks = [0, ...heroChapters.map((c) => c.at), 1];
      chapters.forEach((el, idx) => {
        let o: number;
        if (idx === 0) o = 1 - smooth(0.05, 0.14, p);
        else if (idx === chapters.length - 1) o = smooth(0.84, 0.93, p);
        else o = 1 - smooth(0.06, 0.13, Math.abs(p - (marks[idx] ?? 0)));
        const shift = idx === 0 ? -p * 120 : (p - (marks[idx] ?? 0)) * -90;
        el.style.opacity = o.toFixed(3);
        el.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0)`;
        el.inert = o < 0.5;
      });
      const now = marks.reduce((best, m, idx) => (Math.abs(p - m) < Math.abs(p - (marks[best] ?? 0)) ? idx : best), 0);
      if (active >= 0 && now !== active) {
        play("step");
        haptic("light");
      }
      active = now;
      if (bar.current) bar.current.style.transform = `scaleX(${p.toFixed(4)})`;
    };

    const tick = (now: number) => {
      raf = 0;
      const intro = clamp((now - start) / INTRO_MS);
      const scrollFrame = INTRO_END + progress * (N - 1 - INTRO_END);
      const target = intro < 1 ? Math.max(ease(intro) * INTRO_END, progress > 0 ? scrollFrame * ease(intro) : 0) : scrollFrame;
      frame += (target - frame) * (intro < 1 ? 1 : 0.2);
      if (Math.abs(target - frame) < 0.02) frame = target;
      draw();
      tiltX += (tTiltX - tiltX) * 0.08;
      tiltY += (tTiltY - tiltY) * 0.08;
      wrap.style.transform = `perspective(1400px) rotateX(${(-tiltY * 4).toFixed(2)}deg) rotateY(${(tiltX * 5).toFixed(2)}deg) scale(1.06)`;
      chapterState(progress);
      const moving = intro < 1 || frame !== target || Math.abs(tTiltX - tiltX) > 0.002 || Math.abs(tTiltY - tiltY) > 0.002;
      if (moving && visible) raf = requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!raf && visible) raf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      readProgress();
      kick();
    };
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      tTiltX = (e.clientX / innerWidth) * 2 - 1;
      tTiltY = (e.clientY / innerHeight) * 2 - 1;
      kick();
    };
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.beta == null || e.gamma == null) return;
      tTiltX = clamp(e.gamma / 30, -1, 1);
      tTiltY = clamp((e.beta - 45) / 30, -1, 1);
      kick();
    };
    type OrientationCtor = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<"granted" | "denied"> };
    const Orient = typeof DeviceOrientationEvent !== "undefined" ? (DeviceOrientationEvent as OrientationCtor) : null;
    let gyro = false;
    const enableGyro = async () => {
      if (gyro || !Orient) return;
      gyro = true;
      try {
        if (typeof Orient.requestPermission === "function" && (await Orient.requestPermission()) !== "granted") return;
        addEventListener("deviceorientation", onOrient);
      } catch {
        gyro = false;
      }
    };
    // Android gives orientation without asking; iOS asks after the first tap on the scene.
    const coarse = matchMedia("(pointer: coarse)").matches;
    if (coarse && Orient && typeof Orient.requestPermission !== "function") void enableGyro();
    const onTap = () => void enableGyro();

    const io = new IntersectionObserver(([e]) => {
      visible = !!e?.isIntersecting;
      if (visible) kick();
    });
    io.observe(section);
    readProgress();
    chapterState(progress);
    kick();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("pointermove", onPointer, { passive: true });
    if (coarse) section.addEventListener("pointerdown", onTap, { once: true });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      removeEventListener("scroll", onScroll);
      removeEventListener("pointermove", onPointer);
      removeEventListener("deviceorientation", onOrient);
      section.removeEventListener("pointerdown", onTap);
      portrait = !portrait; // stops in-flight loads from writing into a dead component
    };
  }, []);

  return (
    <section ref={root} aria-label="Сделаю и научу" className="cine">
      <div className="cine-stage">
        <div ref={media} className="cine-media" aria-hidden="true">
          <picture>
            <source media="(max-aspect-ratio: 1/1)" srcSet={src(true, 0)} />
            <img src={src(false, 0)} alt="" fetchPriority="high" className="cine-poster" />
          </picture>
          <canvas ref={canvas} className="cine-canvas" />
        </div>

        <div className="container-page cine-copy">
          <div data-ch className="cine-ch">
            <h1 className="t-display-xl">{heroIntro.title}</h1>
            <p className="measure t-body-l text-ink-inverse">{heroIntro.lead}</p>
            <div className="flex flex-wrap items-center gap-3">
              <MagneticLink href={hello} icon={<WhatsAppIcon />}>
                Написать в WhatsApp
              </MagneticLink>
              <Link href="/brief/" data-fx="press" className={buttonClass("inverse")}>
                Оценить задачу
              </Link>
            </div>
            <p className="cine-hint t-body-s text-slate-inverse">
              <span aria-hidden="true" className="cine-hint-dot" />
              {heroIntro.hint}
            </p>
          </div>

          {heroChapters.map((c) => (
            <div key={c.title} data-ch className="cine-ch">
              <h2 className="t-display-l">{c.title}</h2>
              <p className="measure t-body-l text-slate-inverse">{c.text}</p>
            </div>
          ))}

          <div data-ch className="cine-ch">
            <h2 className="t-display-l">{heroOutro.title}</h2>
            <p className="t-body-m text-slate-inverse">{contacts.sla}</p>
            <div className="flex flex-wrap items-center gap-3">
              <a href={hello} data-fx="press" className={buttonClass("primary")}>
                <WhatsAppIcon />
                Написать в WhatsApp
              </a>
              <Link href="/brief/" data-fx="press" className={buttonClass("inverse")}>
                Оценить задачу
              </Link>
            </div>
          </div>
        </div>

        <div className="cine-progress" aria-hidden="true">
          <div ref={bar} className="cine-progress-bar" />
        </div>
      </div>
    </section>
  );
}
