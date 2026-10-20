"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LogoInline } from "@/components/brand/Logo";
import { SoundToggle } from "@/components/motion/SoundToggle";
import { buttonClass } from "@/components/ui/Button";
import { WhatsAppIcon, TelegramIcon } from "@/components/ui/Icons";
import { CloseIcon, MenuIcon } from "@/components/ui/Icons2";
import { nav } from "@/content/nav";
import { services } from "@/content/services";
import { contacts, telegramLink, whatsappLink } from "@/content/contacts";

const hello = whatsappLink("Здравствуйте, Ильяс! Хочу обсудить задачу.");

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header data-xray="Header" className="sticky top-0 z-30 bg-paper">
      <div className="container-page flex min-h-8 items-center justify-between gap-5">
        <Link href="/" aria-label="Azelkhanov — на главную" data-fx="select">
          <LogoInline className="inline-flex items-center gap-3" />
        </Link>
        <nav aria-label="Основное" className="flex items-center gap-5 max-lg:hidden">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} data-fx="select" className="t-label hover:text-primary-deep">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <SoundToggle />
          <a href={hello} data-fx="press" className={buttonClass("primary", "max-lg:hidden")}>
            <WhatsAppIcon />
            WhatsApp
          </a>
          <button
            type="button"
            data-fx="select"
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            onClick={() => setOpen((v) => !v)}
            className="grid size-7 place-items-center rounded-xs bg-ink text-paper lg:hidden"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {open ? (
        <div id="site-menu" className="fixed inset-x-0 top-8 bottom-0 z-30 flex flex-col gap-7 overflow-y-auto bg-paper px-4 pt-6 pb-[calc(var(--spacing-7)+env(safe-area-inset-bottom))] lg:hidden">
          <ul className="flex flex-col gap-1">
            {services.map((s) => (
              <li key={s.id}>
                <Link href={s.href} data-fx="press" className="flex items-center justify-between rounded-sm bg-mist px-4 py-4 t-heading-s">
                  {s.title}
                  <span className="size-3 rounded-pill bg-primary" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
          <ul className="flex flex-col gap-4">
            {nav.slice(2).map((n) => (
              <li key={n.href}>
                <Link href={n.href} data-fx="press" className="t-heading-m underline decoration-line underline-offset-4">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-col gap-3">
            <a href={hello} data-fx="press" className={buttonClass("primary", "w-full")}>
              <WhatsAppIcon /> Написать в WhatsApp
            </a>
            <a href={telegramLink()} data-fx="press" className={buttonClass("secondary", "w-full")}>
              <TelegramIcon /> Telegram {contacts.telegram.display}
            </a>
            <p className="t-body-s text-slate">{contacts.sla}</p>
          </div>
        </div>
      ) : null}
    </header>
  );
}
