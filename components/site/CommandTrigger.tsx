"use client";

import { lazy, Suspense, useEffect, useState } from "react";
import { commandCopy } from "@/content/commands";

// The palette is a separate chunk: it loads on the first ⌘K / tap, never with the page.
const CommandPalette = lazy(() => import("./CommandPalette"));

/** Header search button + global shortcuts: ⌘K / Ctrl+K anywhere, «/» outside text fields. */
export function CommandTrigger() {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [mac, setMac] = useState(false);

  useEffect(() => {
    setMac(/Mac|iPhone|iPad/.test(navigator.platform));
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement | null)?.closest("input, textarea, [contenteditable]");
      if ((e.key === "k" || e.key === "K" || e.key === "л" || e.key === "Л") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setLoaded(true);
        setOpen((o) => !o);
      } else if (e.key === "/" && !typing) {
        e.preventDefault();
        setLoaded(true);
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        data-fx="select"
        aria-label={commandCopy.open}
        aria-haspopup="dialog"
        onPointerEnter={() => setLoaded(true)}
        onClick={() => {
          setLoaded(true);
          setOpen(true);
        }}
        className="inline-flex min-h-7 min-w-7 items-center justify-center gap-2 rounded-pill t-label text-ink hover:text-primary-deep"
      >
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4 4" />
        </svg>
        <kbd className="kbd max-lg:hidden">{mac ? "⌘K" : "Ctrl K"}</kbd>
      </button>
      {loaded ? (
        <Suspense fallback={null}>
          <CommandPalette open={open} onClose={() => setOpen(false)} />
        </Suspense>
      ) : null}
    </>
  );
}
