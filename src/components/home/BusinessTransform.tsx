"use client";

import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

const outcomes = [
  "повысить доверие и увеличить конверсию обращений",
  "сократить ручную работу операционной команды",
  "проверить новую бизнес-модель на реальных пользователях",
];

export function BusinessTransform() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  return (
    <div className="transform-tool">
      <button className="transform-request" onClick={() => setActive((active + 1) % outcomes.length)}>
        <span>Входной запрос</span>
        <strong>«Нам нужен сайт»</strong>
        <small>Нажмите, чтобы уточнить</small>
      </button>
      <ArrowRight className="transform-arrow" aria-hidden />
      <motion.div key={active} className="transform-result" initial={reduced ? false : { opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
        <span>Реальная задача</span>
        <strong>«Нам нужно {outcomes[active]}»</strong>
      </motion.div>
    </div>
  );
}
