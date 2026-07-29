import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/src/components/motion/Reveal";

export const metadata: Metadata = { title: "Обо мне", description: "Ильяс Азелханов — продуктовый дизайнер и разработчик веб-сервисов для бизнеса.", alternates: { canonical: "/about" } };

export default function AboutPage() {
  const timeline = [
    ["01", "Бизнес-анализ", "Научился начинать проект с контекста, процессов и ограничений."],
    ["02", "UX и продукт", "Перевёл исследования в сценарии, архитектуру и критерии продукта."],
    ["03", "Визуальные системы", "Соединил смысл, типографику и интерфейсную дисциплину."],
    ["04", "Разработка", "Замкнул путь от гипотезы до работающего веб-продукта."],
    ["05", "AI и автоматизация", "Добавил новые способы сокращать ручную работу и работать с данными."],
  ];
  return (
    <section className="page-section">
      <div className="shell">
        <div className="page-hero"><p className="eyebrow">/ ОБО МНЕ</p><h1>Продуктовое мышление.<br />Дизайн. Код.</h1><p>Меня зовут Ильяс Азелханов. Я создаю сайты и веб-сервисы для бизнеса, соединяя продуктовый подход, UX/UI-дизайн и разработку.</p></div>
        <div className="about-manifesto">
          <Reveal><h2>Не начинаю с выбора цвета кнопок.</h2></Reveal>
          <Reveal><div><p>Сначала я изучаю задачу, аудиторию, процессы и ограничения. Только после этого формирую структуру решения и перехожу к дизайну и разработке.</p><p>Мне интересны проекты, где интерфейс является частью более крупного бизнес-решения: автоматизирует процесс, запускает продукт, привлекает клиентов или организует сообщество.</p></div></Reveal>
        </div>
        <div className="section-heading"><p className="eyebrow">РАЗВИТИЕ КОМПЕТЕНЦИЙ</p><h2>Специализация росла<br />вокруг одной задачи.</h2></div>
        <div className="timeline">{timeline.map(([number, title, text]) => <Reveal key={number}><article><span>{number}</span><h3>{title}</h3><p>{text}</p></article></Reveal>)}</div>
        <div className="principles-grid">
          {["Сначала проблема", "Сценарий до функций", "Смысл до декора", "Технология упрощает", "Запуск начинает развитие", "Данные проверяют гипотезу"].map((item, index) => <Reveal key={item}><div><span>0{index + 1}</span><h3>{item}</h3></div></Reveal>)}
        </div>
        <Link className="button" href="/contact">Обсудить задачу <ArrowRight /></Link>
      </div>
    </section>
  );
}
