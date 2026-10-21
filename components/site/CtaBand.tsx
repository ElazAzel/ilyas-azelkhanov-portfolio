import { TelegramIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { contacts, telegramLink, whatsappLink } from "@/content/contacts";
import { homeCopy } from "@/content/home";
import { Spotlight } from "@/components/motion/Spotlight";
import { Monogram } from "@/components/brand/Logo";

/** Final call to action on primary blue - the one blue surface allowed per page (DESIGN.md → Colors). */
export function CtaBand({ ask = "Здравствуйте, Ильяс! Хочу обсудить задачу." }: { ask?: string }) {
  return (
    <Spotlight className="cta-spotlight">
    <section data-xray="CtaBand" className="cta-band overflow-hidden rounded-md bg-primary p-5 text-on-primary md:p-7 lg:p-9">
      <div className="cta-orbits" aria-hidden="true"><i /><i /><i /><Monogram className="cta-monogram" /></div>
      <div className="cta-content flex flex-col gap-6">
        <p className="t-label">{homeCopy.ctaLead}</p>
        <h2 className="max-w-[16ch] t-display-xl whitespace-pre-line">{homeCopy.cta}</h2>
        <div className="flex flex-wrap gap-3">
          <a
            href={whatsappLink(ask)}
            data-fx="press"
            className="inline-flex min-h-7 items-center gap-2 rounded-pill bg-paper px-5 py-3 t-label text-ink transition-transform active:scale-98"
          >
            <WhatsAppIcon /> WhatsApp {contacts.whatsapp.display}
          </a>
          <a
            href={telegramLink()}
            data-fx="press"
            className="inline-flex min-h-7 items-center gap-2 rounded-pill px-5 py-3 t-label text-on-primary ring-[length:var(--stroke)] ring-paper ring-inset transition-transform active:scale-98"
          >
            <TelegramIcon /> Telegram {contacts.telegram.display}
          </a>
        </div>
      </div>
    </section>
    </Spotlight>
  );
}
