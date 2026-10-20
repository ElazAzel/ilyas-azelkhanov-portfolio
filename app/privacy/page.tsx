import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";
import { company } from "@/content/legal";
import { contacts } from "@/content/contacts";

export const metadata: Metadata = { title: "Политика конфиденциальности", description: "Какие данные собирает сайт и как с ними обращаются." };

export default function PrivacyPage() {
  return (
    <LegalPage title="Политика конфиденциальности" updated="20.10.2026">
      <section className="flex flex-col gap-3">
        <h2 className="t-heading-m">Кто отвечает за данные</h2>
        <p className="t-body-m">{company.name}. Связь: WhatsApp {contacts.whatsapp.display}, Telegram {contacts.telegram.display}.</p>
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="t-heading-m">Что собирает сайт</h2>
        <p className="t-body-m">
          Ничего. На сайте нет форм, которые отправляют данные на сервер. Бриф «Оценить задачу» считается прямо в вашем браузере: текст
          уходит только туда, куда вы отправите его сами — в WhatsApp или Telegram. Демо на страницах услуг работают на выдуманных данных.
        </p>
        <p className="t-body-m">
          В браузере сохраняется одна настройка — включён ли звук интерфейса. Её можно удалить, очистив данные сайта в браузере.
        </p>
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="t-heading-m">Когда вы пишете мне</h2>
        <p className="t-body-m">
          Если вы пишете в WhatsApp или Telegram, я вижу ваше имя в мессенджере, номер или имя пользователя и текст сообщения. Использую их только,
          чтобы ответить на ваш запрос и выполнить работу. Переписка хранится в самом мессенджере.
        </p>
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="t-heading-m">Ваши права</h2>
        <p className="t-body-m">Вы можете попросить показать, исправить или удалить ваши данные — напишите в любой из мессенджеров выше.</p>
      </section>
    </LegalPage>
  );
}
