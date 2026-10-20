/** Cinematic hero on the home page: chapters shown over the 3D frame sequence while scrolling. */

export const heroFrames = {
  count: 96,
  /** Rendered offline from brand/logo-full.svg (three.js, 1920×1080 and 1080×1920). */
  landscape: "/media/cinematic/l/",
  portrait: "/media/cinematic/p/",
};

export const heroIntro = {
  title: "Сделаю и научу",
  lead: "Сайты, Telegram-боты и Mini Apps, AI-автоматизация процессов — и обучение команды, чтобы всё это работало.",
  hint: "Листайте вниз",
};

/** `at` — scroll progress 0…1 where the chapter is fully visible. */
export const heroChapters = [
  {
    at: 0.3,
    title: "Сайт, бот, Mini\u00a0App, автоматизация",
    text: "Делаю их одной системой, а не набором деталей от разных подрядчиков.",
  },
  {
    at: 0.54,
    title: "Всё связано между собой",
    text: "Заявка с сайта приходит в бота, из бота — в таблицу, менеджер сразу получает уведомление.",
  },
  {
    at: 0.76,
    title: "И учу команду этим пользоваться",
    text: "Тренинг по вашим процессам, а не общий курс — чтобы всё работало и после сдачи проекта.",
  },
] as const;

export const heroOutro = {
  title: "Расскажите, что нужно сделать",
};
