"use client";

import { ArrowDown, Boxes, Braces, Search, Target, Workflow } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

const nodes = [
  [Search, "Исследование", "Контекст и пользователи"],
  [Target, "Стратегия", "Гипотеза и критерии"],
  [Workflow, "UX / UI", "Сценарий и интерфейс"],
  [Braces, "Разработка", "Работающий продукт"],
  [Boxes, "Результат", "Изменение процесса"],
] as const;

export function HeroSystem() {
  const reduced = useReducedMotion();
  return (
    <div className="hero-system" aria-label="Путь от исследования к бизнес-результату">
      {nodes.map(([Icon, title, text], index) => (
        <motion.div
          key={title}
          className="system-node"
          initial={reduced ? false : { opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 + index * 0.1 }}
        >
          <span className="node-number">0{index + 1}</span>
          <Icon aria-hidden />
          <div><strong>{title}</strong><small>{text}</small></div>
          {index < nodes.length - 1 && <ArrowDown className="node-arrow" aria-hidden />}
        </motion.div>
      ))}
    </div>
  );
}
