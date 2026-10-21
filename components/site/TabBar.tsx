"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Bottom tab bar - only when the site is installed to the home screen (display-mode: standalone), CLAUDE.md → Mobile / PWA.
const TABS = [
  { href: "/", label: "Главная", icon: "M4 11 12 4l8 7v9h-5v-6H9v6H4z" },
  { href: "/#services", label: "Услуги", icon: "M4 5h7v7H4zM13 5h7v7h-7zM4 14h7v6H4zM13 14h7v6h-7z" },
  { href: "/work/", label: "Работы", icon: "M4 7h16v12H4zM9 7V4h6v3" },
  { href: "/contact/", label: "Связаться", icon: "M4 5h16v11H8l-4 4z" },
];

export function TabBar() {
  const pathname = usePathname();
  return (
    <nav aria-label="Разделы" className="tabbar fixed inset-x-0 bottom-0 z-20 grid-cols-4 bg-paper pb-[env(safe-area-inset-bottom)] ring-[length:var(--stroke)] ring-line">
      {TABS.map((t) => {
        const on = t.href === "/" ? pathname === "/" : pathname.startsWith(t.href.replace("/#services", "/services"));
        return (
          <Link key={t.href} href={t.href} data-fx="select" aria-current={on ? "page" : undefined} className={`flex min-h-8 flex-col items-center justify-center gap-1 t-label ${on ? "text-primary-deep" : "text-slate"}`}>
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
              <path d={t.icon} />
            </svg>
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
