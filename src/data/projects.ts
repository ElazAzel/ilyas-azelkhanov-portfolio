import type { Project, ProjectCategory } from "@/src/lib/types";

type Seed = {
  slug: string;
  title: string;
  descriptor: string;
  category: ProjectCategory;
  industry: string;
  accentColor: string;
  problem: string;
  value: string;
  insight: string;
  features: [string, string][];
  tags: string[];
  real?: boolean;
  featured?: boolean;
  liveUrl?: string;
};

const audiences: Record<ProjectCategory, string[]> = {
  "SaaS и бизнес-системы": ["Операционная команда", "Руководители", "Администраторы"],
  "AI и автоматизация": ["Специалисты", "Руководители функций", "Операторы"],
  "EdTech и сообщества": ["Участники", "Наставники", "Координаторы"],
  Маркетплейсы: ["Покупатели", "Поставщики", "Менеджеры"],
  "События и геймификация": ["Участники", "Организаторы", "Партнёры"],
  "Корпоративные платформы": ["Клиенты", "Сотрудники", "Стейкхолдеры"],
};

function build(seed: Seed): Project {
  const isConcept = !seed.real;
  return {
    slug: seed.slug,
    title: seed.title,
    descriptor: seed.descriptor,
    category: seed.category,
    tags: seed.tags,
    year: "2026",
    industry: seed.industry,
    projectType: seed.real ? "Реальный продукт" : "Концепция цифрового продукта",
    isConcept,
    featured: Boolean(seed.featured),
    accentColor: seed.accentColor,
    summary: `${seed.descriptor}. Решение связывает пользовательский сценарий, бизнес-логику и технологическую реализацию.`,
    businessProblem: seed.problem,
    businessValue: seed.value,
    clientContext: `В текущем процессе информация и действия распределены между людьми и инструментами. ${seed.problem}`,
    goals: [
      "Собрать критический процесс в один понятный сценарий.",
      "Снизить количество ручных действий и точек потери данных.",
      "Определить критерии успеха и основу для развития продукта.",
    ],
    research: [
      { title: "Контекст бизнеса", description: "Разбор процесса, ролей, ограничений и точек принятия решений." },
      { title: "Пользователь", description: "Сценарии, мотивация, барьеры и частота ключевых действий." },
      { title: "Система", description: "Карта данных, зависимостей и рисков внедрения." },
    ],
    keyInsight: seed.insight,
    strategy: [
      "Сфокусировать MVP на одном критическом пользовательском пути.",
      "Сделать ценность заметной в первые минуты использования.",
      "Измерять изменение рабочего процесса, а не количество функций.",
    ],
    targetAudience: audiences[seed.category],
    userFlow: ["Входной сигнал", "Диагностика", "Ключевое действие", "Проверка результата", "Следующий шаг"],
    features: seed.features.map(([title, description]) => ({
      title,
      description,
      value: `Решает часть основной проблемы: ${seed.problem.toLowerCase()}`,
    })),
    branding: {
      personality: ["Ясный", "Системный", "Спокойный"],
      colors: [seed.accentColor, "#090A0C", "#F5F5F2"],
      typography: "Geist Sans + Geist Mono",
      principles: ["Сначала смысл", "Один экран — одна задача", "Состояния объясняют систему"],
    },
    technology: ["Next.js", "TypeScript", "React", "Интеграционная архитектура", "Продуктовая аналитика"],
    deliverables: ["Исследование", "Гипотеза", "UX-архитектура", "UI-система", "Рабочий прототип"],
    expectedImpact: isConcept
      ? [
          { label: "Ручная работа", value: "↓", description: "Целевой показатель после проверки гипотезы." },
          { label: "Прозрачность", value: "↑", description: "Предполагаемый эффект единого процесса." },
          { label: "Скорость", value: "↑", description: "Прогнозируемый результат, требующий валидации." },
        ]
      : undefined,
    verifiedResults: seed.real
      ? [
          { label: "Статус", value: "Live", description: "Работающий публичный продукт." },
          { label: "Контур", value: "Full-cycle", description: "Концепция, UX/UI и разработка собраны в одной системе." },
        ]
      : undefined,
    liveUrl: seed.liveUrl,
  };
}

