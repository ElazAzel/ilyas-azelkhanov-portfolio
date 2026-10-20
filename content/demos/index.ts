// Services that already have a live demo (the rest show their scheme until their demo is built).
export const DEMOS = ["bots"] as const;

export function hasDemo(id: string): boolean {
  return (DEMOS as readonly string[]).includes(id);
}
