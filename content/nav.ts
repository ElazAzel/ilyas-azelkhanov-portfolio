export const nav = [
  { href: "/#services", label: "Услуги" },
  { href: "/training/", label: "Тренинги" },
  { href: "/work/", label: "Работы" },
  { href: "/about/", label: "Обо мне" },
  { href: "/contact/", label: "Контакты" },
] as const;

/** Extra links in the mobile menu, after the services list. */
export const menuLinks = [
  { href: "/brief/", label: "Оценить задачу" },
  { href: "/work/", label: "Работы" },
  { href: "/about/", label: "Обо мне" },
  { href: "/contact/", label: "Контакты" },
] as const;
