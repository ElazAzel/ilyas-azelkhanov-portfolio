import { venues } from "@/content/services";
import { BASE_PATH } from "@/lib/base-path";

/** Companies and venues Ilyas worked with: logo if there is a file in public/logos, else the name. Endless strip; static with reduced motion. */
export function Marquee() {
  const row = venues.map((v) => (
    <li key={v.name} className="flex shrink-0 items-center gap-5 pr-5 t-heading-m whitespace-nowrap">
      {v.logo ? <img src={`${BASE_PATH}/logos/${v.logo}`} alt={v.name} className="h-6 w-auto" loading="lazy" /> : v.name}
      <span aria-hidden="true" className="size-3 rounded-pill bg-primary" />
    </li>
  ));
  return (
    <section aria-label="Работал с" className="flex flex-col gap-5 overflow-hidden">
      <p className="container-page t-label text-slate">Работал с</p>
      <div className="marquee flex">
        <ul className="marquee-track flex">{row}</ul>
        <ul className="marquee-track flex" aria-hidden="true">
          {row}
        </ul>
      </div>
    </section>
  );
}
