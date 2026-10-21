export const homeCopy = {
  services: "Что я делаю",
  servicesLead: "От идеи - к тому, чем пользуются.",
  servicesNote: "Разработка и обучение",
  demos: "Попробуйте сами",
  demosLead: "Сайт можно посмотреть. Продукт - попробовать.",
  cta: "Есть идея?\nДавайте сделаем.",
  ctaLead: "Сайт, бот, Mini App или AI для вашей команды.",
};

export const playgroundProjects = [
  {
    id: "mini-apps",
    brand: "mola®",
    kind: "Mini App кофейни",
    lead: "Соберите заказ, выберите время и приготовьте кофе на экране бариста.",
    href: "/services/mini-apps/",
  },
  {
    id: "bots",
    brand: "PITSTOP",
    kind: "Бот автосервиса",
    lead: "Запишитесь на обслуживание и подтвердите заявку у администратора.",
    href: "/services/bots/",
  },
  {
    id: "websites",
    brand: "FORMA",
    kind: "Сайт студии интерьеров",
    lead: "Исследуйте проекты, откройте детали и соберите бриф на свой интерьер.",
    href: "/services/websites/",
  },
  {
    id: "automation",
    brand: "flowdesk",
    kind: "Автоматизация заявки",
    lead: "Отправьте сообщение, проверьте расчёт и согласуйте заявку в CRM.",
    href: "/services/automation/",
  },
  {
    id: "training",
    brand: "AI Workshop",
    kind: "Конструктор тренинга",
    lead: "Выберите задачи команды и соберите программу практического обучения.",
    href: "/training/",
  },
] as const;

/** Обо мне коротко (SPEC.md §7 главная, п. 5–7). Только подтверждённые факты. TODO(ilyas): фото. */
export const homeAbout = {
  name: "Ильяс Азелханов",
  lead: "Алматы. Делаю продукты и учу команды ими пользоваться.",
  handle: "В соцсетях - Elazart",
  more: "Обо мне",
  product: "@elazart_bot - мой обучающий бот по ИИ",
  productNote: "собственный продукт",
};
