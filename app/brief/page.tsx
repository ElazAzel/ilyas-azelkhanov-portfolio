import type { Metadata } from "next";
import { Brief } from "@/components/site/Brief";
import { briefCopy } from "@/content/brief";

export const metadata: Metadata = {
  title: "Оценить задачу",
  description: "Четыре вопроса - и ориентир по цене. Ответ в WhatsApp или Telegram.",
};

export default function BriefPage() {
  return (
    <main data-no-float className="container-page flex min-h-[calc(100svh-var(--spacing-8))] flex-col gap-7 pt-6 pb-9">
      <header className="flex flex-col gap-3">
        <h1 className="t-display-xl">{briefCopy.title}</h1>
        <p className="measure t-body-l text-slate">{briefCopy.lead}</p>
      </header>
      <Brief />
    </main>
  );
}
