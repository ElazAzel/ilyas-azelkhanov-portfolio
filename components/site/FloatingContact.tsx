import { WhatsAppIcon } from "@/components/ui/Icons";
import { whatsappLink } from "@/content/contacts";

/** Mobile browser: a contact button always under the thumb (SPEC.md §7 navigation). */
export function FloatingContact() {
  return (
    <a
      href={whatsappLink("Здравствуйте, Ильяс! Хочу обсудить задачу.")}
      data-fx="press"
      aria-label="Написать в WhatsApp"
      className="fixed right-4 bottom-[calc(var(--spacing-4)+env(safe-area-inset-bottom))] z-20 inline-flex min-h-7 items-center gap-2 rounded-pill bg-primary px-5 py-3 t-label text-on-primary shadow-[var(--shadow-phone)] active:scale-98 lg:hidden"
    >
      <WhatsAppIcon />
      Написать
    </a>
  );
}
