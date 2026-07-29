import type { Metadata } from "next";
import { ProjectExplorer } from "@/src/components/projects/ProjectExplorer";
import { projects } from "@/src/data/projects";

export const metadata: Metadata = {
  title: "Проекты",
  description: "20 кейсов: реальные продукты и концепции SaaS, AI, EdTech, маркетплейсов, событий и корпоративных платформ.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <section className="page-section">
      <div className="shell">
        <div className="page-hero">
          <p className="eyebrow">/ ПРОЕКТЫ — 20</p>
          <h1>Не витрина экранов.<br />Истории решений.</h1>
          <p>Каждый кейс начинается с бизнес-контекста и заканчивается моделью ценности. Два проекта — реальные; остальные честно обозначены как концептуальные.</p>
        </div>
        <ProjectExplorer projects={projects} />
      </div>
    </section>
  );
}
