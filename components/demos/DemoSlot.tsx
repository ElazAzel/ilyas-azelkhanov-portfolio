"use client";

import { useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";

type Loader = () => Promise<{ default: ComponentType }>;

const LOADERS: Record<string, Loader> = {
  bots: () => import("./BotDemo"),
  "mini-apps": () => import("./MiniAppDemo"),
  websites: () => import("./XrayDemo"),
};

/** Loads a demo only when it approaches the viewport (CLAUDE.md → Демо). Shows the poster until then. */
export function DemoSlot({ id, poster }: { id: string; poster: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [Demo, setDemo] = useState<ComponentType | null>(null);

  useEffect(() => {
    const el = ref.current;
    const load = LOADERS[id];
    if (!el || !load) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return;
        io.disconnect();
        load().then((m) => setDemo(() => m.default));
      },
      { rootMargin: "50% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [id]);

  return <div ref={ref}>{Demo ? <Demo /> : poster}</div>;
}
