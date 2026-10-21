"use client";

import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";

type Loader = () => Promise<{ default: ComponentType }>;

const LOADERS: Record<string, Loader> = {
  bots: () => import("./BotDemo"),
  "mini-apps": () => import("./MiniAppDemo"),
  websites: () => import("./XrayDemo"),
  automation: () => import("./AutomationDemo"),
  training: () => import("./TrainingDemo"),
};

/** Loads a demo only when it approaches the viewport (CLAUDE.md → Демо). Shows the poster until then. */
export function DemoSlot({ id, poster }: { id: string; poster: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [Demo, setDemo] = useState<ComponentType | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const el = ref.current;
    const load = LOADERS[id];
    if (!el || !load) return;
    let cancelled = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return;
        io.disconnect();
        load()
          .then((m) => {
            if (!cancelled) setDemo(() => m.default);
          })
          .catch(() => {
            if (!cancelled) setFailed(true);
          });
      },
      { rootMargin: "50% 0px" },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, [id, attempt]);

  return (
    <div ref={ref} data-demo={id}>
      {Demo ? (
        <Demo />
      ) : (
        <>
          {poster}
          {failed && (
            <div className="pd pd-load-error" role="alert">
              <p>Не удалось загрузить интерактивный проект.</p>
              <button
                type="button"
                className="pd-button pd-button--outline"
                onClick={() => {
                  setFailed(false);
                  setAttempt((value) => value + 1);
                }}
              >
                Повторить загрузку
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
