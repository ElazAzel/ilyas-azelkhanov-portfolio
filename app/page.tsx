import Link from "next/link";
import { ArrowDownRight, ArrowRight, MoveRight } from "lucide-react";
import { HeroSystem } from "@/src/components/home/HeroSystem";
import { BusinessTransform } from "@/src/components/home/BusinessTransform";
import { Reveal } from "@/src/components/motion/Reveal";
import { ProjectCard } from "@/src/components/projects/ProjectCard";
import { featuredProjects } from "@/src/data/projects";
import { processSteps, services } from "@/src/data/site";

export default function HomePage() {
  return (
    <>
      <section className="hero section">
        <div className="hero-texture" aria-hidden />
        <div className="shell hero-grid">
          <div className="hero-copy">
            <Reveal><p className="eyebrow">/ 01 — ГЛАВНАЯ</p></Reveal>
            <Reveal delay={0.05}><h1>Проектирую цифровые продукты, которые решают задачи бизнеса.</h1></Reveal>
            <Reveal delay={0.1}><p className="hero-lead">Изучаю бизнес, пользователей и процессы, а затем создаю сайты и веб-сервисы, которые помогают продавать, автоматизировать работу и запускать новые продукты.</p></Reveal>
            <Reveal delay={0.15}><p className="hero-discipline">Исследование <span>→</span> Стратегия <span>→</span> UX/UI <span>→</span> Разработка <span>→</span> Запуск</p></Reveal>
            <Reveal className="hero-actions" delay={0.2}>
              <Link className="button" href="/contact">Обсудить задачу <ArrowDownRight /></Link>
              <Link className="button button-ghost" href="/projects">Смотреть проекты <ArrowRight /></Link>
            </Reveal>
          </div>
          <Reveal className="hero-system-wrap" delay={0.12}><HeroSystem /></Reveal>
          <div className="hero-aside">
            <span>Ильяс Азелханов</span>
            <span>Digital Product Designer<br />& Web Service Expert</span>
            <span>Доступен для новых проектов</span>
          </div>
        </div>
      </section>

      <section className="section section-bordered">
        <div className="shell">
          <Reveal className="section-heading split-heading">
            <div><p className="eyebrow">/ 02 — ДИАГНОСТИКА</p><h2>Сайт начинается<br />не с дизайна.</h2></div>
            <p>Большинство бизнесов приходят с запросом «нам нужен сайт». Но сайт сам по себе редко является настоящей целью. Моя задача — найти проблему и спроектировать решение, которое действительно изменит процесс.</p>
          </Reveal>
          <Reveal><BusinessTransform /></Reveal>
          <div className="problem-list">
            {["Увеличить заявки", "Объяснить сложный продукт", "Автоматизировать процесс", "Проверить бизнес-модель", "Повысить доверие", "Сократить ручную работу"].map((item, index) => (
              <Reveal key={item} delay={index * 0.04}><span>0{index + 1}</span><p>{item}</p><MoveRight /></Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-bordered">
        <div className="shell">
          <div className="section-heading heading-row">
            <div><p className="eyebrow">/ 03 — ИЗБРАННЫЕ ПРОЕКТЫ</p><h2>Разные продукты.<br />Единый подход.</h2></div>
            <Link className="text-link" href="/projects">Все 20 проектов <ArrowRight /></Link>
          </div>
          <div className="featured-projects">{featuredProjects.map((project, index) => <Reveal key={project.slug}><ProjectCard project={project} index={index} view="list" /></Reveal>)}</div>
        </div>
      </section>

      <section className="section section-bordered">
        <div className="shell">
          <div className="section-heading"><p className="eyebrow">/ 04 — КОМПЕТЕНЦИИ</p><h2>От гипотезы<br />до работающего продукта.</h2></div>
          <div className="services-grid">
            {services.map((service) => (
              <Reveal key={service.number} className="service-card">
                <span>{service.number}</span><h3>{service.title}</h3>
                <ul>{service.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-bordered">
        <div className="shell process-section">
          <div className="section-heading split-heading">
            <div><p className="eyebrow">/ 05 — ПРОЦЕСС</p><h2>Шесть шагов.<br />Ни одного лишнего.</h2></div>
            <p>Каждый этап уменьшает неопределённость. Интерфейс появляется только после того, как понятны проблема, пользователь и критерии результата.</p>
          </div>
          <ol className="process-list">
            {processSteps.map(([number, title, text]) => <Reveal key={number}><li><span>{number}</span><h3>{title}</h3><p>{text}</p><ArrowDownRight /></li></Reveal>)}
          </ol>
        </div>
      </section>

      <section className="section section-bordered">
        <div className="shell competency">
          <div className="section-heading"><p className="eyebrow">/ 06 — СИСТЕМА</p><h2>Компетенции работают<br />не по отдельности.</h2></div>
          <div className="competency-matrix">
            {[
              ["Business", "Исследование · стратегия · бизнес-модель"],
              ["Product", "MVP · сценарии · приоритизация"],
              ["Design", "UX · UI · дизайн-система · бренд"],
              ["Technology", "Web · AI · интеграции · автоматизация"],
              ["Launch", "Аналитика · тестирование · развитие"],
            ].map(([title, items], index) => <Reveal key={title} delay={index * 0.05}><span>0{index + 1}</span><h3>{title}</h3><p>{items}</p><i style={{ width: `${70 + index * 6}%` }} /></Reveal>)}
          </div>
        </div>
      </section>

      <section className="section section-bordered">
        <div className="shell about-preview">
          <p className="eyebrow">/ 07 — ОБО МНЕ</p>
          <Reveal><h2>Я соединяю продуктовый подход, бизнес-анализ, дизайн и разработку.</h2></Reveal>
          <div className="about-columns">
            <p>Мне важно не просто собрать интерфейс, а понять, зачем он нужен, кто будет им пользоваться и какой результат должен получить заказчик.</p>
            <ul>{["Сначала проблема, потом интерфейс", "Сценарий до функций", "Каждая функция имеет смысл", "Дизайн объясняет продукт", "Запуск — начало развития"].map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <Link className="text-link" href="/about">Подробнее обо мне <ArrowRight /></Link>
        </div>
      </section>
    </>
  );
}
