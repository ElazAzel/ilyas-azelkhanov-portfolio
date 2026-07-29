import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <p className="eyebrow">СЛЕДУЮЩИЙ ШАГ</p>
          <h2>Давайте разберёмся<br />в контексте задачи.</h2>
        </div>
        <div className="footer-action">
          <Link className="button" href="/contact">Обсудить проект <ArrowUpRight /></Link>
          <p>Не начинаю с количества страниц.<br />Начинаю с вопроса: что должно измениться?</p>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} Ильяс Азелханов</span>
        <span>Исследование → Стратегия → UX/UI → Разработка</span>
      </div>
    </footer>
  );
}
