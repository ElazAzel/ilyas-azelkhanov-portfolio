// Yandex Metrica. Off until NEXT_PUBLIC_YM_ID is set at build time (TODO(ilyas): create the counter at metrika.yandex.ru).
export const YM_ID = Number(process.env.NEXT_PUBLIC_YM_ID ?? 0) || 0;

type Ym = (id: number, method: string, ...args: unknown[]) => void;

/** Sends a goal (SPEC.md §1: whatsapp, telegram, brief, demo-<id>). Safe to call when Metrica is off. */
export function goal(name: string) {
  if (!YM_ID || typeof window === "undefined") return;
  (window as unknown as { ym?: Ym }).ym?.(YM_ID, "reachGoal", name);
}
