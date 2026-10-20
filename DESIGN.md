---
version: alpha
name: Azelkhanov
description: Сайт услуг «сделаю и научу». Светлая основа, ink и синий из логотипа, один шрифт из wordmark, геометрия монограммы AZ как сигнатура.
colors:
  paper: "#FFFFFF"
  mist: "#F1F3F8"
  ink: "#0B1020"
  slate: "#4A5168"
  line: "#D7DCE6"
  primary: "#2464FB"
  primary-deep: "#1A4FD6"
  on-primary: "#FFFFFF"
  night: "#0B1020"
  night-raised: "#151B2F"
  ink-inverse: "#EEF1F8"
  slate-inverse: "#A1A8BD"
  line-inverse: "#283049"
  primary-light: "#7A9DFF"
typography:
  display-xl:
    fontFamily: Geologica
    fontSize: 6.5rem
    fontWeight: 760
    lineHeight: 0.92
    letterSpacing: -0.035em
  display-xl-mobile:
    fontFamily: Geologica
    fontSize: 2.75rem
    fontWeight: 760
    lineHeight: 0.96
    letterSpacing: -0.03em
  display-l:
    fontFamily: Geologica
    fontSize: 4rem
    fontWeight: 720
    lineHeight: 1
    letterSpacing: -0.03em
  display-l-mobile:
    fontFamily: Geologica
    fontSize: 2.125rem
    fontWeight: 720
    lineHeight: 1.04
    letterSpacing: -0.025em
  heading-m:
    fontFamily: Geologica
    fontSize: 2.25rem
    fontWeight: 680
    lineHeight: 1.1
    letterSpacing: -0.02em
  heading-m-mobile:
    fontFamily: Geologica
    fontSize: 1.625rem
    fontWeight: 680
    lineHeight: 1.15
    letterSpacing: -0.015em
  heading-s:
    fontFamily: Geologica
    fontSize: 1.375rem
    fontWeight: 640
    lineHeight: 1.25
    letterSpacing: -0.01em
  body-l:
    fontFamily: Geologica
    fontSize: 1.25rem
    fontWeight: 400
    lineHeight: 1.5
  body-m:
    fontFamily: Geologica
    fontSize: 1.0625rem
    fontWeight: 400
    lineHeight: 1.6
  body-s:
    fontFamily: Geologica
    fontSize: 0.9375rem
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: Geologica
    fontSize: 0.875rem
    fontWeight: 520
    lineHeight: 1.3
  price:
    fontFamily: Geologica
    fontSize: 2.5rem
    fontWeight: 700
    lineHeight: 1
    letterSpacing: -0.02em
    fontFeature: '"tnum" 1, "lnum" 1'
  code:
    fontFamily: Fira Code
    fontSize: 0.875rem
    fontWeight: 420
    lineHeight: 1.55
    fontFeature: '"liga" 0, "calt" 0'
rounded:
  none: 0px
  xs: 4px
  sm: 8px
  md: 16px
  phone: 44px
  pill: 999px
spacing:
  "1": 4px
  "2": 8px
  "3": 12px
  "4": 16px
  "5": 24px
  "6": 32px
  "7": 48px
  "8": 64px
  "9": 96px
  "10": 144px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: 16px
    height: 48px
  button-primary-hover:
    backgroundColor: "{colors.primary-deep}"
    textColor: "{colors.on-primary}"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    padding: 16px
    height: 48px
  button-secondary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  link:
    textColor: "{colors.primary-deep}"
    typography: "{typography.body-m}"
  link-inverse:
    backgroundColor: "{colors.night}"
    textColor: "{colors.primary-light}"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body-m}"
    rounded: "{rounded.sm}"
    padding: 14px
    height: 48px
  input-hint:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.slate}"
    typography: "{typography.body-s}"
  choice-selected:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.pill}"
  package:
    backgroundColor: "{colors.mist}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: 32px
  package-meta:
    backgroundColor: "{colors.mist}"
    textColor: "{colors.slate}"
    typography: "{typography.body-s}"
  demo-stage:
    backgroundColor: "{colors.mist}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: 24px
  demo-caption:
    backgroundColor: "{colors.mist}"
    textColor: "{colors.slate}"
    typography: "{typography.body-s}"
  phone:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.phone}"
    width: 320px
    height: 660px
  code-panel:
    backgroundColor: "{colors.night}"
    textColor: "{colors.ink-inverse}"
    typography: "{typography.code}"
    rounded: "{rounded.sm}"
    padding: 16px
  rule:
    backgroundColor: "{colors.line}"
    height: 1px
  rule-inverse:
    backgroundColor: "{colors.line-inverse}"
    height: 1px
  surface-inverse:
    backgroundColor: "{colors.night}"
    textColor: "{colors.ink-inverse}"
  surface-inverse-raised:
    backgroundColor: "{colors.night-raised}"
    textColor: "{colors.slate-inverse}"
