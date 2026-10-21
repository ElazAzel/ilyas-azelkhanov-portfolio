"use client";

import { useState, type FormEvent } from "react";
import { interiorCopy, interiorProjects } from "@/content/demos/website";
import { DemoIcon, DemoPhoto, DemoWindow } from "./DemoKit";
import { ProjectSculpture } from "@/components/visuals/ProjectSculpture";
import { projectArt } from "@/content/demos/art";

export default function WebsiteProject() {
  const [view, setView] = useState("home");
  const [filter, setFilter] = useState("Все");
  const [project, setProject] = useState(interiorProjects[0]!);
  const [area, setArea] = useState(72);
  const [kind, setKind] = useState("Квартира");
  const [priority, setPriority] = useState("Уют и удобное хранение");
  const [done, setDone] = useState(false);
  const openBrief = () => {
    setDone(false);
    setView("brief");
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    setDone(true);
  };
  const download = () => {
    const url = URL.createObjectURL(
      new Blob(
        [
          "Демонстрационный бриф FORMA\nОбъект: " +
            kind +
            "\nПлощадь: " +
            area +
            " м²\nПриоритет: " +
            priority +
            "\nСтатус: готов к обсуждению",
        ],
        { type: "text/plain;charset=utf-8" },
      ),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "forma-brief.txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <DemoWindow
      title="forma.studio / демонстрационный сайт"
      className="interior-project"
    >
      <div className="interior-nav">
        <button
          type="button"
          className="interior-wordmark"
          aria-label="Главная FORMA"
          onClick={() => setView("home")}
        >
          {interiorCopy.brand}
          <span>интерьерная студия</span>
        </button>
        <div>
          <button
            type="button"
            className="interior-nav-link"
            onClick={() => setView("projects")}
          >
            Проекты
          </button>
          <button
            type="button"
            className="interior-nav-contact"
            onClick={openBrief}
          >
            Обсудить <DemoIcon name="arrow" />
          </button>
        </div>
      </div>
      <div className="interior-scroll" key={view}>
        {view === "home" && (
          <>
            <div className="interior-hero">
              <DemoPhoto
                name="interior"
                alt="Светлая гостиная с деревянной мебелью и мягким диваном"
              />
              <div className="interior-hero-copy">
                <span>Жилые интерьеры · Алматы и онлайн</span>
                <h3>
                  {projectArt.websites.title[0]}
                  <br />
                  {projectArt.websites.title[1]}
                </h3>
                <p>{interiorCopy.lead}</p>
                <button type="button" onClick={() => setView("projects")}>
                  Смотреть проекты <DemoIcon name="arrow" />
                </button>
              </div>
              <ProjectSculpture id="websites" />
              <span className="interior-hero-note">
                Эстетика повседневной жизни
              </span>
            </div>
            <section className="interior-editorial">
              <span>Наш подход</span>
              <h4>
                Красиво жить.
                <br />
                Удобно каждый день.
              </h4>
              <p>
                Пространство должно помогать вам жить, а не требовать внимания.
                Продумываем свет, хранение и маршруты - чтобы всё оказалось на
                своём месте.
              </p>
              <button
                type="button"
                className="interior-text-link"
                onClick={openBrief}
              >
                Начать с вашей идеи <DemoIcon name="arrow" />
              </button>
            </section>
            <div className="interior-featured">
              <DemoPhoto name="kitchen" alt="Современная кухня с островом" />
              <div>
                <small>Избранный проект · дом, 148 м²</small>
                <h4>Свет и воздух</h4>
                <button
                  type="button"
                  className="interior-text-link"
                  onClick={() => {
                    setProject(interiorProjects[1]!);
                    setView("detail");
                  }}
                >
                  Открыть проект <DemoIcon name="arrow" />
                </button>
              </div>
            </div>
          </>
        )}
        {view === "projects" && (
          <section className="interior-projects">
            <div className="interior-page-title">
              <span>Портфолио студии · пример</span>
              <h3>Места для жизни.</h3>
            </div>
            <div className="interior-filters">
              {["Все", "Квартиры", "Дома"].map((f) => (
                <button
                  type="button"
                  key={f}
                  aria-pressed={filter === f}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="interior-project-grid">
              {interiorProjects
                .filter((p) => filter === "Все" || p.type === filter)
                .map((p) => (
                  <button
                    type="button"
                    className="interior-project-card"
                    key={p.id}
                    onClick={() => {
                      setProject(p);
                      setView("detail");
                    }}
                  >
                    <DemoPhoto name={p.photo} alt={p.title} />
                    <div>
                      <h4>{p.title}</h4>
                      <small>
                        {p.type} · {p.area} м²
                      </small>
                      <DemoIcon name="arrow" />
                    </div>
                  </button>
                ))}
            </div>
          </section>
        )}
        {view === "detail" && (
          <article className="interior-project-detail">
            <button
              type="button"
              className="interior-text-link"
              onClick={() => setView("projects")}
            >
              <DemoIcon name="back" />
              Все проекты
            </button>
            <DemoPhoto name={project.photo} alt={project.title} />
            <div className="interior-page-title">
              <span>
                {project.type} · {project.area} м² · концепт
              </span>
              <h3>{project.title}</h3>
              <p>{project.note}</p>
            </div>
            <ol>
              {interiorCopy.approach.map((s, i) => (
                <li key={s}>
                  <span>{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
            <button
              type="button"
              className="interior-primary"
              onClick={openBrief}
            >
              Хочу обсудить свой интерьер <DemoIcon name="arrow" />
            </button>
          </article>
        )}
        {view === "brief" && (
          <section className="interior-brief">
            <span className="interior-caption">
              Первый шаг к вашему пространству
            </span>
            <h3>{done ? "Ваш бриф готов." : "Расскажите об идее."}</h3>
            {done ? (
              <div className="interior-brief-done" role="status">
                <span className="pd-success-circle">
                  <DemoIcon name="check" />
                </span>
                <p>
                  {kind} · {area} м²
                </p>
                <p>
                  Сохранили параметры в демонстрационной заявке. Бриф можно
                  скачать и дополнить.
                </p>
                <button
                  type="button"
                  className="interior-primary"
                  onClick={download}
                >
                  <DemoIcon name="download" />
                  Скачать бриф
                </button>
                <button
                  type="button"
                  className="interior-text-link"
                  onClick={() => setDone(false)}
                >
                  Изменить параметры
                </button>
              </div>
            ) : (
              <form onSubmit={submit}>
                <fieldset>
                  <legend>Что будем создавать?</legend>
                  <div className="interior-filters">
                    {["Квартира", "Дом", "Коммерция"].map((k) => (
                      <button
                        type="button"
                        key={k}
                        aria-pressed={kind === k}
                        onClick={() => setKind(k)}
                      >
                        {k}
                      </button>
                    ))}
                  </div>
                </fieldset>
                <label className="interior-range">
                  Площадь объекта <strong>{area} м²</strong>
                  <input
                    type="range"
                    aria-label="Площадь объекта"
                    min={25}
                    max={250}
                    step={1}
                    value={area}
                    onChange={(e) => setArea(Number(e.target.value))}
                  />
                </label>
                <label className="pd-label">
                  Что для вас важно?
                  <select
                    aria-label="Приоритет интерьера"
                    className="pd-select"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option>Уют и удобное хранение</option>
                    <option>Пространство для семьи</option>
                    <option>Минимализм и свободная планировка</option>
                  </select>
                </label>
                <button type="submit" className="interior-primary">
                  Сформировать бриф <DemoIcon name="arrow" />
                </button>
                <p className="pd-subtle">
                  Этот пример не собирает ваши контакты.
                </p>
              </form>
            )}
          </section>
        )}
        <footer className="interior-footer">
          <strong>FORMA</strong>
          <span>Интерьер начинается с вас.</span>
          <button type="button" onClick={openBrief}>
            Обсудить проект
          </button>
        </footer>
      </div>
    </DemoWindow>
  );
}
