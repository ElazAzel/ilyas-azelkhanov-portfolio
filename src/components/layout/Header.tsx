"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Contact,
  Home,
  Menu,
  Route,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

const links = [
  ["/", "Главная"],
  ["/projects", "Проекты"],
  ["/approach", "Подход"],
  ["/about", "Обо мне"],
  ["/contact", "Контакты"],
] as const;

const mobileLinks = [
  ["/", "Главная", Home],
  ["/projects", "Проекты", BriefcaseBusiness],
  ["/approach", "Подход", Route],
  ["/about", "Обо мне", UserRound],
  ["/contact", "Контакт", Contact],
] as const;

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const activeLabel = mobileLinks.find(([href]) =>
    href === "/" ? pathname === href : pathname.startsWith(href),
  )?.[1] ?? "Портфолио";

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header className="site-header">
        <div className="shell header-row">
          <Link className="brand" href="/" aria-label="Ильяс Азелханов — главная">
            <span className="brand-name">Ильяс Азелханов</span>
            <span className="brand-role">Digital Product Designer<br />& Web Service Expert</span>
          </Link>
          <nav className="desktop-nav" aria-label="Основная навигация">
            {links.map(([href, label]) => (
              <Link key={href} className={pathname === href ? "active" : ""} href={href}>{label}</Link>
            ))}
          </nav>
          <Link className="button button-small desktop-cta" href="/contact">
            Обсудить задачу <ArrowUpRight size={16} aria-hidden />
          </Link>
          <button className="menu-button" onClick={() => setOpen((value) => !value)} aria-label={open ? "Закрыть меню" : "Открыть меню"} aria-expanded={open}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
        <div className="mobile-app-bar">
          <Link className="mobile-app-mark" href="/" aria-label="Ильяс Азелханов — главная">IA</Link>
          <div className="mobile-app-title">
            <span>{activeLabel}</span>
            <small><i aria-hidden /> Доступен для проектов</small>
          </div>
          <Link className="mobile-app-contact" href="/contact" aria-label="Открыть контакты">
            <ArrowUpRight size={18} aria-hidden />
          </Link>
        </div>
        {open && (
          <div className="mobile-sheet" role="dialog" aria-label="Навигация">
            <nav>
              {links.map(([href, label], index) => (
                <Link key={href} href={href}><span>0{index + 1}</span>{label}<ArrowUpRight /></Link>
              ))}
            </nav>
            <Link className="button" href="/contact">Обсудить задачу <ArrowUpRight /></Link>
          </div>
        )}
      </header>
      <nav className="mobile-tabbar" aria-label="Навигация приложения">
        {mobileLinks.map(([href, label, Icon]) => {
          const active = href === "/" ? pathname === href : pathname.startsWith(href);
          return (
            <Link key={href} href={href} className={active ? "active" : ""} aria-current={active ? "page" : undefined}>
              <Icon size={19} strokeWidth={active ? 2.2 : 1.7} aria-hidden />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}