---

## Overview

Сайт одного человека, который делает продукты и учит команды ими пользоваться. Тон — инженерная ясность: крупный плотный шрифт, много воздуха, никакого декора, который нельзя объяснить. Сильная сцена одна на страницу (3D-монограмма на главной, живое демо на странице услуги), всё остальное держится на типографике и ритме отступов.

Сигнатура взята из логотипа, а не из трендов:

- **Диагональ AZ, 39.5°.** Синий штрих монограммы идёт под углом 39.5° к горизонтали. Этот угол — единственная разрешённая диагональ на сайте: маркер наведения в индексе услуг, наклон 3D-сцены, сдвиг в переходе между страницами. CSS-переменная `--az-angle: 39.5deg`.
- **Синее — скруглённое, ink — острое.** В логотипе синий штрих имеет круглые концы, а чёрные формы срезаны под острым углом. На сайте так же: всё синее и интерактивное (основная кнопка, выбранный шаг брифа, индикаторы демо) получает `rounded.pill`, всё ink — `rounded.none`/`xs`.
- **Шрифт wordmark.** Geologica почти совпадает с начертанием «Azelkhanov» в логотипе, поэтому заголовки звучат как продолжение знака.

## Colors

Пять ролей, остальное — производные для состояний и тёмных поверхностей.

