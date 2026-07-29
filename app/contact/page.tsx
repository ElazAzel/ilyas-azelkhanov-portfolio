import type { Metadata } from "next";
import { ContactForm } from "@/src/components/contact/ContactForm";

export const metadata: Metadata = { title: "Контакты", description: "Расскажите о бизнесе, текущей проблеме и желаемом результате.", alternates: { canonical: "/contact" } };

export default function ContactPage() {
  return (
    <section className="page-section">
      <div className="shell contact-layout">
        <div className="page-hero contact-intro">
          <p className="eyebrow">/ КОНТАКТЫ</p>
          <h1>Расскажите, какую задачу должен решить ваш цифровой продукт.</h1>
          <p>Не обязательно заранее знать формат решения. Опишите бизнес, текущую ситуацию и желаемый результат.</p>
          <div className="contact-steps"><span>01 — Контекст</span><span>02 — Диагностика</span><span>03 — Следующий шаг</span></div>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
