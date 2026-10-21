"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  baseModules,
  builderCopy,
  builderSteps,
  formats,
  groupSizes,
  places,
  roles,
} from "@/content/training";
import { packages } from "@/content/pricing";
import { whatsappLink } from "@/content/contacts";
import { money } from "@/content/demos/shared";
import { DemoIcon, DemoWindow } from "./DemoKit";
import { ProjectSignature } from "@/components/visuals/ProjectSignature";

const rate = packages.find((p) => p.id === "training-corporate")!.from!;
const time = (minutes: number) =>
  String(10 + Math.floor(minutes / 60)).padStart(2, "0") +
  ":" +
  String(minutes % 60).padStart(2, "0");
export default function TrainingDemo() {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const navigation = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const [role, setRole] = useState(roles[0]!.id);
  const [format, setFormat] = useState<string>(formats[0].id);
  const [group, setGroup] = useState<string>(groupSizes[1].id);
  const [place, setPlace] = useState<string>(places[0]);
  const [excluded, setExcluded] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    if (!root.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        document.documentElement.toggleAttribute(
          "data-training-in-view",
          entry!.isIntersecting,
        );
      },
      { rootMargin: "-80px 0px -80px 0px" },
    );
    observer.observe(root.current);
    return () => {
      observer.disconnect();
      document.documentElement.removeAttribute("data-training-in-view");
    };
  }, []);
  const r = roles.find((x) => x.id === role)!;
  const f = formats.find((x) => x.id === format)!;
  const g = groupSizes.find((x) => x.id === group)!;
  const allModules = useMemo(
    () => [baseModules[0]!, ...r.modules, baseModules[1]!],
    [r],
  );
  const modules = allModules.filter((m) => !excluded.includes(m));
  const breaks = f.id === "day" ? 30 : 0;
  const minutes = f.hours * 60 - breaks;
  const per = Math.floor(minutes / modules.length / 5) * 5;
  const price = f.hours * rate * g.groups;
  const schedule =
    f.id === "course"
      ? Array.from({ length: 4 }, (_, i) => ({
          title: modules
            .slice(
              Math.floor((i * modules.length) / 4),
              Math.max(
                Math.floor((i * modules.length) / 4) + 1,
                Math.floor(((i + 1) * modules.length) / 4),
              ),
            )
            .join(" · "),
          start: 0,
          duration: 120,
          meeting: i + 1,
        }))
      : modules.map((title, i) => ({
          title,
          start:
            i * per +
            (breaks && i >= Math.ceil(modules.length / 2) ? breaks : 0),
          duration:
            i === modules.length - 1
              ? minutes - per * (modules.length - 1)
              : per,
          meeting: 0,
        }));
  const program = [
    "Пример программы AI Workshop",
    r.label + " · " + f.note + " · " + g.label + " · " + place,
    ...schedule.map(
      (s) =>
        (s.meeting ? "Встреча " + s.meeting + " · " : "") +
        time(s.start) +
        "–" +
        time(s.start + s.duration) +
        "  " +
        s.title,
    ),
    ...(breaks ? ["Перерыв: 30 минут"] : []),
    "Ориентир: от " + money(price),
    "Финальная программа согласуется под задачи команды.",
  ];
  const download = () => {
    const url = URL.createObjectURL(
      new Blob([program.join("\n\n")], { type: "text/plain;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "ai-workshop-program.txt";
    a.click();
    setSaved(true);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const toggle = (m: string) => {
    if (excluded.includes(m))
      setExcluded((list) => list.filter((x) => x !== m));
    else if (modules.length > 1) setExcluded((list) => [...list, m]);
    setSaved(false);
  };
  const goToStep = (next: number) => {
    setStep(next);
    requestAnimationFrame(() => {
      document
        .getElementById(`${id}-step-${next}`)
        ?.focus({ preventScroll: true });
      navigation.current?.scrollIntoView({
        block: "start",
        behavior: "instant",
      });
    });
  };
  return (
    <div className="pd training-project" ref={root}>
      <DemoWindow title="AI Workshop / программа команды">
        <ProjectSignature id="training" compact />
        <nav
          className="workshop-progress"
          ref={navigation}
          aria-label={builderCopy.navigation}
        >
          {builderSteps.map((item, index) => (
            <button
              type="button"
              key={item.label}
              aria-label={`${builderCopy.step} ${index + 1}: ${item.title}`}
              aria-current={step === index ? "step" : undefined}
              aria-controls={`${id}-step-${index}`}
              data-complete={index < step}
              onClick={() => goToStep(index)}
            >
              <span aria-hidden="true">
                {index < step ? <DemoIcon name="check" /> : index + 1}
              </span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="workshop-columns" data-step={step}>
          <section className="workshop-settings">
            <div
              className="workshop-config-panel"
              data-active={step === 0}
              id={`${id}-step-0`}
              tabIndex={-1}
              aria-label={builderSteps[0].title}
            >
              <fieldset className="pd-fieldset">
                <legend>
                  <span className="workshop-step">1</span>Чем занимается
                  команда?
                </legend>
                <div className="workshop-roles">
                  {roles.map((x) => (
                    <button
                      type="button"
                      key={x.id}
                      aria-pressed={role === x.id}
                      onClick={() => {
                        if (role === x.id) return;
                        setRole(x.id);
                        setExcluded([]);
                        setSaved(false);
                      }}
                    >
                      {x.label}
                    </button>
                  ))}
                </div>
              </fieldset>
              <div className="workshop-selects">
                <label className="pd-label">
                  Участники
                  <select
                    aria-label="Участники"
                    className="pd-select"
                    value={group}
                    onChange={(e) => {
                      setGroup(e.target.value);
                      setSaved(false);
                    }}
                  >
                    {groupSizes.map((x) => (
                      <option key={x.id} value={x.id}>
                        {x.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="pd-label">
                  Площадка
                  <select
                    aria-label="Площадка"
                    className="pd-select"
                    value={place}
                    onChange={(e) => {
                      setPlace(e.target.value);
                      setSaved(false);
                    }}
                  >
                    {places.map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
            <div
              className="workshop-config-panel"
              data-active={step === 1}
              id={`${id}-step-1`}
              tabIndex={-1}
              aria-label={builderSteps[1].title}
            >
              <fieldset className="pd-fieldset">
                <legend>
                  <span className="workshop-step">2</span>Сколько времени есть?
                </legend>
                <div className="workshop-formats">
                  {formats.map((x) => (
                    <button
                      type="button"
                      key={x.id}
                      aria-pressed={format === x.id}
                      onClick={() => {
                        setFormat(x.id);
                        setSaved(false);
                      }}
                    >
                      <strong>{x.label}</strong>
                      <small>{x.note}</small>
                      {format === x.id && <DemoIcon name="check" />}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
            <div
              className="workshop-config-panel"
              data-active={step === 2}
              id={`${id}-step-2`}
              tabIndex={-1}
              aria-label={builderSteps[2].title}
            >
              <fieldset className="pd-fieldset">
                <legend>
                  <span className="workshop-step">3</span>Что включить в
                  программу?
                </legend>
                <p className="workshop-topic-hint">{builderCopy.topicHint}</p>
                <div className="workshop-topics">
                  {allModules.map((m) => (
                    <label key={m}>
                      <input
                        type="checkbox"
                        checked={!excluded.includes(m)}
                        disabled={!excluded.includes(m) && modules.length === 1}
                        onChange={() => toggle(m)}
                      />
                      <span>{m}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
            {step < 3 && (
              <div className="workshop-mobile-controls">
                <div
                  className="workshop-estimate"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <span>
                    {builderCopy.estimate}
                    <strong>от {money(price)}</strong>
                  </span>
                  <small>
                    {f.hours} ч · {builderCopy.selected.toLowerCase()}:{" "}
                    {modules.length}
                  </small>
                </div>
                <div className="workshop-step-actions">
                  {step > 0 && (
                    <button
                      type="button"
                      className="pd-icon-button"
                      aria-label={`${builderCopy.back}: ${builderSteps[step - 1]!.title.toLowerCase()}`}
                      onClick={() => goToStep(step - 1)}
                    >
                      <DemoIcon name="back" />
                    </button>
                  )}
                  <button
                    type="button"
                    className="pd-button"
                    onClick={() => goToStep(step + 1)}
                  >
                    {builderCopy.next[step]}
                    <DemoIcon name="arrow" />
                  </button>
                </div>
              </div>
            )}
          </section>
          <section
            className="workshop-program"
            data-active={step === 3}
            id={`${id}-step-3`}
            tabIndex={-1}
            aria-label={builderSteps[3].title}
          >
            <button
              type="button"
              className="workshop-edit"
              onClick={() => goToStep(0)}
            >
              <DemoIcon name="back" />
              {builderCopy.edit}
            </button>
            <header>
              <span className="pd-badge">Программа · пример</span>
              <h3>{r.label}: ИИ в работе</h3>
              <p>
                {f.hours} часов · {g.label} · {place.toLowerCase()}
              </p>
            </header>
            <div className="workshop-timeline">
              {schedule.map((s, i) => (
                <div className="workshop-session-group" key={`${i}-${s.title}`}>
                  {breaks > 0 && i === Math.ceil(modules.length / 2) && (
                    <p className="workshop-break">
                      <DemoIcon name="coffee" />
                      {time(i * per)} · Перерыв, 30 минут
                    </p>
                  )}
                  <article>
                    <time>
                      {s.meeting ? "Встреча " + s.meeting : time(s.start)}
                    </time>
                    <div>
                      <strong>{s.title}</strong>
                      <p>
                        {s.duration} мин ·{" "}
                        {i === 0
                          ? "Разбор и демонстрация"
                          : i === schedule.length - 1
                            ? "Чек-лист и обсуждение"
                            : "Практика на задачах отдела"}
                      </p>
                      <span>
                        {i === 0
                          ? "Общий контекст"
                          : i === schedule.length - 1
                            ? "Безопасная работа"
                            : "Практическое задание"}
                      </span>
                    </div>
                  </article>
                </div>
              ))}
            </div>
            <div className="workshop-deliverables">
              <DemoIcon name="file" />
              <p>
                <strong>После встречи</strong>
                <span>Программа, рабочие шаблоны и список инструментов</span>
              </p>
            </div>
            <footer>
              <span aria-live="polite" aria-atomic="true">
                <small>Предварительно</small>
                <strong>от {money(price)}</strong>
                <small>
                  {f.hours} ч × {money(rate)}
                  {g.groups > 1 ? " × " + g.groups + " группы" : ""}
                </small>
              </span>
              <button
                type="button"
                className="pd-icon-button"
                onClick={download}
                aria-label="Скачать программу"
              >
                <DemoIcon name="download" />
              </button>
            </footer>
            <button
              type="button"
              className="pd-button pd-button--outline"
              onClick={download}
            >
              <DemoIcon name={saved ? "check" : "download"} />
              {saved ? "Программа скачана" : "Скачать программу"}
            </button>
            <a
              className="pd-button"
              href={whatsappLink(
                "Здравствуйте, Ильяс! Хочу обсудить тренинг.\n" +
                  program.join("\n"),
              )}
            >
              Обсудить эту программу <DemoIcon name="arrow" />
            </a>
          </section>
        </div>
      </DemoWindow>
      <p className="pd-disclaimer">
        Состав программы - пример. Стоимость рассчитывается по действующему
        тарифу сайта.
      </p>
    </div>
  );
}
