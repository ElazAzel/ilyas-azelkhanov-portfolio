"use client";

import { useEffect, useState } from "react";
import { onSoundChange, setSoundEnabled, soundEnabled } from "@/lib/sfx";

/** Header control: sounds are on by default, one tap turns them off (remembered). */
export function SoundToggle() {
  const [on, setOn] = useState(true);
  useEffect(() => {
    setOn(soundEnabled());
    return onSoundChange(setOn);
  }, []);
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? "Выключить звук интерфейса" : "Включить звук интерфейса"}
      onClick={() => setSoundEnabled(!on)}
      className="inline-flex min-h-7 min-w-7 items-center justify-center gap-2 rounded-pill t-label text-ink hover:text-primary-deep"
    >
      <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" stroke="none" />
        {on ? (
          <>
            <path d="M15.5 9a4 4 0 0 1 0 6" />
            <path d="M18 6.5a7.5 7.5 0 0 1 0 11" />
          </>
        ) : (
          <path d="M16 9.5l5 5M21 9.5l-5 5" />
        )}
      </svg>
      <span className="max-md:hidden">{on ? "Звук" : "Без звука"}</span>
    </button>
  );
}
