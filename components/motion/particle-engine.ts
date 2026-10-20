// S1 «Монограмма из частиц» (DESIGN.md → Expressive layer).
// Canvas 2D, без зависимостей. Цикл кадров крутится только пока что-то движется.
import { MONOGRAM_PATHS, MONOGRAM_VIEWBOX } from "@/lib/monogram-paths";

const ANGLE = (39.5 * Math.PI) / 180;
const DIR_X = Math.cos(ANGLE);
const DIR_Y = -Math.sin(ANGLE);
const PAD = 0.04;

type Options = { onReady?: () => void };

export function startParticles(canvas: HTMLCanvasElement, host: HTMLElement, opts: Options = {}): () => void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  const root = getComputedStyle(document.documentElement);
  const INK = root.getPropertyValue("--color-ink").trim();
  const PRIMARY = root.getPropertyValue("--color-primary").trim();
  const coarse = matchMedia("(pointer: coarse)").matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

  let W = 0;
  let H = 0;
  let n = 0;
  let dot = 2;
  let hx = new Float32Array(0);
  let hy = new Float32Array(0);
  let px = new Float32Array(0);
  let py = new Float32Array(0);
  let vx = new Float32Array(0);
  let vy = new Float32Array(0);
  let spread = new Float32Array(0);
  let delay = new Float32Array(0);
  let color = new Uint8Array(0);

  let mx = -1e5;
  let my = -1e5;
  let pointerIn = false;
  let scroll = 0;
  let raf = 0;
  let visible = true;
  let firstFrame = true;
  let introStart = performance.now();

  function sample(intro: boolean) {
    const rect = host.getBoundingClientRect();
    W = rect.width;
    H = rect.height;
    if (W < 10 || H < 10) return;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);

    const scale = Math.min((W * (1 - 2 * PAD)) / MONOGRAM_VIEWBOX.width, (H * (1 - 2 * PAD)) / MONOGRAM_VIEWBOX.height);
    const ox = (W - MONOGRAM_VIEWBOX.width * scale) / 2;
    const oy = (H - MONOGRAM_VIEWBOX.height * scale) / 2;

    // Raster the mark once: red channel = ink, green channel = primary.
    const off = document.createElement("canvas");
    off.width = Math.ceil(W);
    off.height = Math.ceil(H);
    const o = off.getContext("2d", { willReadFrequently: true });
    if (!o) return;
    o.setTransform(scale, 0, 0, scale, ox, oy);
    for (const p of MONOGRAM_PATHS) {
      o.fillStyle = p.color === "primary" ? "#00ff00" : "#ff0000";
      o.fill(new Path2D(p.d));
    }
    const img = o.getImageData(0, 0, off.width, off.height).data;

    let filled = 0;
    for (let y = 0; y < off.height; y += 2)
      for (let x = 0; x < off.width; x += 2) if (img[(y * off.width + x) * 4 + 3]! > 128) filled++;
    const target = coarse ? 1100 : 2600;
    const step = Math.max(3, Math.sqrt((filled * 4) / target));
    dot = Math.max(1.5, step * 0.5);

    const pts: number[] = [];
    for (let y = step / 2; y < off.height; y += step) {
      for (let x = step / 2; x < off.width; x += step) {
        const i = ((y | 0) * off.width + (x | 0)) * 4;
        if (img[i + 3]! > 128) pts.push(x, y, img[i + 1]! > img[i]! ? 1 : 0);
      }
    }

    n = pts.length / 3;
    hx = new Float32Array(n);
    hy = new Float32Array(n);
    px = new Float32Array(n);
    py = new Float32Array(n);
    vx = new Float32Array(n);
    vy = new Float32Array(n);
    spread = new Float32Array(n);
    delay = new Float32Array(n);
    color = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
      hx[i] = pts[i * 3]!;
      hy[i] = pts[i * 3 + 1]!;
      color[i] = pts[i * 3 + 2]!;
      spread[i] = 0.35 + Math.random() * 0.65;
      if (intro) {
        // Fly in along the AZ diagonal from the lower left.
        const d = W * (0.25 + Math.random() * 0.6);
        px[i] = hx[i]! - DIR_X * d + (Math.random() - 0.5) * 40;
        py[i] = hy[i]! - DIR_Y * d + (Math.random() - 0.5) * 40;
        delay[i] = Math.random() * 450 + (hx[i]! / W) * 250;
      } else {
        px[i] = hx[i]!;
        py[i] = hy[i]!;
      }
    }
    if (intro) introStart = performance.now();
  }

  function frame(now: number) {
    raf = 0;
    if (!visible || n === 0) return;
    const R = coarse ? 70 : 110;
    const R2 = R * R;
    const sweep = scroll * W * 0.9;
    const elapsed = now - introStart;
    let energy = 0;

    for (let i = 0; i < n; i++) {
      const ramp = Math.min(1, Math.max(0, (elapsed - delay[i]!) / 350));
      const k = 0.065 * ramp;
      const tx = hx[i]! + DIR_X * sweep * spread[i]!;
      const ty = hy[i]! + DIR_Y * sweep * spread[i]!;
      let ax = (tx - px[i]!) * k;
      let ay = (ty - py[i]!) * k;
      if (pointerIn) {
        const dx = px[i]! - mx;
        const dy = py[i]! - my;
        const d2 = dx * dx + dy * dy;
        if (d2 < R2 && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const f = (1 - d / R) * 2.4;
          ax += (dx / d) * f;
          ay += (dy / d) * f;
        }
      }
      vx[i] = (vx[i]! + ax) * 0.82;
      vy[i] = (vy[i]! + ay) * 0.82;
      px[i]! += vx[i]!;
      py[i]! += vy[i]!;
      energy += Math.abs(vx[i]!) + Math.abs(vy[i]!) + Math.abs(tx - px[i]!) * 0.02;
    }

    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx!.clearRect(0, 0, W, H);
    ctx!.globalAlpha = 1 - Math.min(1, scroll) * 0.85;
    const h = dot / 2;
    for (const c of [0, 1]) {
      ctx!.fillStyle = c ? PRIMARY : INK;
      ctx!.beginPath();
      for (let i = 0; i < n; i++) if (color[i] === c) ctx!.rect(px[i]! - h, py[i]! - h, dot, dot);
      ctx!.fill();
    }

    if (firstFrame) {
      firstFrame = false;
      opts.onReady?.();
    }
    const introDone = elapsed > 1500;
    if (pointerIn || !introDone || energy > n * 0.02) raf = requestAnimationFrame(frame);
  }

  const R_MARGIN = 40;
  const wake = () => {
    if (!raf && visible) raf = requestAnimationFrame(frame);
  };

  const onPointer = (e: PointerEvent) => {
    const r = host.getBoundingClientRect();
    mx = e.clientX - r.left;
    my = e.clientY - r.top;
    pointerIn = mx > -R_MARGIN && my > -R_MARGIN && mx < r.width + R_MARGIN && my < r.height + R_MARGIN;
    wake();
  };
  const onLeave = () => {
    pointerIn = false;
    wake();
  };
  const onScroll = () => {
    const r = host.getBoundingClientRect();
    const next = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height)));
    if (next !== scroll) {
      scroll = next;
      wake();
    }
  };

  const io = new IntersectionObserver(([entry]) => {
    visible = !!entry?.isIntersecting;
    if (visible) wake();
    else if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  });
  io.observe(host);

  let resizeTimer = 0;
  const ro = new ResizeObserver(() => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      sample(false);
      wake();
    }, 120);
  });

  sample(true);
  ro.observe(host);
  window.addEventListener("pointermove", onPointer, { passive: true });
  document.documentElement.addEventListener("pointerleave", onLeave);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  wake();

  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    ro.disconnect();
    window.clearTimeout(resizeTimer);
    window.removeEventListener("pointermove", onPointer);
    document.documentElement.removeEventListener("pointerleave", onLeave);
    window.removeEventListener("scroll", onScroll);
  };
}
