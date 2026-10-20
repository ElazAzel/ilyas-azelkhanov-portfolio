// S1 «Монограмма из частиц», объёмная версия (DESIGN.md → Expressive layer).
// Знак AZ выдавлен в глубину, точки проецируются с перспективой и вращаются
// от курсора (desktop), пальца и наклона телефона (mobile). Canvas 2D, без зависимостей.
import { MONOGRAM_PATHS, MONOGRAM_VIEWBOX } from "@/lib/monogram-paths";
import { play } from "@/lib/sfx";
import { haptic } from "@/lib/haptics";

const ANGLE = (39.5 * Math.PI) / 180;
const DIR_X = Math.cos(ANGLE);
const DIR_Y = -Math.sin(ANGLE);
const PAD = 0.06;
const TARGET_POINTS = 3400;

type Options = { onReady?: () => void };
type Orientation = DeviceOrientationEvent;
type OrientationCtor = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<"granted" | "denied"> };

export function startParticles(canvas: HTMLCanvasElement, host: HTMLElement, opts: Options = {}): () => void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  const root = getComputedStyle(document.documentElement);
  const COLORS = [root.getPropertyValue("--color-ink").trim(), root.getPropertyValue("--color-primary").trim()];
  const touch = matchMedia("(pointer: coarse)").matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  let W = 0;
  let H = 0;
  let n = 0;
  let dot = 2;
  let focal = 900;
  // home (object space, centred), current position and velocity
  let hx = new Float32Array(0);
  let hy = new Float32Array(0);
  let hz = new Float32Array(0);
  let px = new Float32Array(0);
  let py = new Float32Array(0);
  let pz = new Float32Array(0);
  let vx = new Float32Array(0);
  let vy = new Float32Array(0);
  let vz = new Float32Array(0);
  let spread = new Float32Array(0);
  let delay = new Float32Array(0);
  let color = new Uint8Array(0);
  // projected screen positions of the last frame (for pointer hit tests)
  let sx = new Float32Array(0);
  let sy = new Float32Array(0);

  // rotation: target from input, eased current
  let rotX = 0;
  let rotY = 0;
  let tRotX = 0;
  let tRotY = 0;
  let mx = -1e5;
  let my = -1e5;
  let pointerIn = false;
  let scroll = 0;
  let raf = 0;
  let visible = true;
  let first = true;
  let introStart = performance.now();
  let gyro = false;

  function sample(intro: boolean) {
    const rect = host.getBoundingClientRect();
    W = rect.width;
    H = rect.height;
    if (W < 10 || H < 10) return;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    focal = Math.max(W, H) * 1.6;

    const scale = Math.min((W * (1 - 2 * PAD)) / MONOGRAM_VIEWBOX.width, (H * (1 - 2 * PAD)) / MONOGRAM_VIEWBOX.height);
    const ox = (W - MONOGRAM_VIEWBOX.width * scale) / 2;
    const oy = (H - MONOGRAM_VIEWBOX.height * scale) / 2;

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
    // Every sample sits on the front face (keeps the mark crisp); a share is copied
    // to the back face and into the depth, which is what reads as volume when it turns.
    const BACK = 0.3;
    const INSIDE = 0.18;
    const step = Math.max(2.5, Math.sqrt((filled * 4) / (TARGET_POINTS / (1 + BACK + INSIDE))));
    dot = Math.max(1.6, step * 0.48);
    const depth = MONOGRAM_VIEWBOX.height * scale * 0.22;

    const pts: number[] = [];
    for (let y = step / 2; y < off.height; y += step) {
      for (let x = step / 2; x < off.width; x += step) {
        const i = ((y | 0) * off.width + (x | 0)) * 4;
        if (img[i + 3]! <= 128) continue;
        const c = img[i + 1]! > img[i]! ? 1 : 0;
        // the blue stroke sits in front of the ink shapes, like in the logo
        const zBase = c ? -depth * 0.35 : 0;
        const X = x - W / 2;
        const Y = y - H / 2;
        pts.push(X, Y, zBase - depth / 2, c);
        if (Math.random() < BACK) pts.push(X, Y, zBase + depth / 2, c);
        if (Math.random() < INSIDE) pts.push(X, Y, zBase + (Math.random() - 0.5) * depth, c);
      }
    }

    n = pts.length / 4;
    hx = new Float32Array(n);
    hy = new Float32Array(n);
    hz = new Float32Array(n);
    px = new Float32Array(n);
    py = new Float32Array(n);
    pz = new Float32Array(n);
    vx = new Float32Array(n);
    vy = new Float32Array(n);
    vz = new Float32Array(n);
    spread = new Float32Array(n);
    delay = new Float32Array(n);
    color = new Uint8Array(n);
    sx = new Float32Array(n);
    sy = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      hx[i] = pts[i * 4]!;
      hy[i] = pts[i * 4 + 1]!;
      hz[i] = pts[i * 4 + 2]!;
      color[i] = pts[i * 4 + 3]!;
      spread[i] = 0.35 + Math.random() * 0.65;
      if (intro) {
        const d = W * (0.3 + Math.random() * 0.7);
        px[i] = hx[i]! - DIR_X * d;
        py[i] = hy[i]! - DIR_Y * d;
        pz[i] = hz[i]! + (Math.random() - 0.3) * focal * 0.8;
        delay[i] = Math.random() * 500 + ((hx[i]! + W / 2) / W) * 300;
      } else {
        px[i] = hx[i]!;
        py[i] = hy[i]!;
        pz[i] = hz[i]!;
      }
    }
    if (intro) introStart = performance.now();
  }

  // Draw order by depth bucket: far points first and fainter.
  const BUCKETS = 4;
  const bucketOf = new Uint8Array(1 << 14);

  function frame(now: number) {
    raf = 0;
    if (!visible || n === 0) return;
    const elapsed = now - introStart;
    const t = now / 1000;

    // idle sway so the mark is never dead, input on top of it
    const swayY = Math.sin(t * 0.6) * 0.18;
    const swayX = Math.sin(t * 0.45 + 1) * 0.08;
    rotY += (tRotY + swayY - rotY) * 0.06;
    rotX += (tRotX + swayX - rotX) * 0.06;
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);

    const sweep = scroll * W * 0.9;
    const R = touch ? 90 : 120;
    const R2 = R * R;
    const cx = W / 2;
    const cy = H / 2;

    if (bucketOf.length < n) return;
    for (let i = 0; i < n; i++) {
      const ramp = Math.min(1, Math.max(0, (elapsed - delay[i]!) / 380));
      const k = 0.06 * ramp;
      const s = spread[i]!;
      const tx = hx[i]! + DIR_X * sweep * s;
      const ty = hy[i]! + DIR_Y * sweep * s;
      const tz = hz[i]! + (s - 0.6) * sweep * 1.4;
      vx[i] = (vx[i]! + (tx - px[i]!) * k) * 0.84;
      vy[i] = (vy[i]! + (ty - py[i]!) * k) * 0.84;
      vz[i] = (vz[i]! + (tz - pz[i]!) * k) * 0.84;

      if (pointerIn) {
        const dx = sx[i]! - mx;
        const dy = sy[i]! - my;
        const d2 = dx * dx + dy * dy;
        if (d2 < R2 && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const f = (1 - d / R) * 2.2;
          vx[i]! += (dx / d) * f;
          vy[i]! += (dy / d) * f;
          vz[i]! -= f * 2.5;
        }
      }
      px[i]! += vx[i]!;
      py[i]! += vy[i]!;
      pz[i]! += vz[i]!;

      // rotate around Y then X, project with perspective
      const x1 = px[i]! * cosY + pz[i]! * sinY;
      const z1 = -px[i]! * sinY + pz[i]! * cosY;
      const y2 = py[i]! * cosX - z1 * sinX;
      const z2 = py[i]! * sinX + z1 * cosX;
      const p = focal / (focal + z2);
      sx[i] = cx + x1 * p;
      sy[i] = cy + y2 * p;
      const b = Math.min(BUCKETS - 1, Math.max(0, Math.floor(((z2 / (focal * 0.25)) + 0.5) * BUCKETS)));
      bucketOf[i] = BUCKETS - 1 - b; // 0 = farthest
      sz[i] = p;
    }

    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx!.clearRect(0, 0, W, H);
    const fade = 1 - Math.min(1, scroll) * 0.85;
    for (let b = 0; b < BUCKETS; b++) {
      ctx!.globalAlpha = fade * (0.45 + (0.55 * (b + 1)) / BUCKETS);
      for (const c of [0, 1]) {
        ctx!.fillStyle = COLORS[c]!;
        ctx!.beginPath();
        for (let i = 0; i < n; i++) {
          if (color[i] !== c || bucketOf[i] !== b) continue;
          const size = dot * sz[i]!;
          ctx!.rect(sx[i]! - size / 2, sy[i]! - size / 2, size, size);
        }
        ctx!.fill();
      }
    }

    if (first) {
      first = false;
      opts.onReady?.();
    }
    raf = requestAnimationFrame(frame);
  }
  let sz = new Float32Array(0);

  const wake = () => {
    if (!raf && visible) raf = requestAnimationFrame(frame);
  };

  const local = (e: PointerEvent) => {
    const r = host.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top, r };
  };

  const onMove = (e: PointerEvent) => {
    const { x, y, r } = local(e);
    mx = x;
    my = y;
    pointerIn = x > -40 && y > -40 && x < r.width + 40 && y < r.height + 40;
    if (!gyro) {
      tRotY = ((x / r.width) * 2 - 1) * 0.5;
      tRotX = -((y / r.height) * 2 - 1) * 0.35;
    }
  };
  const onLeave = () => {
    pointerIn = false;
    if (!gyro) {
      tRotX = 0;
      tRotY = 0;
    }
  };

  // Tap or click on the mark: points burst out and come back.
  const onDown = (e: PointerEvent) => {
    const { x, y } = local(e);
    for (let i = 0; i < n; i++) {
      const dx = sx[i]! - x;
      const dy = sy[i]! - y;
      const d = Math.sqrt(dx * dx + dy * dy) + 20;
      const f = Math.min(30, 2600 / d);
      vx[i]! += (dx / d) * f;
      vy[i]! += (dy / d) * f;
      vz[i]! += (Math.random() - 0.5) * f * 2;
    }
    play("burst");
    haptic("medium");
    void enableGyro();
  };

  const onOrient = (e: Orientation) => {
    if (e.beta == null || e.gamma == null) return;
    gyro = true;
    // phone held upright ≈ beta 50°: tilt around that
    tRotX = Math.max(-0.6, Math.min(0.6, ((e.beta - 50) / 45) * 0.5));
    tRotY = Math.max(-0.7, Math.min(0.7, (e.gamma / 40) * 0.6));
  };

  async function enableGyro() {
    if (gyro || !touch || typeof DeviceOrientationEvent === "undefined") return;
    const C = DeviceOrientationEvent as OrientationCtor;
    try {
      if (typeof C.requestPermission === "function") {
        const res = await C.requestPermission();
        if (res !== "granted") return;
      }
      window.addEventListener("deviceorientation", onOrient as EventListener);
    } catch {
      /* permission denied or not available: finger still works */
    }
  }

  const onScroll = () => {
    const r = host.getBoundingClientRect();
    scroll = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height)));
  };

  const io = new IntersectionObserver(([entry]) => {
    visible = !!entry?.isIntersecting;
    if (visible) wake();
    else if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  });

  let resizeTimer = 0;
  const ro = new ResizeObserver(() => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      sample(false);
      sz = new Float32Array(n);
    }, 120);
  });

  sample(true);
  sz = new Float32Array(n);
  io.observe(host);
  ro.observe(host);
  window.addEventListener("pointermove", onMove, { passive: true });
  host.addEventListener("pointerdown", onDown);
  document.documentElement.addEventListener("pointerleave", onLeave);
  window.addEventListener("scroll", onScroll, { passive: true });
  // Android grants orientation without a prompt; iOS asks on the first tap (see onDown).
  if (touch && typeof (DeviceOrientationEvent as OrientationCtor).requestPermission !== "function") void enableGyro();
  onScroll();
  wake();

  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    ro.disconnect();
    window.clearTimeout(resizeTimer);
    window.removeEventListener("pointermove", onMove);
    host.removeEventListener("pointerdown", onDown);
    document.documentElement.removeEventListener("pointerleave", onLeave);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("deviceorientation", onOrient as EventListener);
  };
}
