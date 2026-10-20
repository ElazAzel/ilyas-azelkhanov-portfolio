import { venues } from "@/content/services";

/** Venues where Ilyas spoke or taught — text only, no logos (SPEC.md §9). Endless strip; static with reduced motion. */
export function Marquee() {
  const row = venues.map((v) => (
    <li key={v} className="flex shrink-0 items-center gap-5 pr-5 t-heading-m whitespace-nowrap">
      {v}
      <span aria-hidden="true" className="size-3 rounded-pill bg-primary" />
    </li>
  ));
  return (
    <section aria-label="Где я выступал и преподавал" className="flex flex-col gap-5 overflow-hidden">
      <p className="container-page t-label text-slate">Выступал и преподавал</p>
      <div className="marquee flex">
        <ul className="marquee-track flex">{row}</ul>
        <ul className="marquee-track flex" aria-hidden="true">
          {row}
        </ul>
      </div>
    </section>
  );
}
