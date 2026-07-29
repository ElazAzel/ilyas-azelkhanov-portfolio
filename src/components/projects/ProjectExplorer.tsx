"use client";

import { Grid2X2, List, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { projectCategories, type Project } from "@/src/lib/types";
import { ProjectCard } from "./ProjectCard";

const mainFilters = ["Все", "Реальные проекты", ...projectCategories] as const;

export function ProjectExplorer({ projects }: { projects: Project[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof mainFilters)[number]>("Все");
  const [view, setView] = useState<"grid" | "list">("grid");

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesQuery = !normalized || [project.title, project.descriptor, project.category, ...project.tags].join(" ").toLowerCase().includes(normalized);
      const matchesFilter =
        filter === "Все" ||
        (filter === "Реальные проекты" && !project.isConcept) ||
        project.category === filter;
      return matchesQuery && matchesFilter;
    });
  }, [filter, projects, query]);

  return (
    <div className="explorer">
      <div className="explorer-toolbar">
        <label className="search-field"><Search size={18} /><span className="sr-only">Поиск проектов</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск по названию, задаче или компетенции" /></label>
        <div className="view-toggle" aria-label="Вид каталога">
          <button className={view === "grid" ? "active" : ""} onClick={() => setView("grid")} aria-label="Сетка"><Grid2X2 /></button>
          <button className={view === "list" ? "active" : ""} onClick={() => setView("list")} aria-label="Список"><List /></button>
        </div>
      </div>
      <div className="filters" aria-label="Фильтры проектов">
        <SlidersHorizontal size={16} aria-hidden />
        {mainFilters.map((item) => <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}</button>)}
      </div>
      <p className="result-count">{results.length} {results.length === 1 ? "проект" : "проектов"}</p>
      {results.length ? (
        <div className={`projects-layout ${view}`}>{results.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} view={view} />)}</div>
      ) : (
        <div className="empty-state"><Search size={30} /><h2>Подходящего проекта не найдено.</h2><p>Возможно, такой кейс ещё предстоит создать.</p></div>
      )}
    </div>
  );
}
