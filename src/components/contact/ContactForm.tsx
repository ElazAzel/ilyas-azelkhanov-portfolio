"use client";

import { CheckCircle2, Send } from "lucide-react";
import { FormEvent, useState } from "react";
import { siteConfig } from "@/src/data/site";

const projectTypes = ["Корпоративный сайт", "Лендинг", "Веб-сервис", "Личный кабинет", "SaaS", "MVP", "AI-интеграция", "Автоматизация", "Пока не определено"];

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    setStatus("sending");
    if (!siteConfig.formEndpoint) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setStatus("success");
      form.reset();
      return;
    }
    try {
      const response = await fetch(siteConfig.formEndpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error();
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="form-success" role="status">
        <CheckCircle2 />
        <h2>Заявка принята.</h2>
        <p>Следующий шаг — разобраться в контексте задачи, а не сразу считать количество страниц.</p>
        <button className="text-link" onClick={() => setStatus("idle")}>Отправить ещё одну заявку</button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <div className="form-grid">
        <label><span>Имя *</span><input name="name" required autoComplete="name" placeholder="Как к вам обращаться" /></label>
        <label><span>Компания</span><input name="company" autoComplete="organization" placeholder="Название или сфера" /></label>
        <label><span>Способ связи *</span><input name="contact" required placeholder="Email, Telegram или телефон" /></label>
        <label><span>Тип проекта</span><select name="projectType" defaultValue=""><option value="" disabled>Выберите вариант</option>{projectTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
        <label className="wide"><span>Кратко о бизнесе *</span><textarea name="business" required rows={3} placeholder="Что вы делаете и для кого" /></label>
        <label className="wide"><span>Текущая проблема *</span><textarea name="problem" required rows={3} placeholder="Где возникают потери, сложности или ручная работа" /></label>
        <label className="wide"><span>Желаемый результат *</span><textarea name="result" required rows={3} placeholder="Что должно измениться после запуска" /></label>
        <label><span>Примерный срок</span><select name="timeline" defaultValue=""><option value="">Пока не определён</option><option>До 1 месяца</option><option>1–3 месяца</option><option>3–6 месяцев</option></select></label>
        <label><span>Бюджетный диапазон</span><select name="budget" defaultValue=""><option value="">Предпочитаю обсудить</option><option>До $2 000</option><option>$2 000–5 000</option><option>$5 000–10 000</option><option>От $10 000</option></select></label>
      </div>
      {status === "error" && <p className="form-error" role="alert">Не удалось отправить форму. Проверьте соединение или используйте удобный способ связи.</p>}
      <button className="button" type="submit" disabled={status === "sending"}>{status === "sending" ? "Отправляю…" : "Отправить контекст"} <Send size={17} /></button>
      <p className="form-note">Контактные данные используются только для ответа на запрос.</p>
    </form>
  );
}
