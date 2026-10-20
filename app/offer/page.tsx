import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";
import { company, prepayment } from "@/content/legal";
import { contacts } from "@/content/contacts";
import { formatPrice, packages } from "@/content/pricing";

export const metadata: Metadata = { title: "Публичная оферта", description: `Оферта ${company.name} на личные тренинги по ИИ.` };

const personal = packages.find((p) => p.id === "training-personal")!;

// TODO(ilyas): перенос, отмена и возврат предоплаты — без этих условий раздел не публикуется.
export default function OfferPage() {
  return (
    <LegalPage title="Публичная оферта" updated="20.10.2026">
      <section className="flex flex-col gap-3">
        <h2 className="t-heading-m">1. Общие положения</h2>
        <p className="t-body-m">
          {company.name} (далее — Исполнитель) предлагает любому физическому лицу (далее — Заказчик) заключить договор на оказание услуг личного
          обучения работе с инструментами искусственного интеллекта на условиях этой оферты. Оплата услуг означает полное принятие условий оферты.
        </p>
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="t-heading-m">2. Предмет</h2>
        <p className="t-body-m">
          Исполнитель проводит индивидуальные занятия по работе с ИИ онлайн или офлайн в г. Алматы. Темы, длительность и время занятий
          согласуются с Заказчиком в переписке до оплаты. Язык занятий — русский и казахский.
        </p>
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="t-heading-m">3. Стоимость и оплата</h2>
        <p className="t-body-m">
          Стоимость — {formatPrice(personal)}. Итоговая сумма фиксируется в переписке до оплаты. Предоплата — {prepayment}, оплата на банковский
          счёт Исполнителя по реквизитам ниже.
        </p>
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="t-heading-m">4. Ответственность</h2>
        <p className="t-body-m">Стороны несут ответственность в соответствии с законодательством Республики Казахстан.</p>
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="t-heading-m">5. Связь</h2>
        <p className="t-body-m">
          WhatsApp {contacts.whatsapp.display}, Telegram {contacts.telegram.display}. {contacts.sla}.
        </p>
      </section>
    </LegalPage>
  );
}
