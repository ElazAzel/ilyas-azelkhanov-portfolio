"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { LogoInline } from "@/components/brand/Logo";
import { SoundToggle } from "@/components/motion/SoundToggle";
import { buttonClass } from "@/components/ui/Button";
import { WhatsAppIcon, TelegramIcon } from "@/components/ui/Icons";
import { CloseIcon, MenuIcon } from "@/components/ui/Icons2";
import { menuLinks, nav } from "@/content/nav";
import { services } from "@/content/services";
import { contacts, telegramLink, whatsappLink } from "@/content/contacts";

const hello = whatsappLink("Здравствуйте, Ильяс! Хочу обсудить задачу.");

export function Header() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  useEffect(() => setMounted(true), []);
  useEffect(() => setOpen(false), [pathname]);
  useLayoutEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
      closeButton.current?.focus();
    } else if (!open && el.open) el.close();
  }, [open, mounted]);
  useEffect(() => {
    if (!open) return;
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const desktop = matchMedia("(min-width: 1024px)");
    const resize = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", resize);
    return () => {
      document.documentElement.style.overflow = previous;
      desktop.removeEventListener("change", resize);
    };
  }, [open]);

  return (
    <>
      <header
        data-xray="Header"
        className="site-header sticky top-0 z-30 bg-paper"
      >
        <div className="container-page flex min-h-8 items-center justify-between gap-5">
          <Link href="/" aria-label="Azelkhanov - на главную" data-fx="select">
            <LogoInline className="inline-flex items-center gap-3" />
          </Link>
          <nav
            aria-label="Основное"
            className="flex items-center gap-5 max-lg:hidden"
          >
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                data-fx="select"
                aria-current={pathname === n.href ? "page" : undefined}
                className="t-label underline-offset-8 hover:text-primary-deep aria-[current=page]:text-primary-deep aria-[current=page]:underline"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <SoundToggle />
            <a
              href={hello}
              data-fx="press"
              className={buttonClass("primary", "max-lg:hidden")}
            >
              <WhatsAppIcon />
              WhatsApp
            </a>
            <button
              type="button"
              data-fx="select"
              aria-expanded={open}
              aria-controls="site-menu"
              aria-haspopup="dialog"
              aria-label="Открыть меню"
              onClick={() => setOpen(true)}
              className="grid size-7 place-items-center rounded-xs bg-ink text-paper lg:hidden"
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>
      {mounted &&
        createPortal(
          <dialog
            ref={dialog}
            id="site-menu"
            className="site-menu-dialog"
            aria-label="Меню сайта"
            data-lenis-prevent
            onCancel={() => setOpen(false)}
            onClose={() => setOpen(false)}
          >
            <div className="site-menu-topbar">
              <Link
                href="/"
                aria-label="Azelkhanov - на главную"
                onClick={() => setOpen(false)}
              >
                <LogoInline className="inline-flex items-center gap-3" />
              </Link>
              <button
                ref={closeButton}
                type="button"
                autoFocus
                data-fx="select"
                aria-label="Закрыть меню"
                onClick={() => setOpen(false)}
                className="grid size-7 place-items-center rounded-xs bg-ink text-paper"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="site-menu-content">
              <nav aria-label="Услуги">
                <ul className="site-menu-services">
                  {services.map((s) => (
                    <li key={s.id}>
                      <Link
                        href={s.href}
                        onClick={() => setOpen(false)}
                        data-fx="press"
                        className="t-heading-s"
                      >
                        {s.title}
                        <span aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <nav aria-label="Страницы сайта">
                <ul className="site-menu-pages">
                  {menuLinks.map((n) => (
                    <li key={n.href}>
                      <Link
                        href={n.href}
                        onClick={() => setOpen(false)}
                        data-fx="press"
                        aria-current={pathname === n.href ? "page" : undefined}
                        className="t-heading-s"
                      >
                        {n.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="site-menu-contacts">
                <a
                  href={hello}
                  data-fx="press"
                  className={buttonClass("primary", "w-full")}
                >
                  <WhatsAppIcon />
                  Написать в WhatsApp
                </a>
                <a
                  href={telegramLink()}
                  data-fx="press"
                  className={buttonClass("secondary", "w-full")}
                >
                  <TelegramIcon />
                  Telegram {contacts.telegram.display}
                </a>
                <p className="t-body-s text-slate">{contacts.sla}</p>
              </div>
            </div>
          </dialog>,
          document.body,
        )}
    </>
  );
}
