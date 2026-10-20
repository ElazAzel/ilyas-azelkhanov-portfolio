import type { Metadata } from "next";
import Link from "next/link";
import { ParticleMonogram } from "@/components/motion/ParticleMonogram";
import { TelegramIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { contacts, telegramLink, whatsappLink } from "@/content/contacts";

export const metadata: Metadata = {
  title: "Контакты",
  description: "WhatsApp и Telegram. Отвечаю в течение 2 часов в будни с 10 до 19 по Алматы.",
};

export default function ContactPage() {
  return (
    <main className="container-page grid-page min-h-[calc(100svh-var(--spacing-8))] content-center gap-y-7 py-7">
      <div className="col-span-4 flex flex-col gap-6 md:col-span-8 lg:col-span-6">
        <h1 className="t-display-xl">Напишите мне</h1>
        <p className="t-body-l text-slate">{contacts.sla}. Алматы, работаю по всему Казахстану онлайн.</p>
        <div className="flex flex-col gap-3">
          <a href={whatsappLink("Здравствуйте, Ильяс!")} data-fx="press" className="flex items-center justify-between gap-5 rounded-md bg-primary p-5 text-on-primary active:scale-98">
            <span className="flex flex-col gap-1">
              <span className="t-label">WhatsApp</span>
              <span className="t-heading-m">{contacts.whatsapp.display}</span>
            </span>
            <WhatsAppIcon className="size-7" />
          </a>
          <a href={telegramLink()} data-fx="press" className="flex items-center justify-between gap-5 rounded-md bg-night p-5 text-ink-inverse active:scale-98">
            <span className="flex flex-col gap-1">
              <span className="t-label">Telegram</span>
              <span className="t-heading-m">{contacts.telegram.display}</span>
            </span>
            <TelegramIcon className="size-7" />
          </a>
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
