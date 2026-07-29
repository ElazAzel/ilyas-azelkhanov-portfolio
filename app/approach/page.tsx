import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/src/components/motion/Reveal";
import { processSteps } from "@/src/data/site";

export const metadata: Metadata = { title: "Подход", description: "Как бизнес-запрос превращается в проверяемое цифровое решение.", alternates: { canonical: "/approach" } };

export default function ApproachPage() {
  const flow = ["Запрос", "Бизнес-контекст", "Проблема", "Пользователь", "Гипотеза", "MVP", "Интерфейс", "Разработка", "Измерение"];
  return (
    <section className="page-section">
      <div className="shell">
        <div className="page-hero"><p className="eyebrow">/ ПОДХОД</p><h1>Сначала понять задачу.<br />Потом выбирать решение.</h1><p>Сайт, CRM или AI — это форма. Работа начинается с того, что именно должно измениться в бизнесе и поведении пользователя.</p></div>
        <div className="request-diagnosis">
          <Reveal><p className="eyebrow">ЧТО ОБЫЧНО ПРОСЯТ</p><div className="word-stack">{["Сайт", "Лендинг", "CRM", "Редизайн", "Автоматизацию"].map((item) => <span key={item}>{item}</span>)}</div></Reveal>
          <Reveal><p className="eyebrow">ЧТО НУЖНО ВЫЯСНИТЬ</p><ol>{["Где возникают потери?", "Кто пользователь?", "Какое действие критично?", "Почему процесс не работает?", "Как измерить результат?"].map((item, index) => <li key={item}><span>0{index + 1}</span>{item}</li>)}</ol></Reveal>
        </div>
        <div className="approach-flow">{flow.map((item, index) => <Reveal key={item} delay={index * 0.03}><span>0{index + 1}</span><strong>{item}</strong>{index < flow.length - 1 && <ArrowRight />}</Reveal>)}</div>
        <div className="section-heading"><p className="eyebrow">ПРОЦЕСС</p><h2>Каждый этап<br />уменьшает риск.</h2></div>
        <div className="approach-steps">{processSteps.map(([number, title, text]) => <Reveal key={number}><article><span>{number}</span><h3>{title}</h3><p>{text}</p></article></Reveal>)}</div>
        <Reveal className="value-panel"><p className="eyebrow">ЧТО ПОЛУЧАЕТ ЗАКАЗЧИК</p><h2>Не набор экранов, а понятную логику продукта, приоритеты, архитектуру и работающий инструмент.</h2></Reveal>
      </div>
    </section>
  );
}
