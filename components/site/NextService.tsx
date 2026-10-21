import Link from "next/link";
import { formatPrice, packagesFor, type ServiceId } from "@/content/pricing";
import { services } from "@/content/services";
import { ServiceVisual } from "@/components/visuals/ServiceVisual";
import { OpenIcon } from "@/components/ui/Icons2";

/** Bottom of a service page: one big link to the next service, so the demos read as a tour. */
export function NextService({ id }: { id: ServiceId }) {
  const i = services.findIndex((s) => s.id === id);
  const next = services[(i + 1) % services.length]!;
  return (
    <Link
      href={next.href}
      data-fx="hover"
      data-xray="NextService"
      className="next-service group grid-page items-center gap-y-5 rounded-md bg-mist p-5 lg:p-7"
    >
      <div className="col-span-4 flex flex-col gap-4 md:col-span-5 lg:col-span-7">
        <span className="t-label text-slate">Следующее демо · {((i + 1) % services.length) + 1} из {services.length}</span>
        <span className="next-service-title t-display-l">{next.title}</span>
        <span className="t-body-m text-slate">{next.line}</span>
        <span className="flex items-center gap-4 pt-2">
          <span className="rounded-pill bg-paper px-4 py-2 t-label">{formatPrice(packagesFor(next.id)[0]!)}</span>
          <span className="grid size-7 place-items-center rounded-pill bg-primary text-on-primary transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)] group-hover:rotate-45">
            <OpenIcon />
          </span>
        </span>
      </div>
      <div className="col-span-4 md:col-span-3 lg:col-span-5">
        <ServiceVisual id={next.id} className="next-service-visual aspect-[4/3] w-full" />
      </div>
    </Link>
  );
}
