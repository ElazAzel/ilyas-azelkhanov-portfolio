import Link from "next/link";
import { ParticleMonogram } from "@/components/motion/ParticleMonogram";
import { buttonClass } from "@/components/ui/Button";
import { services } from "@/content/services";

export default function NotFound() {
  return (
    <main className="container-page grid-page min-h-[calc(100svh-var(--spacing-8))] content-center gap-y-7 py-7">
      <div className="col-span-4 flex flex-col gap-5 md:col-span-8 lg:col-span-6">
        <h1 className="t-display-xl">Такой страницы нет</h1>
        <p className="t-body-l text-slate">Возможно, ссылка устарела. Нажмите на знак справа — а потом выберите, куда пойти дальше.</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/" data-fx="press" className={buttonClass("primary")}>
            На главную
          </Link>
          <Link href="/brief/" data-fx="press" className={buttonClass("secondary")}>
            Оценить задачу
          </Link>
        </div>
        <ul className="flex flex-wrap gap-2 pt-3">
          {services.map((s) => (
            <li key={s.id}>
              <Link href={s.href} data-fx="select" className="inline-block rounded-pill bg-mist px-4 py-2 t-label hover:bg-line">
                {s.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="col-span-4 md:col-span-8 lg:col-span-6">
        <ParticleMonogram className="w-full" />
      </div>
    </main>
  );
}
