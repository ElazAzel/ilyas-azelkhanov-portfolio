"use client";

import { useState } from "react";
import { CheckIcon } from "./Icons2";
import { haptic } from "@/lib/haptics";

/** Copies a value and confirms in place for two seconds. */
export function CopyButton({ value, label, className = "" }: { value: string; label: string; className?: string }) {
  const [ok, setOk] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setOk(true);
      haptic("success");
      window.setTimeout(() => setOk(false), 2000);
    } catch {
      setOk(false);
    }
  };
  return (
    <button type="button" data-fx="select" onClick={copy} className={`inline-flex min-h-7 items-center gap-2 t-label ${className}`}>
      {ok ? <CheckIcon /> : <CopyIcon />}
      <span aria-live="polite">{ok ? "Скопировано" : label}</span>
    </button>
  );
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </svg>
  );
}
