import type { Metadata } from "next";
import Link from "next/link";
import { LogoInline } from "@/components/brand/Logo";
import { buttonClass } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { ServiceIndex } from "@/components/style/ServiceIndex";
import { MagneticLink } from "@/components/motion/MagneticLink";
import { NightStage } from "@/components/motion/NightStage";
import { ParticleMonogram } from "@/components/motion/ParticleMonogram";
import { ProcessScene } from "@/components/motion/ProcessScene";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { contacts, whatsappLink } from "@/content/contacts";
import { processSteps } from "@/content/process";

export const metadata: Metadata = {
  title: "Лаборатория движения",
  robots: { index: false },
};

const hello = whatsappLink("Здравствуйте, Ильяс! Хочу обсудить задачу.");

export default function LabPage() {
  return (
    <>
      <SmoothScroll />
      <header className="container-page flex min-h-8 items-center justify-between">
        <LogoInline className="inline-flex items-center gap-3" />
        <nav aria-label="Прототипы" className="flex items-center gap-5 t-label">
          <span className="text-slate max-md:hidden">Прототип выразительного слоя</span>
          <Link href="/style/" className="link">
            Дизайн-система
          </Link>
        </nav>
      </header>

      <main className="container-page flex flex-col gap-9 pb-10 lg:gap-10">
        {/* S1 + S3 */}
        <section className="relative grid min-h-[calc(100svh-var(--spacing-8))] content-center gap-7 py-6">
          <div className="relative z-10 flex flex-col gap-6 lg:w-5/12">
            <h1 className="t-display-xl">Сделаю и&nbsp;научу</h1>
            <p className="measure t-body-l">
              Сайты, Telegram-боты и Mini Apps, AI-автоматизация процессов — и обучение команды, чтобы всё это работало.
            </p>
            <p className="t-body-s text-slate">{contacts.sla}</p>
            <div className="flex flex-wrap items-center gap-4">
              <MagneticLink href={hello} icon={<WhatsAppIcon />}>
                Написать в WhatsApp
              </MagneticLink>
              <Link href="/brief/" className={buttonClass("secondary")}>
                Оценить задачу
              </Link>
            </div>
          </div>
          <ParticleMonogram className="w-4/5 max-lg:order-first lg:absolute lg:top-1/2 lg:right-0 lg:w-[56%] lg:-translate-y-1/2" />
        </section>

        {/* S6 (diagonal stroke on hover) */}
        <section className="flex flex-col gap-5">
          <h2 className="t-display-l">Что я делаю</h2>
          <ServiceIndex
            rows={[
              { service: "websites", title: "Сайты и лендинги", line: "Быстрые сайты с заявками в WhatsApp", packageId: "landing" },
              { service: "mini-apps", title: "Telegram Mini Apps", line: "Каталог, запись или обучение внутри Telegram", packageId: "mini-app" },
              { service: "bots", title: "Telegram-боты", line: "Заявки и ответы на частые вопросы", packageId: "bot" },
              { service: "automation", title: "AI-автоматизация", line: "Меньше ручной работы с заявками и таблицами", packageId: "automation" },
              { service: "training", title: "Тренинги", line: "Корпоративно и лично", packageId: "training-personal" },
            ]}
          />
        </section>

        {/* S4 */}
        <ProcessScene title="Как я работаю" steps={processSteps} />

        {/* S5 */}
        <NightStage className="grid-page gap-y-7 p-5 md:p-7 lg:p-8">
          <div className="col-span-4 flex flex-col gap-5 md:col-span-8 lg:col-span-5 lg:self-center">
            <h2 className="t-display-l">Сначала попробуйте, потом заказывайте</h2>
            <p className="measure t-body-l text-slate-inverse">
              На каждой странице услуги — живое демо: бот, мини-апп, автоматизация. Нажимайте кнопки, как будто вы ваш клиент.
            </p>
          </div>
          <div className="col-span-4 md:col-span-8 lg:col-span-6 lg:col-start-7">
            <PhoneFrame label="Пример экрана чат-бота">
              <div className="flex h-full flex-col gap-3 bg-mist px-4 pt-7 pb-4 t-body-s text-ink">
                <p className="self-start rounded-sm bg-paper px-4 py-3">Здравствуйте! Я бот автосервиса. Что вас интересует?</p>
                <p className="self-end rounded-sm bg-primary px-4 py-3 text-on-primary">Записаться</p>
                <p className="self-start rounded-sm bg-paper px-4 py-3">Выберите услугу:</p>
                <div className="mt-auto grid grid-cols-2 gap-2">
                  {["Замена масла", "Диагностика", "Шиномонтаж", "Другое"].map((b) => (
                    <span key={b} className="rounded-sm bg-paper px-3 py-3 text-center t-label">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </PhoneFrame>
            <p className="mt-4 text-center t-body-s text-slate-inverse">Демо-сценарий. Данные выдуманы для примера.</p>
          </div>
        </NightStage>

        {/* S5 + S3: final CTA */}
        <NightStage className="flex flex-col items-start gap-6 p-5 md:p-7 lg:p-9">
          <h2 className="max-w-[18ch] t-display-xl">Расскажите задачу — отвечу в течение 2 часов</h2>
          <p className="t-body-l text-slate-inverse">В будни с 10 до 19 по Алматы. WhatsApp {contacts.whatsapp.display}.</p>
          <MagneticLink href={hello} icon={<WhatsAppIcon />}>
            Написать в WhatsApp
          </MagneticLink>
        </NightStage>
      </main>
    </>
  );
}
