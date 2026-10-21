// Interface sounds synthesised with Web Audio - no audio files, nothing plays before the first tap or key.
// iOS keeps the default "ambient" audio session, so the silent switch mutes the site like any polite app.

type Sound = "tick" | "press" | "whoosh" | "burst" | "step";

const KEY = "az-sound";
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noise: AudioBuffer | null = null;
let unlocked = false;
const listeners = new Set<(on: boolean) => void>();

export function soundEnabled(): boolean {
  try {
    return localStorage.getItem(KEY) !== "off";
  } catch {
    return true;
  }
}

export function setSoundEnabled(on: boolean) {
  try {
    localStorage.setItem(KEY, on ? "on" : "off");
  } catch {
    /* storage may be blocked; the toggle still works for this page */
  }
  listeners.forEach((l) => l(on));
  if (on) play("tick");
}

export function onSoundChange(fn: (on: boolean) => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function ensure(): AudioContext | null {
  if (!unlocked || typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.35;
    master.connect(ctx.destination);
    noise = ctx.createBuffer(1, ctx.sampleRate * 0.6, ctx.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** Call once on the client: the first real gesture unlocks audio. */
export function initSfx() {
  if (typeof window === "undefined" || unlocked) return;
  const unlock = () => {
    unlocked = true;
    ensure();
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
  };
  window.addEventListener("pointerdown", unlock, { once: true });
  window.addEventListener("keydown", unlock, { once: true });
}

function tone(c: AudioContext, freq: number, end: number, dur: number, gain: number, type: OscillatorType = "sine") {
  const o = c.createOscillator();
  const g = c.createGain();
  const t = c.currentTime;
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  o.frequency.exponentialRampToValueAtTime(end, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(master!);
  o.start(t);
  o.stop(t + dur + 0.02);
}

function hiss(c: AudioContext, from: number, to: number, dur: number, gain: number) {
  const s = c.createBufferSource();
  s.buffer = noise;
  const f = c.createBiquadFilter();
  f.type = "bandpass";
  f.Q.value = 1.2;
  const t = c.currentTime;
  f.frequency.setValueAtTime(from, t);
  f.frequency.exponentialRampToValueAtTime(to, t + dur);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + dur * 0.35);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f).connect(g).connect(master!);
  s.start(t);
  s.stop(t + dur + 0.02);
}

export function play(sound: Sound) {
  if (!soundEnabled()) return;
  const c = ensure();
  if (!c || !master) return;
  switch (sound) {
    case "tick":
      tone(c, 1800, 1400, 0.035, 0.12, "triangle");
      break;
    case "press":
      tone(c, 520, 380, 0.09, 0.3);
      tone(c, 1040, 900, 0.06, 0.08, "triangle");
      break;
    case "step":
      tone(c, 880, 880, 0.12, 0.14);
      tone(c, 1320, 1320, 0.16, 0.06);
      break;
    case "whoosh":
      hiss(c, 300, 2400, 0.45, 0.22);
      break;
    case "burst":
      hiss(c, 4000, 600, 0.3, 0.18);
      tone(c, 660, 220, 0.25, 0.12);
      break;
  }
}