- **Paper (#FFFFFF):** основной фон. Белый, не кремовый.
- **Mist (#F1F3F8):** холодный светлый фон сцен: рамка демо, пакеты, выделенные секции. Разделяем блоки им и отступами, а не линейками.
- **Ink (#0B1020):** весь текст и знак. Из логотипа. Контраст на paper 18.93:1.
- **Slate (#4A5168):** второстепенный текст, подписи, мета. 7.87:1 на paper, 7.09:1 на mist.
- **Primary (#2464FB):** синий из логотипа — единственный акцент. Только заливка основной кнопки, кольцо фокуса, выбранные состояния, индикаторы в демо. Не фон секций, не градиент, не цвет заголовков.
- **Primary-deep (#1A4FD6):** синий для текста (ссылки) и hover основной кнопки. Нужен потому, что primary на mist даёт 4.41:1 — ниже AA для мелкого текста; primary-deep — 6.04:1 на mist, 6.70:1 на paper.
- **Line (#D7DCE6):** только границы полей ввода и строки таблиц (компонент `rule`). Не декоративные линейки между секциями.

Тёмные поверхности (night, night-raised, ink-inverse, slate-inverse, line-inverse, primary-light) используются локально: панель кода в «Рентгене», телефон, футер и «ночные сцены» (S5) — сцена демо и финальный CTA, не больше двух на страницу. Основа сайта остаётся светлой. Тёмная тема всего сайта — вторична и не по умолчанию. На night синий primary допустим только как заливка кнопки или крупный текст (3.87:1); текстовые ссылки на тёмном — primary-light (7.30:1).

## Typography

Одно семейство на весь текст — **Geologica** (variable, wght 300–800), второе — **Fira Code** только там, где на экране действительно код или измеренная метрика (панель «Рентгена», токены на `/style`). Оба проверены на Әә Ғғ Ққ Ңң Өө Ұұ Үү Һһ Іі (`scripts/fonts.py` падает, если глифа нет).

- Шрифты собираются из исходников в `brand/fonts-src` в один woff2 на семейство (латиница, кириллица, казахские буквы, ₸, №, типографская пунктуация): Geologica 32 KB, Fira Code 38 KB.
- Fallback-грани с `size-adjust` и `ascent-override`, посчитанными по ширине реального русского текста против Arial — чтобы подмена шрифта не давала CLS.
- Шкала плавная: каждый display/heading-токен имеет пару `-mobile`; в CSS размер = `clamp(mobile, …, desktop)` между 375 и 1440 px.
- Заголовки — плотные (lineHeight 0.92–1.1, отрицательный трекинг), текст — 17 px, lineHeight 1.6, ширина строки не больше 68ch.
- Капс не используем вообще. Лейблы — `label` (14 px, 520), в обычном регистре.
- Цены — токен `price` с табличными цифрами, неразрывный пробел между разрядами и перед ₸.
- `hyphens: auto` и `lang="ru"` для длинных русских слов на 375 px.

## Layout

- **Сетка:** 4 колонки на mobile (375), 8 на tablet (768), 12 на desktop (≥1024). Контейнер до 1360 px. Поля: 16 px mobile, 32 px tablet, 48 px desktop. Межколоночный отступ: 12 / 16 / 24 px.
- **Отступы:** шкала 4 → 144 px (`spacing.1…10`). Между секциями: 64 px mobile, 96 px tablet, 144 px desktop. Внутри секции: 24–48 px.
- **Ритм страницы услуги:** оффер занимает первый экран вместе с началом демо — демо должно быть видно без прокрутки на desktop и начинаться на втором экране на mobile.
- **Касания:** минимальная зона нажатия 48 px. Нижняя навигация в standalone — с `env(safe-area-inset-bottom)`.

### Motion

| Токен | Длительность | Где |
|---|---|---|
| `--dur-press` | 120 ms | нажатие кнопки (scale 0.98) |
| `--dur-quick` | 200 ms | цвет кнопки, hover-маркер в индексе услуг |
| `--dur-base` | 320 ms | переключатели в демо, раскрытие FAQ |
| `--dur-page` | 280 ms | переход между страницами (View Transitions) |
| `--dur-scene` | 600–900 ms | только внутри демо и 3D-сцены |

Easing: `--ease-out: cubic-bezier(.22, 1, .36, 1)` для появления, `--ease-in-out: cubic-bezier(.65, 0, .35, 1)` для перемещений. Пружина Motion для нажатий: stiffness 420, damping 32.

Анимируем только `transform` и `opacity` (плюс `clip-path` в переходе страниц). **Не анимируем:** появление секций при скролле, абзацы, изображения, футер, заголовки (LCP-текст виден сразу, без reveal). При `prefers-reduced-motion: reduce` все длительности → 0, демо показывают постер, частицы не грузятся.

### Expressive layer

Принцип (из разбора референсов, `refs/REFERENCES.md`): сайт выглядит профессионально, когда **отвечает на действия** — курсор, скролл, клик, — а не когда каждый блок «выезжает» сам. Поэтому выразительность добавляется только через сигнатуры ниже, каждая — с бюджетом и запасным вариантом.

| # | Сигнатура | Где | Поведение | Бюджет / запасной вариант |
|---|---|---|---|---|
| S1 | **Монограмма из частиц** | Hero главной | Знак AZ собран из ~2–3 тыс. точек (ink и primary, как в логотипе). Курсор расталкивает точки, они пружинят обратно; при прокрутке точки уходят по диагонали 39.5°. | Canvas, отдельный lazy-чанк ≤ 15 KB gzip, старт после idle. DPR ≤ 1.5, пауза вне экрана. Reduced motion / Save-Data / deviceMemory < 4 → статичная монограмма |
| S2 | **Диагональная шторка** | Переход между страницами | Синяя полоса под 39.5° проходит экран и открывает новую страницу. | View Transitions + `clip-path`, 0 KB JS. Без поддержки — обычная смена |
| S3 | **Магнитная кнопка** | Главная CTA на desktop | Кнопка тянется к курсору (до 6 px), текст перекатывается при наведении. | Только `pointer: fine`; ≤ 2 KB |
| S4 | **Сцена процесса** | «Как я работаю» | На desktop секция закрепляется, скролл ведёт линию по 4 шагам, активный шаг раскрывается. На mobile — обычный список с той же линией прогресса. | GSAP ScrollTrigger, scrub; без pin на touch |
| S5 | **Ночная сцена** | Рамка демо, финальный CTA | Поверхность night с сеткой точек; точки под курсором подсвечиваются primary-light. Не больше двух ночных секций на страницу. | Один `radial-gradient`-маск в CSS, позиция курсора через CSS-переменную |
| S6 | **Индекс услуг** | Главная | Штрих 39.5° у цены (есть) + превью демо, которое следует за курсором внутри строки. | Превью — постер демо (AVIF), появляется только на `pointer: fine` |

Плавный скролл (Lenis) — только desktop, один общий цикл с GSAP. Всё, чего нет в таблице, не анимируется.

### Wireframes

Главная, 375:

```
┌───────────────────────────┐
│ AZ Azelkhanov        [≡]  │ компактная шапка
├───────────────────────────┤
│ Сделаю сайт,              │ display-xl-mobile
│ бота или AI-процесс —     │
│ и научу команду           │
│ с ним работать            │
│ Алматы · отвечаю за 2 ч   │ body-s slate
│ (WhatsApp)  Оценить задачу│ pill синяя + secondary
│ ░░░ постер AZ ░░░░░░░░░░ │ постер, 3D догружается
├───────────────────────────┤
│ Сайты           от 120 000│ индекс услуг: строки,
│ Mini Apps       от 250 000│ не карточки
│ Боты             от 80 000│
│ Автоматизация   от 200 000│
│ Тренинги     от 15 000/час│
├───────────────────────────┤
│ Выступал и преподавал:    │ текстом, переносится
│ NU, AlmaU, Astana Hub…    │
├───────────────────────────┤
│ Как я работаю 1 2 3 4     │ реальная последовательность
│ Собственные продукты      │
│ Тренинги → /training      │
│ Обо мне (фото)            │
│ CTA + контакты            │
└───────────────────────────┘
          [WhatsApp]  ← плавающая кнопка (браузер)
[Главная][Услуги][Работы][Связь] ← только standalone
```

Главная, 1440:

```
┌──────────────────────────────────────────────────────────────────┐
│ AZ Azelkhanov    Услуги ▾  Тренинги  Работы  Обо мне   (WhatsApp)│
├──────────────────────────────────────────────────────────────────┤
│ Сделаю сайт, бота             │                                  │
│ или AI-процесс —              │       3D-монограмма AZ           │
│ и научу команду               │       (cols 8–12, canvas)        │
│ с ним работать                │                                  │
│ (WhatsApp) Оценить задачу     │                                  │
├──────────────────────────────────────────────────────────────────┤
│ Сайты и лендинги     одна фраза оффера        от 120 000 ₸   ╱   │ hover: синяя
│ Telegram Mini Apps   …                        от 250 000 ₸       │ диагональ 39.5°
│ Telegram-боты        …                        от 80 000 ₸        │ и превью демо
│ AI-автоматизация     …                        от 200 000 ₸       │ справа
│ Тренинги             …                        от 15 000 ₸/час    │
├──────────────────────────────────────────────────────────────────┤
│ cols 1–4: «Выступал и преподавал»  │ cols 5–12: список площадок  │
│ Как я работаю: 4 шага в строку                                    │
│ Продукты │ Тренинги │ Обо мне (фото слева, текст справа)          │
│ CTA на mist                                                       │
└──────────────────────────────────────────────────────────────────┘
```

Страница услуги (`ServicePage`), 375:

```
┌───────────────────────────┐
│ ← Услуги                  │
│ Telegram-боты             │ display-l-mobile (view-transition name)
│ Бот, который принимает    │ body-l
│ заявки, пока вы заняты    │
│ от 80 000 ₸ · от 7 дней   │ price + slate
│ (WhatsApp)                │
├───────────────────────────┤
│ ┌───────────────────────┐ │ demo-stage (mist)
│ │  ▢ телефон / постер   │ │ на mobile — лёгкая версия
│ │  [Запустить демо]     │ │ или ролик
│ └───────────────────────┘ │
│ демо-сценарий, без данных │ demo-caption
├───────────────────────────┤
│ Что входит / Не входит    │ два списка подряд
│ Пакеты «от»               │ package (mist, по одному в ряд)
│ Как я работаю 1–4         │
│ FAQ (аккордеон)           │
│ CTA                       │
└───────────────────────────┘
```

Страница услуги, 1440:

```
┌──────────────────────────────────────────────────────────────────┐
│ шапка                                                            │
├──────────────────────────────────────────────────────────────────┤
│ cols 1–5:                     │ cols 6–12: demo-stage (mist)     │
│ Telegram-боты                 │  ┌──────────┐   уведомление      │
│ оффер                         │  │ телефон  │   менеджеру        │
│ от 80 000 ₸ · от 7 дней       │  │  чат     │   (второй экран)   │
│ (WhatsApp) Оценить задачу     │  └──────────┘                    │
│                               │ демо-сценарий, без данных        │
├──────────────────────────────────────────────────────────────────┤
│ Что входит (cols 1–6)          │ Не входит (cols 7–12)           │
│ Пакеты: 2–3 в ряд, разной ширины по содержанию                   │
│ Процесс │ FAQ (cols 4–12)                                        │
│ CTA                                                               │
└──────────────────────────────────────────────────────────────────┘
```

## Elevation & Depth

Теней почти нет. Глубина — через тон поверхности (paper → mist → night), а не через размытые тени. Единственная тень — у телефона в демо (`--shadow-phone: 0 24px 48px -24px` ink 30%), потому что это физический предмет на сцене. Слои: контент 0, шапка и плавающая кнопка 10, нижняя навигация 20, оверлей меню 30.

## Shapes

- Синие интерактивные элементы — `pill`.
- Ink-кнопки и элементы с ink-обводкой — `xs` (4 px).
- Поля ввода, пакеты, панели кода — `sm` (8 px).
- Сцена демо — `md` (16 px).
- Телефон — `phone` (44 px), как у реального устройства.
- Диагональ — только 39.5°, только там, где перечислено в Overview.

## Components

- **button-primary** — синяя pill-кнопка. Одна на экран. Hover → primary-deep, press → scale 0.98. Иконка мессенджера слева допустима, стрелки после текста — нет.
- **button-secondary** — ink-обводка 1.5 px, радиус 4 px, hover заливает ink.
- **link** — primary-deep, подчёркивание 1 px с `text-underline-offset: 0.2em`; hover — подчёркивание толще.
- **input / choice** — поля и кнопки 48 px (= `spacing.7`, минимальная зона касания); выбор в брифе — чипы-pill, выбранный чип — primary с белым текстом (ключевое состояние), невыбранный — paper с обводкой line.
- **package** — карточка пакета на mist: название, цена «от» (`price`), срок, 3–6 пунктов «входит», одна ссылка-действие. Пакеты одной услуги не одинаковой ширины: ширина по содержанию.
- **demo-stage + demo-caption** — рамка сцены демо и подпись под ней («демо-сценарий», «собственный продукт», «измерено в вашем браузере»). Подпись обязательна.
- **phone** — макет телефона для демо бота и Mini App. Рамка ink 8 px, экран paper.
- **code-panel** — тёмная панель кода в «Рентгене».
- **focus** — кольцо 2 px primary + отступ 2 px paper, на всех интерактивных элементах; никогда не убирается.

## Do's and Don'ts

Делаем:
- Один синий акцент, один шрифт для текста, сигнатура из геометрии логотипа.
- Разделяем секции отступами и сменой поверхности paper/mist.
- Услуги показываем индексом-списком со строками разной длины, а не сеткой карточек.
- Нумеруем только реальную последовательность («Как я работаю», шаги брифа).
- Каждое демо и каждый собственный продукт подписываем честно.

Не делаем (из CLAUDE.md + решения этой системы):
- Inter / Roboto / Space Grotesk как display; моно-шрифт как украшение.
- Фиолетово-синие и любые градиенты; синий как фон секции.
- Кремовый фон + терракота; near-black фон + кислотный акцент как основа сайта.
- Сетки одинаковых скруглённых карточек с мягкой тенью; glass, blur-пятна, светящиеся обводки.
- Декоративные линейки «как в газете» между всеми блоками.
- Eyebrow-лейблы капсом, «→» после ссылок, 01/02/03 вне реальных последовательностей, акцент одного слова в заголовке.
- Fade-up на каждой секции, reveal заголовков, кастомный курсор, прелоадер, счётчик 0%, автозвук, scroll-jacking и горизонтальный скролл на mobile.
- Сырые hex, px и радиусы в компонентах — только токены.
