import type { ComponentProps } from "react";

type Props = ComponentProps<"input"> & { label: string; hint?: string };

export function Field({ label, hint, id, className = "", ...rest }: Props) {
  const inputId = id ?? `f-${label}`;
  return (
    <label htmlFor={inputId} className={`flex flex-col gap-2 ${className}`}>
      <span className="t-label">{label}</span>
      <input
        id={inputId}
        className="min-h-7 rounded-sm bg-paper px-4 py-3 t-body-m text-ink ring-[length:var(--stroke)] ring-line ring-inset placeholder:text-slate hover:ring-slate focus-visible:ring-primary"
        {...rest}
      />
      {hint ? <span className="t-body-s text-slate">{hint}</span> : null}
    </label>
  );
}
