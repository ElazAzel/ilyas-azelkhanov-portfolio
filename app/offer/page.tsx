import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";
import { company, freeRescheduleHours, nonRefundable, prepayment, refundDays } from "@/content/legal";
import { contacts } from "@/content/contacts";
import { formatPrice, packages } from "@/content/pricing";

export const metadata: Metadata = { title: "Публичная оферта", description: `Оферта ${company.name} на личные тренинги по ИИ.` };

const personal = packages.find((p) => p.id === "training-personal")!;

export default function OfferPage() {
  return (
    <LegalPage title="Публичная оферта" updated="20.10.2026">
      <section className="flex flex-col gap-3">
        <h2 className="t-heading-m">1. Общие положения</h2>
        <p className="t-body-m">
          {company.name} (далее - Исполнитель) предлагает любому физическому лицу (далее - Заказчик) заключить договор на оказание услуг личного
          обучения работе с инструментами искусственного интеллекта на условиях этой оферты. Оплата услуг означает полное принятие условий оферты.
        </p>
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="t-heading-m">2. Предмет</h2>
        <p className="t-body-m">
          Исполнитель проводит индивидуальные занятия по работе с ИИ онлайн или офлайн в г. Алматы. Темы, длительность и время занятий
          согласуются с Заказчиком в переписке до оплаты. Язык занятий - русский и казахский.
        </p>
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="t-heading-m">3. Стоимость и оплата</h2>
        <p className="t-body-m">
          Стоимость - {formatPrice(personal)}. Итоговая сумма фиксируется в переписке до оплаты. Предоплата - {prepayment}, оплата на банковский
          счёт Исполнителя по реквизитам ниже.
        </p>
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="t-heading-m">4. Перенос, отмена и возврат</h2>
        <ul className="flex list-disc flex-col gap-2 pl-5 t-body-m">
          <li>
            Перенос занятия бесплатный, если Заказчик предупредил не позднее чем за {freeRescheduleHours} часа до начала. Один бесплатный
            перенос на каждое оплаченное занятие.
          </li>
          <li>
            Если Заказчик отменяет занятие раньше чем за {freeRescheduleHours} часа, предоплата возвращается за вычетом {nonRefundable} её суммы.
            Эта часть невозвратная: она покрывает зарезервированное время и подготовку программы под Заказчика.
          </li>
          <li>Если Заказчик отменяет занятие позднее чем за {freeRescheduleHours} часа или не приходит, предоплата не возвращается.</li>
          <li>Если занятие отменяет или переносит Исполнитель, Заказчик выбирает: перенос на удобное время или полный возврат предоплаты.</li>
          <li>Возврат - в течение {refundDays} рабочих дней на счёт или карту, с которых пришла оплата.</li>
        </ul>
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="t-heading-m">5. Ответственность</h2>
        <p className="t-body-m">Стороны несут ответственность в соответствии с законодательством Республики Казахстан.</p>
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="t-heading-m">6. Связь</h2>
        <p className="t-body-m">
          WhatsApp {contacts.whatsapp.display}, Telegram {contacts.telegram.display}. {contacts.sla}.
        </p>
      </section>
    </LegalPage>
  );
}
