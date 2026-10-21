import Link from "next/link";
import { ViewTransition } from "react";
import { formatPrice, packagesFor } from "@/content/pricing";
import { services } from "@/content/services";
import { ServiceVisual } from "@/components/visuals/ServiceVisual";
import { OpenIcon } from "@/components/ui/Icons2";
import { Spotlight } from "@/components/motion/Spotlight";

// Bento of the five services: different sizes, each with its own live scene,
// and a clear round button - the whole card is the link.
const LAYOUT: Record<string, string> = {
  websites: "lg:col-span-7",
  "mini-apps": "lg:col-span-5",
  bots: "lg:col-span-5",
  automation: "lg:col-span-7",
  training: "lg:col-span-12",
};

export function ServiceGrid() {
  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12 lg:gap-5">
      {services.map((s) => {
        const from = packagesFor(s.id)[0]!;
        const wide = s.id === "training";
        return (
          <li key={s.id} className={`${LAYOUT[s.id]} ${wide ? "md:col-span-2" : ""}`}>
            <Spotlight className={`service-spotlight service-spotlight--${s.id}`}>
            <Link
              href={s.href}
              data-fx="hover"
              className={`service-card group flex h-full flex-col gap-5 rounded-md p-5 transition-colors duration-[var(--dur-quick)] lg:p-6 ${
                wide ? "night-stage bg-night text-ink-inverse lg:flex-row lg:items-center" : "bg-mist text-ink"
              }`}
            >
              <ServiceVisual
                id={s.id}
                className={`aspect-[4/3] w-full transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)] group-hover:scale-[1.02] ${
                  wide ? "lg:order-2 lg:aspect-[16/7] lg:w-1/2" : ""
                }`}
              />
              <div className={`flex flex-1 flex-col gap-3 ${wide ? "lg:order-1" : ""}`}>
                <ViewTransition name={`svc-title-${s.id}`} share="morph" default="none">
                  <h3 className="t-heading-m">{s.title}</h3>
                </ViewTransition>
                <p className={`t-body-m ${wide ? "text-slate-inverse" : "text-slate"}`}>{s.line}</p>
                <div className="mt-auto flex items-center justify-between gap-4 pt-3">
                  <span className={`rounded-pill px-4 py-2 t-label ${wide ? "bg-night-raised" : "bg-paper"}`}>
                    {formatPrice(from)}
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="t-label max-md:hidden">Подробнее</span>
                    <span className="grid size-7 place-items-center rounded-pill bg-primary text-on-primary transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)] group-hover:rotate-45">
                      <OpenIcon />
                    </span>
                  </span>
                </div>
              </div>
            </Link>
            </Spotlight>
          </li>
        );
      })}
    </ul>
  );
}
