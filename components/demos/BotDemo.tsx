"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  botName,
  botServices,
  botSlots,
  botIntro,
  demoPhone,
} from "@/content/demos/bot";
import { money } from "@/content/demos/shared";
import { DemoIcon, DemoWindow } from "./DemoKit";
import { play } from "@/lib/sfx";
import { ProjectSignature } from "@/components/visuals/ProjectSignature";

type Message = { id: number; from: "bot" | "user"; text: string };
type Booking = {
  id: number;
  service: string;
  day: string;
  time: string;
  price: number;
  confirmed: boolean;
};
type Step = "start" | "service" | "time" | "confirm" | "done";

export default function BotDemo() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, from: "bot", text: botIntro },
  ]);
  const [step, setStep] = useState<Step>("start");
  const [typing, setTyping] = useState(false);
  const [service, setService] = useState<(typeof botServices)[number]>(
    botServices[0],
  );
  const [day, setDay] = useState("Завтра");
  const [time, setTime] = useState("");
  const [draft, setDraft] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const seq = useRef(1);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const chat = useRef<HTMLDivElement>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  useEffect(() => {
    const el = chat.current;
    if (el)
      el.scrollTo({
        top: el.scrollHeight,
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
  }, [messages, typing]);
  const append = (from: Message["from"], text: string) =>
    setMessages((list) => [...list, { id: seq.current++, from, text }]);
  const respond = (text: string, next: Step) => {
    if (timer.current) clearTimeout(timer.current);
    setTyping(true);
    timer.current = setTimeout(
      () => {
        append("bot", text);
        setStep(next);
        setTyping(false);
      },
      matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 520,
    );
  };
  const pick = (label: string, text: string, next: Step) => {
    if (typing) return;
    append("user", label);
    respond(text, next);
    play("tick");
  };
  const chooseService = (s: (typeof botServices)[number]) => {
    setService(s);
    pick(
      s.name,
      s.name +
        " - от " +
        money(s.price) +
        ". " +
        s.duration +
        ".\nВыберите день и свободное время.",
      "time",
    );
  };
  const chooseTime = (slot: string) => {
    setTime(slot);
    pick(
      day + ", " + slot,
      "Проверьте запись:\n" +
        service.name +
        "\n" +
        day +
        ", " +
        slot +
        " · " +
        service.duration +
        "\nОт " +
        money(service.price) +
        "\n\nДля примера используем тестовый контакт. Нажмите «Подтвердить запись».",
      "confirm",
    );
  };
  const book = () => {
    if (typing) return;
    const id = 308 + bookings.length;
    setBookings((list) => [
      {
        id,
        service: service.name,
        day,
        time,
        price: service.price,
        confirmed: false,
      },
      ...list,
    ]);
    pick(
      "Подтвердить запись · демо-контакт",
      "Заявка №" +
        id +
        " создана. Администратор проверит запись. Статус обновится прямо в этом чате.",
      "done",
    );
  };
  const confirm = (b: Booking) => {
    if (typing) return;
    setBookings((list) =>
      list.map((x) => (x.id === b.id ? { ...x, confirmed: true } : x)),
    );
    append(
      "bot",
      "Запись №" +
        b.id +
        " подтверждена!\n" +
        b.service +
        " · " +
        b.day.toLowerCase() +
        ", " +
        b.time +
        ".\nЖдём вас в сервисе. Спасибо!",
    );
    play("step");
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || typing) return;
    const text = draft.trim();
    setDraft("");
    append("user", text);
    if (/цен|стоим|прайс/i.test(text))
      respond(
        botServices
          .map((s) => s.name + " - от " + money(s.price) + " · " + s.duration)
          .join("\n"),
        "start",
      );
    else if (/статус|мо[яию] запис/i.test(text))
      respond(
        bookings[0]
          ? "Заявка №" +
              bookings[0].id +
              ": " +
              (bookings[0].confirmed ? "подтверждена" : "ждёт подтверждения") +
              ". " +
              bookings[0].day +
              ", " +
              bookings[0].time
          : "У вас пока нет записи. Давайте подберём время.",
        bookings.length ? "done" : "service",
      );
    else if (/адрес|где|режим/i.test(text))
      respond(
        "Алматы · демонстрационная точка PITSTOP\nПн–сб: 09:00–19:00. Воскресенье - выходной.\nТочный адрес в реальном боте отображается здесь.",
        "start",
      );
    else
      respond(
        "Могу записать на обслуживание, показать цены или статус записи. Выберите действие в меню ниже.",
        "start",
      );
  };

  return (
    <div className="pd bot-project">
      <div className="pd-project-heading">
        <span className="pd-tag">Клиент и администратор</span>
        <span className="pd-subtle">Telegram-бот для автосервиса</span>
      </div>
      <ProjectSignature id="bots" active={typing} />
      <div className="bot-workspace">
        <section className="tg-chat" aria-label="Диалог с ботом автосервиса">
          <header className="tg-header">
            <span className="tg-avatar">
              <DemoIcon name="car" />
            </span>
            <span>
              <strong>{botName}</strong>
              <small>{typing ? "печатает…" : "бот · запись без звонка"}</small>
            </span>
            <span className="tg-menu" aria-hidden="true">
              ···
            </span>
          </header>
          <div
            className="tg-messages"
            ref={chat}
            role="log"
            aria-label="Сообщения"
          >
            <span className="tg-date">Сегодня</span>
            {messages.map((m) => (
              <div key={m.id} className={"tg-message tg-message--" + m.from}>
                <p>{m.text}</p>
                <span className="tg-message-meta">
                  09:41
                  {m.from === "user" && <span aria-label="прочитано"> ✓✓</span>}
                </span>
              </div>
            ))}
            {typing && (
              <span
                className="tg-typing"
                role="status"
                aria-label="Бот печатает"
              >
                <i />
                <i />
                <i />
              </span>
            )}
          </div>
          <div
            className="tg-keyboard"
            aria-label="Действия бота"
            aria-busy={typing}
          >
            {step === "start" && (
              <>
                <button
                  type="button"
                  disabled={typing}
                  onClick={() =>
                    pick(
                      "Записаться в сервис",
                      "Какое обслуживание нужно? Выберите услугу.",
                      "service",
                    )
                  }
                >
                  <DemoIcon name="calendar" />
                  Записаться в сервис
                </button>
                <div className="tg-button-row">
                  <button
                    type="button"
                    disabled={typing}
                    onClick={() =>
                      pick(
                        "Услуги и цены",
                        botServices
                          .map((s) => s.name + " - от " + money(s.price))
                          .join("\n"),
                        "service",
                      )
                    }
                  >
                    Услуги и цены
                  </button>
                  <button
                    type="button"
                    disabled={typing}
                    onClick={() =>
                      pick(
                        "Моя запись",
                        bookings[0]
                          ? "Заявка №" +
                              bookings[0].id +
                              " · " +
                              (bookings[0].confirmed
                                ? "подтверждена"
                                : "ожидает администратора")
                          : "Записей пока нет. Выберите услугу.",
                        bookings.length ? "done" : "service",
                      )
                    }
                  >
                    Моя запись
                  </button>
                </div>
              </>
            )}
            {step === "service" &&
              botServices.map((s) => (
                <button
                  type="button"
                  key={s.id}
                  disabled={typing}
                  onClick={() => chooseService(s)}
                >
                  <span>{s.name}</span>
                  <small>от {money(s.price)}</small>
                </button>
              ))}
            {step === "time" && (
              <>
                <div className="pd-tabs">
                  {["Сегодня", "Завтра"].map((d) => (
                    <button
                      type="button"
                      key={d}
                      aria-pressed={day === d}
                      onClick={() => setDay(d)}
                    >
                      {d}
                    </button>
                  ))}
                </div>
                <div className="tg-slots">
                  {botSlots.map((s) => (
                    <button
                      type="button"
                      key={s}
                      disabled={
                        typing ||
                        bookings.some((b) => b.day === day && b.time === s)
                      }
                      onClick={() => chooseTime(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </>
            )}
            {step === "confirm" && (
              <button type="button" disabled={typing} onClick={book}>
                <DemoIcon name="check" />
                Подтвердить запись
              </button>
            )}
            {step === "done" && (
              <button
                type="button"
                disabled={typing}
                onClick={() =>
                  pick(
                    "Записать ещё автомобиль",
                    "Выберите услугу для новой записи.",
                    "service",
                  )
                }
              >
                Записать ещё автомобиль
              </button>
            )}
          </div>
          <form className="tg-composer" onSubmit={submit}>
            <button
              type="button"
              className="pd-icon-button"
              aria-label="Открыть меню бота"
              onClick={() => {
                if (!typing) setStep("start");
              }}
            >
              <DemoIcon name="grid" />
            </button>
            <input
              aria-label="Сообщение боту"
              placeholder="Напишите «цены» или «статус»"
              value={draft}
              maxLength={250}
              onChange={(e) => setDraft(e.target.value)}
            />
            <button
              type="submit"
              className="tg-send"
              disabled={typing || !draft.trim()}
              aria-label="Отправить сообщение"
            >
              <DemoIcon name="send" />
            </button>
          </form>
        </section>
        <DemoWindow title="PITSTOP / администратор" className="bot-manager">
          <div className="pd-panel-heading">
            <span className="pd-app-icon">
              <DemoIcon name="calendar" />
            </span>
            <div>
              <h3>Записи в сервис</h3>
              <p>Новые заявки из Telegram</p>
            </div>
          </div>
          <div className="manager-today">
            <span>Загрузка постов</span>
            <strong>Смена 09:00–19:00</strong>
            <div>
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
          {!bookings.length ? (
            <article className="manager-sample">
              <span className="pd-badge pd-badge--success">
                Подтверждено · пример
              </span>
              <h4>Плановое ТО</h4>
              <p>Пост 2 · 10:00–11:00</p>
              <div className="manager-car">
                <DemoIcon name="car" />
                <span>
                  Toyota Camry<small>Тестовый автомобиль</small>
                </span>
              </div>
              <p className="pd-subtle">
                Запишитесь в чате - рядом появится ваша заявка.
              </p>
            </article>
          ) : (
            bookings.map((b) => (
              <article className="manager-booking" key={b.id}>
                <header>
                  <strong>Заявка № {b.id}</strong>
                  <span
                    className={
                      "pd-badge " + (b.confirmed ? "pd-badge--success" : "")
                    }
                  >
                    {b.confirmed ? "Подтверждена" : "Новая"}
                  </span>
                </header>
                <h4>{b.service}</h4>
                <p>
                  <DemoIcon name="calendar" />
                  {b.day}, {b.time}
                </p>
                <p>
                  <DemoIcon name="clock" />
                  от {money(b.price)}
                </p>
                <div className="manager-contact">
                  <span className="pd-avatar">Д</span>
                  <span>
                    Демо-клиент<small>{demoPhone}</small>
                  </span>
                </div>
                {!b.confirmed && (
                  <button
                    type="button"
                    className="pd-button"
                    disabled={typing}
                    onClick={() => confirm(b)}
                  >
                    Подтвердить у администратора
                  </button>
                )}
              </article>
            ))
          )}
          <p className="pd-footnote">
            <DemoIcon name="bolt" />
            Подтверждение отобразится в чате клиента
          </p>
        </DemoWindow>
      </div>
      <p className="pd-disclaimer">
        Демонстрационный проект. Контакт тестовый, сообщения не отправляются в
        Telegram.
      </p>
    </div>
  );
}
