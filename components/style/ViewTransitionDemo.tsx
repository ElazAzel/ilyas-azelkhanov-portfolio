"use client";

import { startTransition, useState, ViewTransition } from "react";
import { formatPrice, packages } from "@/content/pricing";

const bot = packages.find((p) => p.id === "bot")!;

/** The same element (service title) persists between the index row and the page header. */
export function ViewTransitionDemo() {
  const [open, setOpen] = useState(false);
  const toggle = () => startTransition(() => setOpen((v) => !v));

  return (
    <div className="flex flex-col gap-5 rounded-md bg-mist p-5">
      {open ? (
        <div className="flex flex-col gap-4">
          <button type="button" onClick={toggle} className="link self-start t-label">
            Назад к услугам
          </button>
          <ViewTransition name="svc-title-bots" share="morph" default="none">
            <h3 className="t-display-l">Telegram-боты</h3>
          </ViewTransition>
          <p className="t-body-l measure">Бот, который принимает заявки и отвечает на частые вопросы, пока вы заняты.</p>
          <p className="t-label">{formatPrice(bot)} · {bot.term}</p>
        </div>
      ) : (
        <button
          type="button"
          onClick={toggle}
          className="grid grid-cols-[1fr_auto] items-baseline gap-5 rounded-sm text-left"
        >
          <ViewTransition name="svc-title-bots" share="morph" default="none">
            <span className="t-heading-m">Telegram-боты</span>
          </ViewTransition>
          <span className="t-label">{formatPrice(bot)}</span>
        </button>
      )}
      <p className="t-body-s text-slate">
        {open ? "Заголовок перелетел из строки списка в шапку страницы." : "Нажмите на строку: заголовок станет шапкой страницы услуги."}
      </p>
    </div>
  );
}
