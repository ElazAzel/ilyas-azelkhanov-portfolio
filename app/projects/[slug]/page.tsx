import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { ScrollProgress } from "@/src/components/case/ScrollProgress";
import { ProjectVisual } from "@/src/components/projects/ProjectVisual";
import { Reveal } from "@/src/components/motion/Reveal";
import { getNextProject, getProject, projects } from "@/src/data/projects";
import { siteConfig } from "@/src/data/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: { title: `${project.title} — кейс`, description: project.summary, type: "article" },
  };
}

export default async function ProjectPage({ params }: Props) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const nextProject = getNextProject(project.slug);
  const results = project.verifiedResults ?? project.expectedImpact ?? [];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": project.liveUrl ? "SoftwareApplication" : "CreativeWork",
    name: project.title,
    description: project.summary,
    author: { "@type": "Person", name: siteConfig.name },
    url: `${siteConfig.url}/projects/${project.slug}`,
    isAccessibleForFree: true,
  };

  return (
    <article className="case-page" style={{ "--project-accent": project.accentColor } as React.CSSProperties}>
      <ScrollProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="shell case-topline"><Link href="/projects"><ArrowLeft /> Все проекты</Link><span>{project.category}</span></div>
      <header className="shell case-hero">
        <div className="case-title">
          <div className="project-meta">
            <span className={project.isConcept ? "badge concept" : "badge real"}>{project.isConcept ? "Концептуальный кейс" : "Реальный проект"}</span>
            <span>{project.year}</span>
          </div>
          <h1>{project.title}</h1>
          <p>{project.descriptor}</p>
          {project.liveUrl && <a className="button button-ghost" href={project.liveUrl} target="_blank" rel="noreferrer">Открыть продукт <ArrowUpRight /></a>}
        </div>
        <div className="case-facts">
          <div><span>Роль</span><strong>Product · UX/UI · Development</strong></div>
          <div><span>Индустрия</span><strong>{project.industry}</strong></div>
          <div><span>Тип</span><strong>{project.projectType}</strong></div>
        </div>
        <ProjectVisual project={project} />
      </header>

      <nav className="case-nav shell" aria-label="Разделы кейса">
        {["Контекст", "Исследование", "Стратегия", "Функции", "Ценность", "Результат"].map((item) => <a key={item} href={`#${item.toLowerCase()}`}>{item}</a>)}
      </nav>

      <div className="shell case-content">
        <Reveal className="case-section" >
          <p className="eyebrow">01 — КОНТЕКСТ</p><div><h2 id="контекст">Ситуация бизнеса</h2><p className="large-copy">{project.clientContext}</p><div className="problem-panel"><span>Основная проблема</span><strong>{project.businessProblem}</strong></div></div>
        </Reveal>
        <Reveal className="case-section">
          <p className="eyebrow">02 — ЦЕЛИ</p><div><h2>Что должно измениться</h2><ol className="number-list">{project.goals.map((goal, index) => <li key={goal}><span>0{index + 1}</span>{goal}</li>)}</ol></div>
        </Reveal>
        <Reveal className="case-section">
          <p className="eyebrow">03 — ИССЛЕДОВАНИЕ</p><div><h2 id="исследование">Не рисовать раньше времени</h2><div className="research-grid">{project.research.map((item, index) => <div key={item.title}><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.description}</p></div>)}</div></div>
        </Reveal>
        <Reveal className="insight-panel"><p className="eyebrow">КЛЮЧЕВОЙ ИНСАЙТ</p><blockquote>«{project.keyInsight}»</blockquote></Reveal>
        <Reveal className="case-section">
          <p className="eyebrow">04 — СТРАТЕГИЯ</p><div><h2 id="стратегия">Решение и границы MVP</h2><ul className="strategy-list">{project.strategy.map((item) => <li key={item}><ArrowRight />{item}</li>)}</ul></div>
        </Reveal>
        <Reveal className="case-section">
          <p className="eyebrow">05 — АРХИТЕКТУРА</p><div><h2>Пользовательский сценарий</h2><div className="flow-diagram">{project.userFlow.map((item, index) => <div key={item}><span>0{index + 1}</span><strong>{item}</strong>{index < project.userFlow.length - 1 && <ArrowRight />}</div>)}</div></div>
        </Reveal>
        <Reveal className="case-section">
          <p className="eyebrow">06 — ФУНКЦИИ</p><div><h2 id="функции">Функция объясняется ценностью</h2><div className="feature-grid">{project.features.map((feature) => <div key={feature.title}><h3>{feature.title}</h3><p>{feature.description}</p><span>{feature.value}</span></div>)}</div></div>
        </Reveal>
        <Reveal className="case-section brand-section">
          <p className="eyebrow">07 — ВИЗУАЛЬНЫЙ ЯЗЫК</p><div><h2>Система, а не декор</h2><div className="brand-spec"><div>{project.branding.colors.map((color) => <i key={color} style={{ background: color }} title={color} />)}</div><p>{project.branding.typography}</p><ul>{project.branding.principles.map((item) => <li key={item}>{item}</li>)}</ul></div></div>
        </Reveal>
        <Reveal className="case-section">
          <p className="eyebrow">08 — ТЕХНОЛОГИЯ</p><div><h2>Реализация</h2><div className="tag-cloud">{project.technology.map((item) => <span key={item}>{item}</span>)}</div><p className="large-copy">Архитектура выбирается под сценарий, объём данных, интеграции и дальнейшее развитие — не ради демонстрации стека.</p></div>
        </Reveal>
        <Reveal className="value-panel">
          <p className="eyebrow">09 — ЦЕННОСТЬ ДЛЯ БИЗНЕСА</p><h2 id="ценность">{project.businessValue}</h2>
        </Reveal>
        <Reveal className="case-section">
          <p className="eyebrow">10 — РЕЗУЛЬТАТ</p><div><h2 id="результат">{project.isConcept ? "Целевые показатели" : "Подтверждённый статус"}</h2><div className="metric-grid">{results.map((metric) => <div key={metric.label}><span>{metric.label}</span><strong>{metric.value}</strong><p>{metric.description}</p></div>)}</div>{project.isConcept && <p className="concept-note">Это проектная гипотеза. Показатели не выдаются за фактические результаты клиентского проекта.</p>}</div>
        </Reveal>
        <Reveal className="case-section">
          <p className="eyebrow">11 — РЕФЛЕКСИЯ</p><div><h2>Что важно сохранить</h2><p className="large-copy">Главное продуктовое решение — удержать фокус на критическом сценарии. Основной компромисс — не переносить в MVP все исключения старого процесса. Следующий шаг — проверить гипотезу на реальном поведении и развивать систему по данным.</p></div>
        </Reveal>
      </div>
      <Link className="next-project" href={`/projects/${nextProject.slug}`}><span>Следующий проект</span><strong>{nextProject.title}</strong><ArrowRight /></Link>
    </article>
  );
}
