"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { DemoSlot } from "@/components/demos/DemoSlot";
import { NightStage } from "@/components/motion/NightStage";
import { ServiceVisual } from "@/components/visuals/ServiceVisual";
import { homeCopy, playgroundProjects } from "@/content/home";

type ProjectId = (typeof playgroundProjects)[number]["id"];

export function ProjectPlayground() {
  const [selected, setSelected] = useState<ProjectId>("mini-apps");
  const [visited, setVisited] = useState<ProjectId[]>(["mini-apps"]);
  const choices = useRef<HTMLDivElement>(null);
  const index = playgroundProjects.findIndex(
    (project) => project.id === selected,
  );
  const active = playgroundProjects[index]!;

  useEffect(() => {
    const stage = document.getElementById("playground");
    const contact = document.querySelector(".floating-contact");
    if (!stage || !contact) return;
    const observer = new IntersectionObserver(([entry]) => {
      contact.toggleAttribute("data-demo-active", !!entry?.isIntersecting);
    });
    observer.observe(stage);
    return () => {
      observer.disconnect();
      contact.removeAttribute("data-demo-active");
    };
  }, []);

  const select = (id: ProjectId) => {
    setVisited((current) =>
      current.includes(id) ? current : [...current, id],
    );
    setSelected(id);
    const rail = choices.current;
    const button = document.getElementById(`project-choice-${id}`);
    if (rail && button && rail.scrollWidth > rail.clientWidth) {
      const left =
        rail.scrollLeft +
        button.getBoundingClientRect().left -
        rail.getBoundingClientRect().left -
        (rail.clientWidth - button.clientWidth) / 2;
      rail.scrollTo({
        left,
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    }
  };

  return (
    <section id="playground" aria-labelledby="playground-title">
      <NightStage className="playground">
        <div className="playground-heading">
          <div>
            <p className="t-label text-slate-inverse">{homeCopy.demosLead}</p>
            <h2 id="playground-title" className="t-display-xl">
              {homeCopy.demos}
            </h2>
          </div>
          <p className="playground-ordinal" aria-hidden="true">
            <strong>{String(index + 1).padStart(2, "0")}</strong>
            <span>/ {String(playgroundProjects.length).padStart(2, "0")}</span>
          </p>
        </div>

        <div className="playground-layout">
          <div className="playground-sidebar">
            <label className="playground-mobile-picker">
              <span className="sr-only">Выберите проект</span>
              <select
                value={selected}
                onChange={(event) => select(event.target.value as ProjectId)}
              >
                {playgroundProjects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.brand} · {project.kind}
                  </option>
                ))}
              </select>
            </label>
            <div
              ref={choices}
              className="playground-choices"
              role="group"
              aria-label="Выбор демонстрационного проекта"
            >
              {playgroundProjects.map((project, projectIndex) => (
                <button
                  key={project.id}
                  id={`project-choice-${project.id}`}
                  type="button"
                  aria-pressed={selected === project.id}
                  aria-controls={`project-panel-${project.id}`}
                  data-fx="select"
                  onClick={() => select(project.id)}
                >
                  <span className="playground-choice-number" aria-hidden="true">
                    {String(projectIndex + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <strong>{project.brand}</strong>
                    <small>{project.kind}</small>
                  </span>
                  <span className="playground-choice-arrow" aria-hidden="true">
                    ↗
                  </span>
                </button>
              ))}
            </div>
            <p className="playground-note t-body-s text-slate-inverse">
              Демонстрационные проекты. Выбирайте, нажимайте, пробуйте.
            </p>
          </div>

          <div className="playground-stage">
            <span
              className="sr-only"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              Пример {index + 1} из {playgroundProjects.length}: {active.brand}.{" "}
              {active.kind}.
            </span>
            <div className="playground-stage-header">
              <span className="playground-live">
                <i aria-hidden="true" />
                Интерактивный пример
              </span>
              <Link href={active.href} data-fx="select">
                Подробнее об услуге <span aria-hidden="true">↗</span>
              </Link>
              <button
                className="playground-next"
                type="button"
                aria-label="Следующий пример"
                data-fx="select"
                onClick={() =>
                  select(
                    playgroundProjects[(index + 1) % playgroundProjects.length]!
                      .id,
                  )
                }
              >
                <span aria-hidden="true">→</span>
              </button>
            </div>
            {playgroundProjects.map((project) => (
              <section
                key={project.id}
                id={`project-panel-${project.id}`}
                className="playground-panel"
                hidden={selected !== project.id}
                aria-labelledby={`project-choice-${project.id}`}
              >
                {visited.includes(project.id) && (
                  <>
                    <p className="playground-instruction t-body-m">
                      {project.lead}
                    </p>
                    <div className="playground-demo">
                      <DemoSlot
                        id={project.id}
                        poster={
                          <ServiceVisual
                            id={project.id}
                            className="aspect-[4/3] w-full"
                          />
                        }
                      />
                    </div>
                  </>
                )}
              </section>
            ))}
          </div>
        </div>
      </NightStage>
    </section>
  );
}
