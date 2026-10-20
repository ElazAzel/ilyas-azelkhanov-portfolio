import Link from "next/link";
import { formatPrice, packages, type ServiceId } from "@/content/pricing";

type Row = { service: ServiceId; title: string; line: string; packageId: string };

// Signature: on hover a primary bar at the AZ angle (39.5°) draws in next to the price.
export function ServiceIndex({ rows }: { rows: Row[] }) {
  return (
    <ul className="flex flex-col">
      {rows.map((r) => {
        const pkg = packages.find((p) => p.id === r.packageId)!;
        return (
          <li key={r.service}>
            <Link
              href={`/services/${r.service}/`}
              data-fx="hover"
              className="group grid-page items-baseline gap-y-1 py-5 lg:py-6"
            >
              <span className="col-span-4 md:col-span-5 t-heading-m transition-colors duration-[var(--dur-quick)] group-hover:text-primary-deep">
                {r.title}
              </span>
              <span className="col-span-4 row-start-2 t-body-s text-slate md:col-span-5 lg:col-span-4 lg:col-start-6 lg:row-start-1">
                {r.line}
              </span>
              <span className="col-span-4 flex items-center gap-4 t-label whitespace-nowrap md:col-span-3 md:col-start-6 md:row-start-1 md:justify-end lg:col-span-3 lg:col-start-10">
                <span
                  aria-hidden="true"
                  className="hidden h-2 w-7 origin-left scale-x-0 rotate-[calc(-1*var(--az-angle))] rounded-pill bg-primary transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)] group-hover:scale-x-100 lg:block"
                />
                {formatPrice(pkg)}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
