"use client";

import { useEffect, useRef, useState } from "react";
import {
  automationStages,
  printCatalog,
  requestSamples,
} from "@/content/demos/automation";
import { money } from "@/content/demos/shared";
import { DemoIcon, DemoWindow } from "./DemoKit";
import { ProjectSignature } from "@/components/visuals/ProjectSignature";

type Lead = {
  id: number;
  product: string;
  qty: number;
  city: string;
  total: number;
  status: "Новая" | "Согласована";
  reply: string;
};
function extract(text: string) {
  const product = printCatalog.find((p) => p.keyword.test(text));
  const qty = Number(
    text.match(/\b(\d{1,4})\s*(?:шт|худи|футбол|шоппер)/i)?.[1] || 0,
  );
  const city = /астан/i.test(text)
    ? "Астана"
    : /алмат/i.test(text)
      ? "Алматы"
      : "Уточнить город";
  return { product, qty, city, total: product && qty ? product.unit * qty : 0 };
}

export default function AutomationDemo() {
  const [tab, setTab] = useState("Входящие");
  const [text, setText] = useState(requestSamples[0]!.text);
  const [stage, setStage] = useState(-1);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("Все");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [events, setEvents] = useState<string[]>([
    "Рабочее пространство готово. Сценарий «Заявка → расчёт → CRM» включён.",
  ]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const preview = extract(text);
  const run = () => {
    if (running) return;
    setError("");
    setSelected(null);
    setStage(-1);
    if (!preview.product || preview.qty < 1) {
      setError(
        "Укажите изделие (худи, футболки или шопперы) и количество. Например: «30 худи в Алматы».",
      );
      return;
    }
    const data = { ...preview, product: preview.product };
    setRunning(true);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    automationStages.forEach((title, i) => {
      timers.current.push(
        setTimeout(
          () => {
            setStage(i);
            setEvents((list) => [
              title + " · " + new Date().toLocaleTimeString("ru-RU"),
              ...list,
            ]);
            if (i === automationStages.length - 1) {
              const lead: Lead = {
                id: 2088 + leads.length,
                product: data.product.name,
                qty: data.qty,
                city: data.city,
                total: data.total,
                status: "Новая",
                reply:
                  "Здравствуйте! Предварительный расчёт: " +
                  data.qty +
                  " × " +
                  data.product.name.toLowerCase() +
                  " по " +
                  money(data.product.unit) +
                  " = " +
                  money(data.total) +
                  ". Город: " +
                  data.city +
                  ". Для точного расчёта пришлите макет и размерный ряд. Менеджер подтвердит срок производства.",
              };
              setLeads((list) => [lead, ...list]);
              setSelected(lead);
              setRunning(false);
            }
          },
          reduce ? 0 : 450 + i * 500,
        ),
      );
    });
  };
  const approve = (lead: Lead) => {
    setLeads((list) =>
      list.map((l) => (l.id === lead.id ? { ...l, status: "Согласована" } : l)),
    );
    setSelected((l) =>
      l?.id === lead.id ? { ...l, status: "Согласована" } : l,
    );
    setEvents((list) => [
      "Заявка №" + lead.id + " согласована менеджером",
      ...list,
    ]);
  };

  return (
    <div className="pd automation-project">
      <DemoWindow title="Flowdesk / студия печати">
        <div className="flow-header">
          <span className="flow-brand">
            <DemoIcon name="bolt" />
            flowdesk<span>/</span>
            <small>Студия печати</small>
          </span>
          <span className="pd-status">Сценарий включён</span>
        </div>
        <ProjectSignature id="automation" active={running} />
        <nav className="flow-nav" aria-label="Разделы автоматизации">
          {["Входящие", "CRM", "Журнал"].map((t) => (
            <button
              type="button"
              key={t}
              aria-pressed={tab === t}
              onClick={() => setTab(t)}
            >
              {t}
              {t === "CRM" && <span>{leads.length}</span>}
            </button>
          ))}
        </nav>
        <div className="flow-body">
          <div className="flow-workflow">
            {automationStages.map((s, i) => (
              <div
                key={s}
                data-active={stage === i}
                data-done={stage > i || (!running && stage === 3)}
              >
                <span>
                  {stage > i ? (
                    <DemoIcon name="check" />
                  ) : (
                    <DemoIcon
                      name={(["send", "bolt", "file", "grid"] as const)[i]!}
                    />
                  )}
                </span>
                <small>{s}</small>
              </div>
            ))}
          </div>
          {tab === "Входящие" && (
            <div className="flow-columns">
              <section className="flow-inbox">
                <header>
                  <span className="pd-app-icon">
                    <DemoIcon name="send" />
                  </span>
                  <div>
                    <h3>Входящее сообщение</h3>
                    <p>Канал: WhatsApp · демо</p>
                  </div>
                </header>
                <div className="flow-presets">
                  {requestSamples.map((s) => (
                    <button
                      type="button"
                      key={s.label}
                      disabled={running}
                      onClick={() => {
                        setText(s.text);
                        setStage(-1);
                        setSelected(null);
                        setError("");
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
                <label className="pd-label" htmlFor="flow-request">
                  Текст заявки
                </label>
                <textarea
                  id="flow-request"
                  aria-describedby={error ? "flow-error" : undefined}
                  value={text}
                  maxLength={1200}
                  disabled={running}
                  onChange={(e) => {
                    setText(e.target.value);
                    setSelected(null);
                    setStage(-1);
                    setError("");
                  }}
                />
                {error && (
                  <p id="flow-error" className="pd-error" role="alert">
                    {error}
                  </p>
                )}
                <button
                  type="button"
                  className="pd-button"
                  disabled={running}
                  onClick={run}
                >
                  <DemoIcon name={running ? "clock" : "bolt"} />
                  {running ? "Обрабатываю заявку…" : "Запустить обработку"}
                </button>
                <p className="pd-subtle">
                  Можно изменить текст: изделие, количество и город попадут в
                  карточку.
                </p>
              </section>
              <section className="flow-result" aria-live="polite">
                <header>
                  <h3>
                    {selected ? "Результат обработки" : "Данные из сообщения"}
                  </h3>
                  <span className="pd-badge">
                    {selected ? "Записано в CRM" : "Предпросмотр"}
                  </span>
                </header>
                <dl className="flow-fields">
                  <div>
                    <dt>Изделие</dt>
                    <dd>{preview.product?.name || "Нужно уточнить"}</dd>
                  </div>
                  <div>
                    <dt>Количество</dt>
                    <dd>
                      {preview.qty ? preview.qty + " шт." : "Нужно уточнить"}
                    </dd>
                  </div>
                  <div>
                    <dt>Город</dt>
                    <dd>{preview.city}</dd>
                  </div>
                  <div>
                    <dt>Цена за единицу</dt>
                    <dd>
                      {preview.product ? money(preview.product.unit) : "-"}
                    </dd>
                  </div>
                </dl>
                <div className="flow-total">
                  <small>Предварительная сумма</small>
                  <strong>{money(preview.total)}</strong>
                </div>
                {selected ? (
                  <>
                    <div className="flow-reply">
                      <span>
                        <DemoIcon name="check" />
                        Ответ подготовлен
                      </span>
                      <p>{selected.reply}</p>
                    </div>
                    <button
                      type="button"
                      className="pd-button pd-button--outline"
                      onClick={() => setTab("CRM")}
                    >
                      Открыть CRM <DemoIcon name="arrow" />
                    </button>
                  </>
                ) : (
                  <p className="pd-subtle">
                    После запуска здесь появится готовый ответ клиенту.
                  </p>
                )}
              </section>
            </div>
          )}
          {tab === "CRM" && (
            <section className="flow-crm">
              <header>
                <div>
                  <h3>Заявки на производство</h3>
                  <p>
                    {leads.length} заявок ·{" "}
                    {money(leads.reduce((s, l) => s + l.total, 0))}
                  </p>
                </div>
                <select
                  aria-label="Фильтр статуса CRM"
                  className="pd-select"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  {["Все", "Новая", "Согласована"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </header>
              {!leads.length ? (
                <div className="flow-crm-empty">
                  <DemoIcon name="grid" />
                  <h4>Рабочая очередь готова</h4>
                  <p>
                    Обработайте сообщение во «Входящих» - карточка появится
                    здесь со всеми данными и расчётом.
                  </p>
                  <button
                    type="button"
                    className="pd-button"
                    onClick={() => setTab("Входящие")}
                  >
                    Создать первую заявку
                  </button>
                </div>
              ) : (
                <div className="flow-table-wrap">
                  <table className="flow-table">
                    <thead>
                      <tr>
                        <th>Заявка</th>
                        <th>Заказ</th>
                        <th>Сумма</th>
                        <th>Статус</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads
                        .filter((l) => filter === "Все" || l.status === filter)
                        .map((l) => (
                          <tr key={l.id}>
                            <td>
                              <strong>#{l.id}</strong>
                              <small>{l.city}</small>
                            </td>
                            <td>
                              {l.product}
                              <small>{l.qty} шт.</small>
                            </td>
                            <td>{money(l.total)}</td>
                            <td>
                              {l.status === "Новая" ? (
                                <button
                                  type="button"
                                  className="pd-button pd-button--small"
                                  onClick={() => approve(l)}
                                >
                                  Согласовать
                                </button>
                              ) : (
                                <span className="pd-badge pd-badge--success">
                                  Согласована
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}
          {tab === "Журнал" && (
            <section className="flow-log">
              <h3>История выполнения</h3>
              {events.map((e, i) => (
                <p key={events.length - i}>
                  <DemoIcon name="check" />
                  <span>{e}</span>
                </p>
              ))}
            </section>
          )}
        </div>
        <footer className="flow-footer">
          <span>
            <i />
            Все изменения сохранены в этой сессии
          </span>
          <span>Без внешних подключений</span>
        </footer>
      </DemoWindow>
      <p className="pd-disclaimer">
        Демонстрационный проект. Правила обработки и цены условные; сумма
        рассчитывается из выбранных данных.
      </p>
    </div>
  );
}
