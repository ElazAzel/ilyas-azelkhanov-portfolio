import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary";

const base =
  "inline-flex min-h-7 items-center justify-center gap-2 px-5 py-3 t-label select-none " +
  "transition-[background-color,color,transform] duration-[var(--dur-quick)] ease-[var(--ease-out)] " +
  "active:scale-98 active:duration-[var(--dur-press)] disabled:pointer-events-none disabled:opacity-50";

// Blue is rounded, ink is sharp (DESIGN.md → Overview).
const variants: Record<Variant, string> = {
  primary: "rounded-pill bg-primary text-on-primary hover:bg-primary-deep",
  secondary: "rounded-xs bg-paper text-ink ring-[length:var(--stroke)] ring-ink ring-inset hover:bg-ink hover:text-paper",
};

export function buttonClass(variant: Variant = "primary", extra = "") {
  return `${base} ${variants[variant]} ${extra}`;
}

type LinkProps = ComponentProps<"a"> & { variant?: Variant; icon?: ReactNode };

export function ButtonLink({ variant = "primary", icon, className = "", children, ...rest }: LinkProps) {
  return (
    <a className={buttonClass(variant, className)} {...rest}>
      {icon}
      {children}
    </a>
  );
}

type ButtonProps = ComponentProps<"button"> & { variant?: Variant; icon?: ReactNode };

export function Button({ variant = "primary", icon, className = "", children, type = "button", ...rest }: ButtonProps) {
  return (
    <button type={type} className={buttonClass(variant, className)} {...rest}>
      {icon}
      {children}
    </button>
  );
}
