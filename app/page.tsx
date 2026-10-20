import Link from "next/link";
import { CinematicHero } from "@/components/motion/CinematicHero";
import { NightStage } from "@/components/motion/NightStage";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { DemoSlot } from "@/components/demos/DemoSlot";
import { ServiceGrid } from "@/components/site/ServiceGrid";
import { Marquee } from "@/components/site/Marquee";
import { CtaBand } from "@/components/site/CtaBand";
import { ServiceVisual } from "@/components/visuals/ServiceVisual";

const otherDemos = [
  { href: "/services/bots/", label: "Бот автосервиса" },
  { href: "/services/websites/", label: "Рентген сайта" },
  { href: "/services/automation/", label: "Автоматизация заявки" },
  { href: "/training/", label: "Конструктор тренинга" },
];

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
          <NightStage className="grid-page gap-y-6 p-5 md:p-7 lg:p-8">
            <h2 className="col-span-4 t-display-xl md:col-span-8 lg:col-span-12">Попробуйте сами</h2>
            <div className="col-span-4 flex flex-col gap-5 md:col-span-8 lg:col-span-4 lg:self-start">
              <p className="t-body-l text-slate-inverse">Mini App кофейни — соберите заказ.</p>
              <ul className="flex flex-wrap gap-2">
                {otherDemos.map((d) => (
                  <li key={d.href}>
                    <Link href={d.href} data-fx="select" className="inline-block rounded-pill bg-night-raised px-4 py-3 t-label hover:bg-primary">
                      {d.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-4 rounded-md bg-mist p-4 text-ink md:col-span-8 md:p-6 lg:col-span-8">
              <DemoSlot id="mini-apps" poster={<ServiceVisual id="mini-apps" className="aspect-[4/3] w-full" />} />
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
