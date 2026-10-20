import type { ReactNode } from "react";

type Kind = "demo" | "own" | "measured";

const CAPTION: Record<Kind, string> = {
  demo: "Демо-сценарий. Ничего не отправляется, данные выдуманы для примера.",
  own: "Собственный продукт.",
  measured: "Значения измерены в вашем браузере прямо сейчас.",
};

/** Stage for a live demo: mist surface plus a mandatory honest caption. */
export function DemoStage({ kind, children, caption }: { kind: Kind; children: ReactNode; caption?: string }) {
  return (
    <figure className="flex flex-col gap-3">
      <div className="rounded-md bg-mist p-5">{children}</div>
      <figcaption className="flex items-center gap-2 t-body-s text-slate">
        <span aria-hidden="true" className="size-2 shrink-0 rounded-pill bg-primary" />
        {caption ?? CAPTION[kind]}
      </figcaption>
    </figure>
  );
}
