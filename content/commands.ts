// Быстрый поиск по сайту (⌘K). Собирается из того же контента, что и страницы: цены - из pricing.ts.
import { formatPrice, packagesFor } from "./pricing";
import { services } from "./services";
import { playgroundProjects } from "./home";
import { contacts, telegramLink, whatsappLink } from "./contacts";

export type CommandAction = "copy-phone" | "toggle-sound";

export type Command = {
  id: string;
  group: "Действия" | "Услуги" | "Демо" | "Страницы";
  label: string;
  hint?: string;
  /** Extra words people may type: synonyms, transliterations. */
  keywords?: string;
  href?: string;
  external?: boolean;
  action?: CommandAction;
};

export const commandCopy = {
  placeholder: "Куда перейти или что сделать?",
  empty: "Ничего не нашлось. Напишите мне в WhatsApp.",
  open: "Поиск по сайту",
};

export const commands: Command[] = [
  { id: "wa", group: "Действия", label: "Написать в WhatsApp", hint: contacts.whatsapp.display, keywords: "ватсап вотсап whatsapp связаться написать", href: whatsappLink("Здравствуйте, Ильяс! Хочу обсудить задачу."), external: true },
  { id: "tg", group: "Действия", label: "Открыть Telegram", hint: contacts.telegram.display, keywords: "телеграм телега telegram", href: telegramLink(), external: true },
  { id: "brief", group: "Действия", label: "Оценить задачу", hint: "4 вопроса", keywords: "бриф цена стоимость сколько калькулятор", href: "/brief/" },
  { id: "copy", group: "Действия", label: "Скопировать номер", hint: contacts.whatsapp.display, keywords: "телефон номер копировать", action: "copy-phone" },
  { id: "sound", group: "Действия", label: "Звук интерфейса вкл/выкл", keywords: "звук sound mute тихо", action: "toggle-sound" },
  ...services.map<Command>((s) => ({
    id: `svc-${s.id}`,
    group: "Услуги",
    label: s.title,
    hint: formatPrice(packagesFor(s.id)[0]!),
    keywords: `${s.line} ${s.offer} цена`,
    href: s.href,
  })),
  ...playgroundProjects.map<Command>((p) => ({
    id: `demo-${p.id}`,
    group: "Демо",
    label: `${p.brand} - ${p.kind}`,
    hint: "демо",
    keywords: `${p.lead} попробовать пример`,
    href: p.href,
  })),
  { id: "home", group: "Страницы", label: "Главная", href: "/" },
  { id: "work", group: "Страницы", label: "Работы", keywords: "портфолио проекты продукты", href: "/work/" },
  { id: "about", group: "Страницы", label: "Обо мне", keywords: "ильяс азелханов", href: "/about/" },
  { id: "contact", group: "Страницы", label: "Контакты", keywords: "адрес почта связь", href: "/contact/" },
  { id: "offer", group: "Страницы", label: "Публичная оферта", keywords: "договор условия", href: "/offer/" },
  { id: "privacy", group: "Страницы", label: "Политика конфиденциальности", keywords: "данные пдн", href: "/privacy/" },
  { id: "llms", group: "Страницы", label: "Версия сайта для ИИ", hint: "llms.txt", keywords: "llms ai машина markdown", href: "/llms.txt", external: true },
];
