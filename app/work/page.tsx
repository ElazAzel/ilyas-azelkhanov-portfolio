import type { Metadata } from "next";
import Link from "next/link";
import { ServiceVisual } from "@/components/visuals/ServiceVisual";
import { ParticleMonogram } from "@/components/motion/ParticleMonogram";
import { CtaBand } from "@/components/site/CtaBand";
import { TelegramIcon } from "@/components/ui/Icons";
import { OpenIcon } from "@/components/ui/Icons2";
import { ownBot } from "@/content/demos/miniapp";
import type { ServiceId } from "@/content/pricing";
import { BASE_PATH } from "@/lib/base-path";

export const metadata: Metadata = {
  title: "Работы",
  description: "Собственные продукты и живые демо, которые можно потрогать прямо на сайте.",
};

const demos: { id: ServiceId; href: string; title: string; text: string }[] = [
  { id: "bots", href: "/services/bots/", title: "Бот автосервиса", text: "Запись клиента в три нажатия, заявка сразу у менеджера." },
  { id: "mini-apps", href: "/services/mini-apps/", title: "Mini App кофейни", text: "Меню, корзина и заказ внутри Telegram, экран бариста." },
  { id: "automation", href: "/services/automation/", title: "Заявка без ручной работы", text: "Одна заявка вручную и с ИИ - сравните время." },
  { id: "websites", href: "/services/websites/", title: "Сайт интерьерной студии", text: "Каталог, фильтр проектов и конструктор брифа. Рентген сайта - во второй вкладке." },
  { id: "training", href: "/training/", title: "Конструктор тренинга", text: "Программа и цена для вашей команды за минуту." },
];

export default function WorkPage() {
  return (
    <main className="container-page flex flex-col gap-9 pt-6 pb-8 lg:gap-10">
      <header className="flex flex-col gap-4">
        <h1 className="t-display-xl">Работы</h1>
        <p className="measure t-body-l text-slate">
          Всё ниже можно открыть и нажать.
        </p>
      </header>

      <section className="flex flex-col gap-5">
        <h2 className="t-display-l">Собственные продукты</h2>
        <div className="grid gap-4 lg:grid-cols-12">
          <a
            href={ownBot.url}
            target="_blank"
            rel="noopener"
            data-fx="press"
            className="group flex flex-col justify-between gap-6 rounded-md bg-night p-5 text-ink-inverse lg:col-span-5 lg:p-7"
          >
            <span className="grid size-9 place-items-center rounded-pill bg-primary text-on-primary">
              <TelegramIcon className="size-7" />
            </span>
            <span className="flex flex-col gap-2">
              <span className="t-label text-slate-inverse">Собственный продукт</span>
              <span className="t-display-l">{ownBot.handle}</span>
              <span className="t-body-m text-slate-inverse">{ownBot.what.charAt(0).toUpperCase() + ownBot.what.slice(1)} в Telegram.</span>
            </span>
            <span className="flex items-center gap-3 t-label">
              Открыть в Telegram
              <span className="grid size-7 place-items-center rounded-pill bg-primary text-on-primary transition-transform group-hover:rotate-45">
                <OpenIcon />
              </span>
            </span>
          </a>
          <div className="flex flex-col gap-5 rounded-md bg-mist p-5 lg:col-span-7 lg:p-7">
            <span className="t-label text-slate">Собственный продукт</span>
            <h3 className="t-display-l">Этот сайт</h3>
            <ParticleMonogram className="w-2/3 self-center" />
            <ul className="grid gap-2 t-body-m md:grid-cols-2">
              <li>3D-знак, который вращается при прокрутке</li>
              <li>Пять живых демо вместо скриншотов</li>
              <li>Звук и вибрация в ответ на нажатия</li>
              <li>Версия для ИИ-поиска -{" "}
                <a href={`${BASE_PATH}/llms.txt`} className="link">llms.txt</a>
              </li>
            </ul>
            <Link href="/services/websites/" data-fx="press" className="link self-start t-label">
              Посмотреть, как он устроен
            </Link>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <h2 className="t-display-l">Живые демо</h2>
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {demos.map((d) => (
            <li key={d.id}>
              <Link href={d.href} data-fx="hover" className="group flex h-full flex-col gap-4 rounded-md bg-mist p-5 hover:bg-line">
                <ServiceVisual id={d.id} className="aspect-[4/3] w-full" />
                <span className="t-heading-s">{d.title}</span>
                <span className="t-body-s text-slate">{d.text}</span>
                <span className="mt-auto flex items-center justify-between pt-2 t-label">
                  Попробовать
                  <span className="grid size-7 place-items-center rounded-pill bg-primary text-on-primary transition-transform group-hover:rotate-45">
                    <OpenIcon />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <CtaBand />
    </main>
  );
}
