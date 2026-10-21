import type { Metadata } from "next";
import Link from "next/link";
import { ParticleMonogram } from "@/components/motion/ParticleMonogram";
import { TelegramIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { CopyButton } from "@/components/ui/CopyButton";
import { contacts, telegramLink, whatsappLink } from "@/content/contacts";

export const metadata: Metadata = {
  title: "Контакты",
  description: "WhatsApp и Telegram. Алматы, работаю по всему Казахстану онлайн.",
};

export default function ContactPage() {
  return (
    <main data-no-float className="container-page grid-page min-h-[calc(100svh-var(--spacing-8))] content-center gap-y-7 py-7">
      <div className="col-span-4 flex flex-col gap-6 md:col-span-8 lg:col-span-6">
        <h1 className="t-display-xl">Напишите мне</h1>
        <p className="t-body-l text-slate">Алматы, работаю по всему Казахстану онлайн.</p>
        <div className="flex flex-col gap-3">
          <a
            href={whatsappLink("Здравствуйте, Ильяс!")}
            target="_blank"
            rel="noopener"
            data-fx="press"
            className="group flex items-center justify-between gap-5 rounded-md bg-primary p-5 text-on-primary transition-transform duration-[var(--dur-quick)] hover:-translate-y-1 active:scale-98"
          >
            <span className="flex flex-col gap-1">
              <span className="t-label">WhatsApp</span>
              <span className="t-heading-m">{contacts.whatsapp.display}</span>
            </span>
            <WhatsAppIcon className="size-7 transition-transform duration-[var(--dur-base)] group-hover:scale-110" />
          </a>
          <a
            href={telegramLink()}
            target="_blank"
            rel="noopener"
            data-fx="press"
            className="group flex items-center justify-between gap-5 rounded-md bg-night p-5 text-ink-inverse transition-transform duration-[var(--dur-quick)] hover:-translate-y-1 active:scale-98"
          >
            <span className="flex flex-col gap-1">
              <span className="t-label">Telegram</span>
              <span className="t-heading-m">{contacts.telegram.display}</span>
            </span>
            <TelegramIcon className="size-7 transition-transform duration-[var(--dur-base)] group-hover:scale-110" />
          </a>
          <div className="flex flex-wrap gap-x-5">
            <CopyButton value={`+${contacts.whatsapp.number}`} label="Скопировать номер" className="text-primary-deep" />
            <CopyButton value={contacts.telegram.display} label="Скопировать ник" className="text-primary-deep" />
          </div>
        </div>
        <Link href="/brief/" className="link self-start t-label">
          Не знаете, с чего начать? Оцените задачу за 4 вопроса
        </Link>
      </div>
      <div className="col-span-4 md:col-span-8 lg:col-span-6">
        <ParticleMonogram className="w-full" />
      </div>
    </main>
  );
}