const seeds: Seed[] = [
  {
    slug: "linkmax", title: "LinkMAX", descriptor: "Платформа персонального цифрового профиля",
    category: "SaaS и бизнес-системы", industry: "Creator economy", accentColor: "#6C5CFF",
    problem: "Обычная страница со ссылками не раскрывает профессиональную ценность специалиста.",
    value: "Единая точка входа, управление контентом и основа персонального бренда.",
    insight: "Пользователю нужна не коллекция ссылок, а управляемый цифровой профиль.",
    features: [["Профиль", "Модульная персональная страница."], ["Контент", "Единое управление материалами."], ["Аналитика", "Сигналы интереса аудитории."]],
    tags: ["Product", "UX/UI", "Development", "SaaS"], real: true, featured: true, liveUrl: "https://lnkmx.my",
  },
  {
    slug: "tusa-game", title: "TUSA Game", descriptor: "Игровая платформа для командных мероприятий",
    category: "События и геймификация", industry: "Events", accentColor: "#C8FF46",
    problem: "Бумажные задания и чаты лишают организатора контроля над ходом игры.",
    value: "Единая система проведения, автоматический прогресс и масштабируемая механика.",
    insight: "Организатору нужен контроль, а участнику — ощущение цельной игры.",
    features: [["Команды", "Роли и общий прогресс."], ["Задания", "Управляемая игровая последовательность."], ["Панель игры", "Состояния и результаты в одном месте."]],
    tags: ["Game UX", "Roles", "Realtime", "Development"], real: true, featured: true, liveUrl: "https://tusagame.vercel.app",
  },
  {
    slug: "orbit-crm", title: "Orbit CRM", descriptor: "CRM для небольших логистических компаний",
    category: "SaaS и бизнес-системы", industry: "Logistics", accentColor: "#4387FF",
    problem: "Заявки из мессенджеров, телефона и сайта теряются при ручном переносе.",
    value: "Быстрый первый ответ, единая база и прозрачность продаж.",
    insight: "Менеджерам нужен самый быстрый способ сохранить заявку из мессенджера.",
    features: [["Входящие", "Объединённая лента заявок."], ["Воронка", "Простой процесс сделки."], ["Расчёт", "Быстрая оценка доставки."]],
    tags: ["Research", "CRM", "Dashboard", "MVP"],
  },
  {
    slug: "shiftflow", title: "ShiftFlow", descriptor: "Система управления сменами для ресторанных сетей",
    category: "SaaS и бизнес-системы", industry: "HoReCa", accentColor: "#FF6B57",
    problem: "Изменения в Excel и чатах теряются, создавая пересечения и ошибки.",
    value: "Меньше конфликтов, прозрачное расписание и снижение ручной работы.",
    insight: "Сотрудники редко открывают административные системы, но постоянно используют телефон.",
    features: [["Календарь", "Смены и доступность на одном экране."], ["Обмен", "Согласованный обмен сменами."], ["Конфликты", "Автоматические предупреждения."]],
    tags: ["Mobile UX", "Scheduling", "Automation"], featured: true,
  },
  {
    slug: "field-os", title: "Field OS", descriptor: "Платформа управления выездными специалистами",
    category: "SaaS и бизнес-системы", industry: "Field service", accentColor: "#00C2A8",
    problem: "Диспетчер не видит загрузку специалистов и реальный статус работ.",
    value: "Прозрачность исполнения, контроль качества и меньше повторных выездов.",
    insight: "Статус должен появляться как часть работы, а не отдельный отчёт.",
    features: [["Диспетчеризация", "Карта и загрузка команды."], ["Чек-лист", "Пошаговое выполнение на месте."], ["SLA", "Контроль сроков и отклонений."]],
    tags: ["Operations", "Map", "Mobile", "SLA"],
  },
  {
    slug: "tendermind", title: "TenderMind", descriptor: "AI-сервис анализа тендерной документации",
    category: "AI и автоматизация", industry: "Procurement", accentColor: "#9A7BFF",
    problem: "Компании тратят часы на документы и всё равно пропускают требования.",
    value: "Быстрый отбор возможностей и снижение ошибок в подготовке.",
    insight: "Нужен не пересказ документа, а решение и проверяемый список действий.",
    features: [["Разбор", "Требования со ссылками на источники."], ["Риски", "Препятствия и пробелы заявки."], ["План", "Сроки и пакет документов."]],
    tags: ["AI", "Documents", "Evidence", "Risk"], featured: true,
  },
  {
    slug: "supportpilot", title: "SupportPilot", descriptor: "AI-ассистент службы поддержки",
    category: "AI и автоматизация", industry: "E-commerce", accentColor: "#43B8FF",
    problem: "Операторы тратят большую часть смены на одинаковые вопросы.",
    value: "Быстрее ответы, единый стандарт и видимость причин обращений.",
    insight: "AI должен показывать источник и уверенность, а сложные случаи передавать человеку.",
    features: [["Черновик", "Ответ на основе базы знаний."], ["Источник", "Цитата и оценка уверенности."], ["Маршрут", "Определение темы и сложности."]],
    tags: ["AI", "Support", "Knowledge base"],
  },
  {
    slug: "briefly", title: "Briefly", descriptor: "AI-платформа маркетинговых брифов",
    category: "AI и автоматизация", industry: "Professional services", accentColor: "#FFB443",
    problem: "Команда начинает работу без общего контекста и обнаруживает пробелы слишком поздно.",
    value: "Быстрый старт, меньше недопонимания и единая структура работы.",
    insight: "Хороший бриф не заполняется — он последовательно уточняется.",
    features: [["Сбор", "Единый вход для материалов."], ["Пробелы", "Генерация уточняющих вопросов."], ["Документ", "Структура проекта и экспорт."]],
    tags: ["AI", "Brief", "Workflow", "Export"],
  },
  {
    slug: "skillspring", title: "SkillSpring", descriptor: "Корпоративная академия развития сотрудников",
    category: "EdTech и сообщества", industry: "Corporate learning", accentColor: "#C8FF46",
    problem: "Компания проводит обучение, но не видит, какие навыки реально развиваются.",
    value: "Прозрачность развития, персонализация и связь обучения с бизнес-задачами.",
    insight: "Прогресс — это изменение навыка, а не количество просмотренных уроков.",
    features: [["Карта навыков", "Профиль компетенций."], ["Траектория", "Следующий полезный шаг."], ["Практика", "Задания и обратная связь."]],
    tags: ["EdTech", "Skills", "Analytics", "Journey"], featured: true,
  },
  {
    slug: "mentorloop", title: "MentorLoop", descriptor: "Платформа корпоративного наставничества",
    category: "EdTech и сообщества", industry: "HR Tech", accentColor: "#FF6F91",
    problem: "Ручное распределение пар не учитывает цели и не показывает динамику.",
    value: "Качественнее matching, меньше координации и прозрачный прогресс.",
    insight: "Совпадение интересов важно, но рабочая цель пары важнее.",
    features: [["Matching", "Подбор по целям и опыту."], ["Сессия", "Структура встречи."], ["Прогресс", "Динамика целей."]],
    tags: ["Matching", "Goals", "Community"],
  },
  {
    slug: "labquest", title: "LabQuest", descriptor: "Игровая платформа проектного обучения",
    category: "EdTech и сообщества", industry: "School education", accentColor: "#00D7C0",
    problem: "Лекции о технологиях редко превращаются в завершённый практический проект.",
    value: "Выше вовлечение, командная работа и видимый результат обучения.",
    insight: "Финальная защита должна ощущаться частью сюжета, а не отдельным экзаменом.",
    features: [["Миссии", "Пошаговые сюжетные задания."], ["Команда", "Роли и общая цель."], ["Защита", "Финальный маршрут проекта."]],
    tags: ["Game Learning", "Teams", "Progress"],
  },
  {
    slug: "agrolink", title: "AgroLink", descriptor: "B2B-платформа закупки сельхозпродукции",
    category: "Маркетплейсы", industry: "Agriculture", accentColor: "#84D65A",
    problem: "Звонки и договорённости скрывают наличие и делают спрос непредсказуемым.",
    value: "Прозрачность закупок, быстрее согласование и шире рынок для производителей.",
    insight: "В B2B важнее не корзина, а уверенность в условиях и регулярности поставки.",
    features: [["Предложения", "Наличие и условия поставщиков."], ["Запрос", "Единый сценарий согласования."], ["Повтор", "Регулярные закупки."]],
    tags: ["B2B", "Marketplace", "Procurement"],
  },
  {
    slug: "localcraft", title: "LocalCraft", descriptor: "Маркетплейс локальных авторов",
    category: "Маркетплейсы", industry: "Creative economy", accentColor: "#E58B5B",
    problem: "В социальных сетях товар виден, но его происхождение и ценность теряются.",
    value: "Больше доверия, выше воспринимаемая ценность и единая площадка продаж.",
    insight: "История происхождения — функциональная часть карточки товара.",
    features: [["Каталог", "Кураторские подборки."], ["История", "Контекст автора и изделия."], ["Витрина", "Персональная страница мастера."]],
    tags: ["Commerce", "Editorial", "Community"],
  },
  {
    slug: "fleetparts", title: "FleetParts", descriptor: "B2B-портал закупки автозапчастей",
    category: "Маркетплейсы", industry: "Fleet management", accentColor: "#5AA8FF",
    problem: "Закупщик тратит часы на поиск совместимых деталей у разных поставщиков.",
    value: "Быстрее закупка, меньше ошибок и прозрачный контроль расходов.",
    insight: "Ошибка совместимости дороже, чем разница в цене.",
    features: [["VIN", "Проверка совместимости."], ["Сравнение", "Условия поставщиков рядом."], ["Согласование", "Контур одобрения закупки."]],
    tags: ["B2B", "VIN", "Comparison", "Budget"],
  },
  {
    slug: "summitpass", title: "SummitPass", descriptor: "Цифровая платформа деловой конференции",
    category: "События и геймификация", industry: "Business events", accentColor: "#FFB443",
    problem: "PDF, ссылки и чаты дробят опыт мероприятия на несколько сервисов.",
    value: "Выше активность участников, меньше нагрузка и полезные данные для организатора.",
    insight: "Цифровой сервис должен сопровождать событие, а не дублировать программу.",
    features: [["Программа", "Персональный маршрут."], ["Встречи", "Networking по интересам."], ["QR", "Быстрая регистрация."]],
    tags: ["Events", "Networking", "Schedule", "QR"], featured: true,
  },
  {
    slug: "cityquest", title: "CityQuest", descriptor: "Городская игровая платформа",
    category: "События и геймификация", industry: "Brand experience", accentColor: "#FF5D73",
    problem: "Обычные рекламные активности дают низкое и кратковременное вовлечение.",
    value: "Эмоциональный контакт, пользовательский контент и масштабируемая механика.",
    insight: "Открытие нового места создаёт впечатление сильнее, чем сама награда.",
    features: [["Карта", "Маршрут по точкам."], ["Миссии", "Задания и доказательства."], ["Команды", "Общий прогресс."]],
    tags: ["Map", "Missions", "UGC", "Game"],
  },
  {
    slug: "pitcharena", title: "PitchArena", descriptor: "Платформа стартап-конкурсов",
    category: "События и геймификация", industry: "Innovation programs", accentColor: "#A880FF",
    problem: "Формы и таблицы делают отбор непрозрачным и требуют ручной координации.",
    value: "Прозрачное судейство, автоматизация и удобство для участников.",
    insight: "Эксперту нужна не таблица критериев, а ясный контекст решения.",
    features: [["Заявка", "Проверка комплектности."], ["Оценка", "Критерии и комментарии."], ["Рейтинг", "Свод результатов."]],
    tags: ["Applications", "Scoring", "Workflow"],
  },
  {
    slug: "northline-studio", title: "Northline Studio", descriptor: "Сайт архитектурного бюро",
    category: "Корпоративные платформы", industry: "Architecture", accentColor: "#D8D0C2",
    problem: "Галерея изображений не раскрывает подход и причины высокой стоимости.",
    value: "Больше доверия, качественнее заявки и сильное позиционирование.",
    insight: "Архитектурный кейс должен показывать решения, а не только итоговые фотографии.",
    features: [["Кейсы", "История проектных решений."], ["Процесс", "Этапы и компромиссы."], ["Заявка", "Квалификация задачи."]],
    tags: ["Positioning", "Editorial", "Cases", "Web"],
  },
  {
    slug: "medroute", title: "MedRoute", descriptor: "Сервисный сайт с маршрутом пациента",
    category: "Корпоративные платформы", industry: "Healthcare", accentColor: "#58C6B5",
    problem: "Список врачей не помогает человеку понять, к кому и зачем записываться.",
    value: "Понятнее клиентский путь, меньше нагрузки на call-центр и выше доверие.",
    insight: "Сервис строится вокруг ситуации пациента, а не структуры клиники.",
    features: [["Ситуация", "Выбор по запросу без обещаний."], ["Подготовка", "Понятные инструкции."], ["Запись", "Следующий безопасный шаг."]],
    tags: ["Service Design", "Accessibility", "Routing"],
  },
  {
    slug: "greengrid", title: "GreenGrid", descriptor: "Корпоративная ESG-платформа",
    category: "Корпоративные платформы", industry: "Energy", accentColor: "#78C98C",
    problem: "Официальные формулировки мешают аудиториям быстро понять сложный бизнес.",
    value: "Прозрачная коммуникация, доверие стейкхолдеров и единая система информации.",
    insight: "Один сайт должен давать разные короткие маршруты, а не один длинный рассказ.",
    features: [["Маршруты", "Входы для разных аудиторий."], ["Карта", "Проекты и контекст регионов."], ["Данные", "Документы и показатели."]],
    tags: ["ESG", "Data", "Stakeholders", "Content"],
  },
];

export const projects = seeds.map(build);
export const featuredProjects = projects.filter((project) => project.featured);
export const getProject = (slug: string) => projects.find((project) => project.slug === slug);
export const getNextProject = (slug: string) => {
  const index = projects.findIndex((project) => project.slug === slug);
  return projects[(index + 1) % projects.length];
};
