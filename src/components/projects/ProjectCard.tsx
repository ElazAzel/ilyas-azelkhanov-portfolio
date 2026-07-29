import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/src/lib/types";
import { ProjectVisual } from "./ProjectVisual";

export function ProjectCard({ project, index = 0, view = "grid" }: { project: Project; index?: number; view?: "grid" | "list" }) {
  return (
    <article className={`project-card ${view}`} style={{ "--project-accent": project.accentColor } as React.CSSProperties}>
      <div className="project-copy">
        <div className="project-meta">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span>{project.category}</span>
          <span className={project.isConcept ? "badge concept" : "badge real"}>{project.isConcept ? "Концептуальный кейс" : "Реальный проект"}</span>
        </div>
        <h3>{project.title}</h3>
        <p className="descriptor">{project.descriptor}</p>
        <div className="project-problem"><span>Проблема</span><p>{project.businessProblem}</p></div>
        <div className="tag-row">{project.tags.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}</div>
        <Link className="text-link" href={`/projects/${project.slug}`}>Открыть кейс <ArrowRight size={17} /></Link>
      </div>
      <ProjectVisual project={project} compact={view === "grid"} />
    </article>
  );
}
