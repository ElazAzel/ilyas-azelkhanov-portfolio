import type { Project } from "@/src/lib/types";
import { Bot, CalendarDays, ChartNoAxesCombined, CheckCircle2, FileSearch, LayoutDashboard, Map, Users } from "lucide-react";

export function ProjectVisual({ project, compact = false }: { project: Project; compact?: boolean }) {
  const Icon =
    project.category === "AI и автоматизация" ? Bot :
    project.category === "События и геймификация" ? CalendarDays :
    project.category === "EdTech и сообщества" ? Users :
    project.category === "Маркетплейсы" ? FileSearch :
    project.category === "Корпоративные платформы" ? Map : LayoutDashboard;

  return (
    <div className={`product-ui ${compact ? "compact" : ""}`} style={{ "--project-accent": project.accentColor } as React.CSSProperties}>
      <div className="product-ui-bar">
        <span className="ui-mark"><Icon size={15} /></span>
        <span>{project.title}</span>
        <span className="ui-status">● online</span>
      </div>
      <div className="product-ui-body">
        <aside>
          {["Обзор", "Процесс", "Данные", "Команда"].map((item, index) => <span key={item} className={index === 0 ? "selected" : ""}>{item}</span>)}
        </aside>
        <div className="product-ui-main">
          <div className="ui-summary">
            <div><small>Фокус</small><strong>{project.tags[0]}</strong></div>
            <div><small>Статус</small><strong>{project.isConcept ? "Гипотеза" : "Live"}</strong></div>
            <div><small>Ценность</small><strong>Понятный процесс</strong></div>
          </div>
          <div className="ui-chart" aria-label="Демонстрационная схема динамики">
            {[38, 53, 44, 68, 62, 81, 72, 92].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}
          </div>
          <div className="ui-rows">
            {project.features.slice(0, 3).map((feature, index) => (
              <div key={feature.title}><CheckCircle2 size={14} /><span>{feature.title}</span><b>{index === 0 ? "В фокусе" : "Спроектировано"}</b></div>
            ))}
          </div>
        </div>
      </div>
      <ChartNoAxesCombined className="ui-watermark" aria-hidden />
    </div>
  );
}
