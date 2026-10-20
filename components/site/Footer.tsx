import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { services } from "@/content/services";
import { contacts, telegramLink, whatsappLink } from "@/content/contacts";

export function Footer() {
  return (
    <footer className="mt-9 bg-night pb-[calc(var(--spacing-10)+env(safe-area-inset-bottom))] text-ink-inverse lg:pb-8">
      <div className="container-page grid-page gap-y-7 pt-8">
        <div className="col-span-4 flex flex-col gap-4 md:col-span-8 lg:col-span-4">
          <Logo className="w-9 text-ink-inverse" />
          <p className="t-body-s text-slate-inverse">Сайты, боты, Mini Apps, AI-автоматизация и тренинги. Алматы.</p>
        </div>
        <ul className="col-span-2 flex flex-col gap-3 md:col-span-4 lg:col-span-4">
          {services.map((s) => (
            <li key={s.id}>
              <Link href={s.href} className="t-label hover:text-primary-light">
                {s.title}
              </Link>
            </li>
          ))}
        </ul>
        <div className="col-span-2 flex flex-col gap-3 md:col-span-4 lg:col-span-4">
          <a href={whatsappLink("Здравствуйте, Ильяс!")} className="t-label hover:text-primary-light">
            WhatsApp {contacts.whatsapp.display}
          </a>
          <a href={telegramLink()} className="t-label hover:text-primary-light">
            Telegram {contacts.telegram.display}
          </a>
          <Link href="/brief/" className="t-label hover:text-primary-light">
            Оценить задачу
          </Link>
          <p className="t-body-s text-slate-inverse">{contacts.sla}</p>
        </div>
      </div>
    </footer>
  );
}
