# azelkhanov-site

Многостраничный сайт услуг Ильяса Азелханова (Алматы). Направления: сайты, Telegram Mini Apps, боты, AI-автоматизация, тренинги (корпоративные и личные). Сайт сам является демонстрацией уровня разработки. Бизнес-цель: заявка в WhatsApp или Telegram. RU основной язык; KK для цен/пакетов, политики ПДн, оферты, контактов (полный KK и EN в волне 2).

@SPEC.md
@DESIGN.md

## Стек (не менять без согласования)
- Next.js 16.4 (App Router, Turbopack, cacheComponents), React 19.3, TypeScript strict, pnpm
- `export const ensureStatic = 'navigation'` на маркетинговом layout: страницы только статические
- Tailwind CSS 4.3 + shadcn/ui (Base UI). Готовые анимированные блоки (Magic UI / Aceternity / React Bits / 21st): максимум 4 на сайт, всегда перестилизованы под токены
- GSAP 3.15 + ScrollTrigger + SplitText через @gsap/react (useGSAP, cleanup обязателен): скролл-сцены
- Motion 14 (`motion/react`): hover/tap/layout состояния компонентов. Не два движка на одном элементе
- View Transitions (React 19.3) для переходов между страницами; без поддержки браузера — обычная навигация
- Lenis 1.3: только desktop; выключен на touch и при reduced motion; один общий rAF через gsap.ticker
- three / R3F / drei: ТОЛЬКО для одной сцены hero на главной (`components/hero-scene`), lazy, desktop + capable mobile
- next-intl: `/ru` (default), `/kk`, позже `/en`. Код языка `kk`, не `kz`
- @serwist/turbopack: manifest + offline-страница. Push, background sync: не делать
- Деплой: Vercel, функции `regions: ['fra1']`

## Карта сайта (источник правды — SPEC.md)
`/` · `/services/websites` · `/services/mini-apps` · `/services/bots` · `/services/automation` · `/training` · `/work` · `/about` · `/brief` · `/contact` · `/privacy` · `/offer`
Каждая страница услуги = один шаблон `ServicePage`: оффер → живое демо → что входит/не входит → пакеты «от» → процесс → FAQ → CTA.

## Команды
- `pnpm dev` / `pnpm build` / `pnpm lint` / `pnpm typecheck`
- `pnpm shots`: Playwright-скриншоты 375 / 768 / 1440 всех маршрутов в `./shots`
- `npx @google/design.md lint DESIGN.md`: токены и WCAG-контраст

## Контент
- Весь текст, цены и FAQ живут в `content/*.ts` (типизировано), не в JSX.
- IMPORTANT: никогда не придумывай кейсы, клиентов, логотипы, отзывы, метрики, сроки, награды и цифры. Нет данных: оставь `TODO(ilyas)` и спроси.
- Свои продукты (мини-апп @elazart_bot, LinkMAX, сам этот сайт) подписывать «собственный продукт / прототип», не «кейс».
- BCC HUB не кейс и не клиент. Не упоминать без явного указания в SPEC.md.
- Курс для студентов: «в подготовке», без отзывов и результатов.
- Цены только «от», только из `content/pricing.ts`, одинаковые на всех страницах.

## Демо (доказательство на каждой странице услуги)
- Все демо — клиентские симуляции на моках. Никаких реальных API-вызовов, ключей и ПДн.
- Демо грузятся через next/dynamic + IntersectionObserver, ставятся на паузу вне экрана, имеют статичный постер для reduced motion.

## Дизайн
- Только токены из DESIGN.md. Никаких сырых hex/px/радиусов в компонентах.
- Одна сильная сцена на страницу. Главная: 3D-hero. Страница услуги: её демо. Остальное тихое — типографика и отступы.
- Запрещено: Inter / Roboto / Space Grotesk как display; фиолетово-синие градиенты; кремовый фон + терракота; near-black + кислотный акцент; сетки одинаковых скруглённых карточек с мягкой тенью; eyebrow-лейблы капсом; «→» после ссылок; 01/02/03 вне реальных последовательностей; акцент одного слова в заголовке; fade-up на каждой секции; кастомный курсор; прелоадер и счётчик 0%; autoplay звука; scroll-jacking и горизонтальный скролл на mobile.
- Любой шрифт обязан содержать: Әә Ғғ Ққ Ңң Өө Ұұ Үү Һһ Іі. Проверь до подключения.

## Mobile / PWA
- Mobile-first: сначала 375px, потом desktop.
- `@media (display-mode: standalone)`: нижний tab bar (Главная, Услуги, Работы, Связаться), `env(safe-area-inset-*)`, без браузерного футера.
- Service worker не кэширует `/api/*`, формы и стрим чата.
- Install-подсказка только после вовлечённости (2-й визит или 3+ страницы), никогда в in-app браузерах Telegram/Instagram.

## Бюджет производительности (mobile, каждая страница)
- LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1; Lighthouse mobile ≥ 90
- Initial JS страницы ≤ 170KB gzip; 3D-чанк и демо — отдельные lazy-чанки
- ≤ 2 семейства шрифтов (variable, subset latin+cyrillic+cyrillic-ext); изображения AVIF, hero-постер ≤ 120KB
- LCP-элемент: текст или постер, никогда canvas/iframe
- WebGL: DPR ≤ 1.5 на mobile, frameloop="demand", обработка потери контекста, gate по reduced motion / Save-Data / deviceMemory / WebGL2
- Анимировать только transform/opacity; reduced motion через gsap.matchMedia и MotionConfig reducedMotion="user"

## Данные и право
- Волна 1 не хранит персональные данные: бриф считается в браузере и уходит предзаполненным текстом в WhatsApp/Telegram.
- Без отдельного решения в SPEC.md: никаких форм с ПДн, логов чата, Supabase/Resend (локализация ПДн в РК с 25.08.2026).
- Аналитика: Yandex Metrica (`next/script` lazyOnload) + @vercel/analytics + @vercel/speed-insights.

## Как работать
- Используй Context7 для документации библиотек без напоминаний.
- UI/UX Pro Max вызывай только по моей просьбе (фаза 1 — черновик дизайн-системы, фаза 7 — чек-лист). Во всех остальных случаях источник правды — DESIGN.md.
- Промты из внешних библиотек (MotionSites и др.) — только как референс: переписывай под токены DESIGN.md и бюджет производительности, не вставляй как есть.
- Видео-фоллбэки демо делаем через HyperFrames из тех же сцен; кладём в `public/media` (AV1 + H.264 + постер), без звука.
- Новая страница или демо: сначала план (plan mode), потом код.
- После любого визуального изменения: `pnpm shots`, сравни с DESIGN.md, перечисли расхождения, исправь. Только потом «готово».
- Одна страница/секция = одна задача = один коммит. Перед коммитом: typecheck + build.
- При компактизации сохраняй список изменённых файлов и открытых TODO(ilyas).
