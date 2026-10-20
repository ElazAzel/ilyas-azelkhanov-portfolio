import { formatPrice, type Package } from "@/content/pricing";

type Props = { pkg: Package; includes?: string[]; action: { label: string; href: string } };

export function PackageCard({ pkg, includes = [], action }: Props) {
  return (
    <article className="flex flex-col gap-5 rounded-sm bg-mist p-6">
      <header className="flex flex-col gap-3">
        <h3 className="t-heading-s">{pkg.title}</h3>
        <p className="t-price">{formatPrice(pkg)}</p>
        {pkg.term || pkg.note ? (
          <p className="t-body-s text-slate">{[pkg.term, pkg.note].filter(Boolean).join(" · ")}</p>
        ) : null}
      </header>
      {includes.length ? (
      <ul className="flex flex-col gap-2 t-body-s">
        {includes.map((i) => (
          <li key={i} className="flex gap-3">
            <span aria-hidden="true" className="mt-2 size-2 shrink-0 rounded-pill bg-primary" />
            {i}
          </li>
        ))}
      </ul>
      ) : null}
      <a href={action.href} data-fx="press" className="link mt-auto t-label">
        {action.label}
      </a>
    </article>
  );
}
