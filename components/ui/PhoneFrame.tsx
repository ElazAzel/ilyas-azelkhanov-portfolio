import type { ReactNode } from "react";

/** Device mock for bot and Mini App demos. Ink bezel, paper screen. */
export function PhoneFrame({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      className="mx-auto w-full max-w-[var(--phone-w)] rounded-phone bg-ink p-2 shadow-[var(--shadow-phone)]"
    >
      <div className="relative aspect-[9/18.5] overflow-hidden rounded-[calc(var(--radius-phone)-var(--spacing-2))] bg-paper">
        <div aria-hidden="true" className="absolute top-2 left-1/2 h-4 w-9 -translate-x-1/2 rounded-pill bg-ink" />
        {children}
      </div>
    </div>
  );
}
