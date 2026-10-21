import Link from "next/link";
import { Monogram } from "@/components/brand/Logo";
import { TelegramIcon } from "@/components/ui/Icons";
import { buttonClass } from "@/components/ui/Button";
import { homeAbout } from "@/content/home";
import { ownBot } from "@/content/demos/miniapp";
import { Facts } from "./Facts";

/** Home: who is behind the site + trust numbers derived from confirmed data (SPEC.md §7, п. 5–7). */
export function AboutStrip() {
  return (
    <section data-xray="AboutStrip" className="grid-page items-stretch gap-y-5">
      <div className="col-span-4 flex flex-col justify-between gap-7 rounded-md bg-mist p-5 md:col-span-8 lg:col-span-5 lg:p-7">
        <div className="flex flex-col gap-5">
          <Monogram className="w-9" />
          <h2 className="t-display-l">{homeAbout.name}</h2>
          <p className="t-body-l">{homeAbout.lead}</p>
          <p className="t-body-s text-slate">{homeAbout.handle}</p>
        </div>
        <div className="flex flex-col gap-4">
          <a href={ownBot.url} target="_blank" rel="noopener" data-fx="press" className="group flex items-center gap-4 rounded-sm bg-paper p-4 transition-transform duration-[var(--dur-quick)] hover:-translate-y-1">
            <span className="grid size-7 shrink-0 place-items-center rounded-pill bg-primary text-on-primary transition-transform duration-[var(--dur-base)] group-hover:rotate-12">
              <TelegramIcon />
            </span>
            <span className="flex flex-col">
              <span className="t-label">{homeAbout.product}</span>
              <span className="t-body-s text-slate">{homeAbout.productNote}</span>
            </span>
          </a>
          <Link href="/about/" data-fx="press" className={buttonClass("secondary", "self-start")}>
            {homeAbout.more}
          </Link>
        </div>
      </div>
      <div className="col-span-4 md:col-span-8 lg:col-span-7">
        <Facts />
      </div>
    </section>
  );
}
