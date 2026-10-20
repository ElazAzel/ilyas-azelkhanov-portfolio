import type { Metadata } from "next";
import { Brief } from "@/components/site/Brief";

export const metadata: Metadata = {
  title: "Оценить задачу",
  description: "Четыре вопроса — и ориентир по цене. Ответ в WhatsApp или Telegram.",
};

export default function BriefPage() {
  return (
    <main className="container-page flex min-h-[calc(100svh-var(--spacing-8))] flex-col gap-7 pt-6 pb-9">
      <header className="flex flex-col gap-3">
        <h1 className="t-display-xl">Оценить задачу</h1>
        <p className="measure t-body-l text-slate">Четыре вопроса — и вы увидите ориентир по цене. Готовый текст отправите мне в WhatsApp или Telegram.</p>
      </header>
      <Brief />
    </main>
  );
}
