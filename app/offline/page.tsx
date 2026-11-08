import type { Metadata } from "next";
import { TelegramIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { contacts, telegramLink, whatsappLink } from "@/content/contacts";
import { buttonClass } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Нет сети", robots: { index: false } };

/** Shown by the service worker when a page is not cached and there is no connection. */
export default function OfflinePage() {
  return (
    <main id="main-content" className="container-page flex min-h-[calc(100svh-var(--spacing-8))] flex-col justify-center gap-5 py-7">
      <h1 className="t-display-xl">Нет интернета</h1>
      <p className="t-body-l text-slate">Страница откроется, когда связь вернётся. Написать можно и сейчас — сообщение уйдёт само.</p>
      <div className="flex flex-wrap gap-3">
        <a href={whatsappLink("Здравствуйте, Ильяс!")} className={buttonClass("primary")}>
          <WhatsAppIcon /> WhatsApp {contacts.whatsapp.display}
        </a>
        <a href={telegramLink()} className={buttonClass("secondary")}>
          <TelegramIcon /> Telegram {contacts.telegram.display}
        </a>
      </div>
    </main>
  );
}
