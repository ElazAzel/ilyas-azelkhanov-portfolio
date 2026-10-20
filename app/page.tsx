import Link from "next/link";
import { buttonClass } from "@/components/ui/Button";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { NightStage } from "@/components/motion/NightStage";
import { CinematicHero } from "@/components/motion/CinematicHero";
import { ProcessScene } from "@/components/motion/ProcessScene";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { ServiceGrid } from "@/components/site/ServiceGrid";
import { Marquee } from "@/components/site/Marquee";
import { CtaBand } from "@/components/site/CtaBand";
import { processSteps } from "@/content/process";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <main className="flex flex-col gap-9 pb-8 lg:gap-10">
        <CinematicHero />

        <Marquee />

        <section id="services" className="container-page flex scroll-mt-8 flex-col gap-6">
          <h2 className="t-display-xl">Что я делаю</h2>
          <ServiceGrid />
        </section>

        <div className="container-page">
          <ProcessScene title="Как я работаю" steps={processSteps} />
        </div>

        <div className="container-page">
          <NightStage className="grid-page gap-y-7 p-5 md:p-7 lg:p-8">
            <div className="col-span-4 flex flex-col gap-5 md:col-span-8 lg:col-span-5 lg:self-center">
              <h2 className="t-display-l">Сначала попробуйте, потом заказывайте</h2>
              <p className="measure t-body-l text-slate-inverse">
                На каждой странице услуги — живая схема, а скоро и демо, которое можно нажимать: бот, мини-апп, автоматизация.
              </p>
              <Link href="/services/bots/" data-fx="press" className={buttonClass("primary", "self-start")}>
                Посмотреть ботов
              </Link>
            </div>
            <div className="px-tilt col-span-4 md:col-span-8 lg:col-span-6 lg:col-start-7">
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
        </div>

        <div className="container-page">
          <CtaBand />
        </div>
      </main>
    </>
  );
}
