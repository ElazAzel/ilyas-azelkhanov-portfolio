import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import tokens from "@/content/tokens.json";
import { packages } from "@/content/pricing";
import { contacts, telegramLink, whatsappLink } from "@/content/contacts";
import { contrast } from "@/lib/contrast";
import { Logo, LogoInline, Monogram } from "@/components/brand/Logo";
import { Button, ButtonLink } from "@/components/ui/Button";
import { TelegramIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { Field } from "@/components/ui/Field";
import { ChoiceGroup } from "@/components/ui/Choice";
import { PackageCard } from "@/components/ui/PackageCard";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { DemoStage } from "@/components/ui/DemoStage";
import { ServiceIndex } from "@/components/style/ServiceIndex";
import { ViewTransitionDemo } from "@/components/style/ViewTransitionDemo";

export const metadata: Metadata = {
  title: "Дизайн-система",
  robots: { index: false },
};

type ColorName = keyof typeof tokens.colors;
const c = tokens.colors;

const ROLES: { name: ColorName; role: string }[] = [
  { name: "paper", role: "Основной фон" },
  { name: "mist", role: "Сцены демо, пакеты, выделенные секции" },
  { name: "ink", role: "Текст и знак" },
  { name: "slate", role: "Второстепенный текст, подписи" },
  { name: "line", role: "Границы полей и строки таблиц" },
  { name: "primary", role: "Единственный акцент: заливка кнопки, фокус, выбранное" },
  { name: "primary-deep", role: "Синий текст (ссылки) и hover кнопки" },
];

const DARK: { name: ColorName; role: string }[] = [
  { name: "night", role: "Тёмные поверхности: код, телефон, футер" },
  { name: "night-raised", role: "Приподнятый слой на тёмном" },
  { name: "ink-inverse", role: "Текст на тёмном" },
  { name: "slate-inverse", role: "Подписи на тёмном" },
  { name: "primary-light", role: "Ссылки на тёмном" },
];

const TYPE: { token: string; cls: string; sample: string }[] = [
  { token: "display-xl", cls: "t-display-xl", sample: "Сделаю и научу" },
  { token: "display-l", cls: "t-display-l", sample: "Telegram Mini Apps" },
  { token: "heading-m", cls: "t-heading-m", sample: "Что входит в работу" },
  { token: "heading-s", cls: "t-heading-s", sample: "Корпоративный сайт" },
  { token: "body-l", cls: "t-body-l", sample: "Бот принимает заявки и отвечает на частые вопросы, пока вы заняты." },
  {
    token: "body-m",
    cls: "t-body-m",
    sample:
      "Разбираю процесс, собираю схему «как есть → как будет», настраиваю интеграции и учу команду. Қазақша: Әә Ғғ Ққ Ңң Өө Ұұ Үү Һһ Іі.",
  },
  { token: "body-s", cls: "t-body-s", sample: "Отвечаю в течение 2 часов в будни с 10 до 19 (Алматы)." },
  { token: "label", cls: "t-label", sample: "Написать в WhatsApp" },
  { token: "price", cls: "t-price", sample: "от 250 000 ₸" },
  { token: "code", cls: "t-code", sample: "--color-primary: #2464FB;" },
];

function typeMeta(token: string): string {
  const all = tokens.typography as Record<string, { fontSize: string; fontWeight: number; lineHeight: number; fontFamily: string }>;
  const d = all[token]!;
  const m = all[`${token}-mobile`];
  const size = m ? `${m.fontSize} → ${d.fontSize}` : d.fontSize;
  return `${d.fontFamily} · ${size} · ${d.fontWeight} · lh ${m ? `${m.lineHeight}/${d.lineHeight}` : d.lineHeight}`;
}

function Section({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-6 lg:gap-7">
      <header className="flex flex-col gap-2">
        <h2 className="t-heading-m">{title}</h2>
        {note ? <p className="measure t-body-m text-slate">{note}</p> : null}
      </header>
      {children}
    </section>
  );
}

function Swatch({ name, role, dark = false }: { name: ColorName; role: string; dark?: boolean }) {
  const hex = c[name];
  const pairs = dark
    ? [`на night ${contrast(hex, c.night)}:1`]
    : [`на paper ${contrast(hex, c.paper)}:1`, `на mist ${contrast(hex, c.mist)}:1`];
  return (
    <li className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-1 py-3">
      <span
        aria-hidden="true"
        className="row-span-2 size-6 rounded-sm ring-[length:var(--stroke)] ring-line ring-inset"
        style={{ background: hex }}
      />
      <span className="flex flex-wrap items-baseline gap-x-3">
        <span className="t-label">{name}</span>
        <code className="t-code text-slate">{hex}</code>
      </span>
      <span className={`t-body-s ${dark ? "text-slate-inverse" : "text-slate"}`}>
        {role} · {pairs.join(" · ")}
      </span>
    </li>
  );
}

const landing = packages.find((p) => p.id === "landing")!;
const corporate = packages.find((p) => p.id === "corporate-site")!;
const tokenSnippet = [
  "@theme {",
  `  --color-primary: ${c.primary};`,
  `  --color-ink: ${c.ink};`,
  `  --radius-pill: ${tokens.rounded.pill};`,
  `  --spacing-7: ${tokens.spacing["7"]};`,
  "}",
  "",
  "/* сгенерировано из DESIGN.md: pnpm tokens */",
].join("\n");

export default function StylePage() {
  return (
    <main className="container-page flex flex-col gap-8 pb-10 lg:gap-10">
      <header className="flex flex-col gap-6 border-b-[length:var(--stroke)] border-ink pt-6 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between gap-5">
            <LogoInline className="inline-flex items-center gap-3" />
            <Link href="/" className="link t-label">
              Выразительный слой
            </Link>
          </div>
          <h1 className="t-display-xl">Дизайн-система</h1>
          <p className="measure t-body-l text-slate">
            Style tile фазы 1. Все значения берутся из DESIGN.md и проходят через один генератор токенов.
          </p>
        </div>
        <Logo className="w-10 shrink-0 max-lg:hidden" />
      </header>

      <Section
        title="Цвета"
        note="Пять ролей и производные для состояний. Синий - только заливка, фокус и выбранное; синий текст всегда primary-deep."
      >
        <div className="grid-page gap-y-6">
          <ul className="col-span-4 flex flex-col lg:col-span-6">
            {ROLES.map((r) => (
              <Swatch key={r.name} {...r} />
            ))}
          </ul>
          <ul className="col-span-4 flex flex-col rounded-md bg-night px-5 py-3 text-ink-inverse md:col-span-8 lg:col-span-6">
            {DARK.map((r) => (
              <Swatch key={r.name} {...r} dark />
            ))}
          </ul>
        </div>
      </Section>

      <Section
        title="Типографика"
        note="Geologica - шрифт wordmark, на весь текст. Fira Code - только код и измеренные метрики. Размеры плавно растут от 375 до 1440 px."
      >
        <ul className="flex flex-col gap-6">
          {TYPE.map((t) => (
            <li key={t.token} className="grid-page gap-y-2">
              <code className="col-span-4 t-code text-slate md:col-span-8 lg:col-span-3">
                {t.token}
                <br />
                {typeMeta(t.token)}
              </code>
              <p className={`col-span-4 md:col-span-8 lg:col-span-9 ${t.cls}`}>{t.sample}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Кнопки и ссылки" note="Синее - скруглённое, ink - острое, как в логотипе. Одна синяя кнопка на экран.">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-4">
            <ButtonLink href={whatsappLink("Здравствуйте, Ильяс! Хочу обсудить задачу.")} icon={<WhatsAppIcon />}>
              Написать в WhatsApp
            </ButtonLink>
            <ButtonLink href={telegramLink()} variant="secondary" icon={<TelegramIcon />}>
              Telegram {contacts.telegram.display}
            </ButtonLink>
            <Link href="/brief/" className="link t-label">
              Оценить задачу
            </Link>
            <Button disabled>Недоступно</Button>
          </div>
          <div className="flex flex-wrap items-center gap-4 rounded-md bg-night p-5">
            <ButtonLink href={whatsappLink("Здравствуйте, Ильяс!")} icon={<WhatsAppIcon />}>
              На тёмном
            </ButtonLink>
            <Link href="/contact/" className="t-label text-primary-light underline underline-offset-4">
              Ссылка на тёмном
            </Link>
          </div>
        </div>
      </Section>

      <Section title="Поля и выбор" note="Поля 48 px. Выбор в брифе - чипы; выбранный - синяя pill.">
        <div className="grid-page gap-y-7">
          <div className="col-span-4 flex flex-col gap-5 lg:col-span-5">
            <Field label="Как к вам обращаться" placeholder="Например, Айгерим" hint="Имя попадёт только в текст сообщения." />
            <Field label="Сайт компании" placeholder="example.kz" type="url" />
          </div>
          <div className="col-span-4 flex flex-col gap-6 md:col-span-8 lg:col-span-6 lg:col-start-7">
            <ChoiceGroup legend="Что нужно" options={["Сайт", "Mini App", "Бот", "Автоматизация", "Тренинг"]} initial="Бот" />
            <ChoiceGroup legend="Когда" options={["Срочно", "В течение месяца", "Не горит"]} />
          </div>
        </div>
      </Section>

      <Section title="Пакеты" note="Цены из content/pricing.ts. Пакеты одной услуги - разной ширины по содержанию, не сетка одинаковых карточек.">
        <div className="grid-page gap-y-5">
          <div className="col-span-4 lg:col-span-5">
            <PackageCard
              pkg={landing}
              includes={["Структура и тексты по брифу", "Дизайн под ваш бренд", "Адаптив под телефоны", "Заявки в WhatsApp и Telegram"]}
              action={{ label: "Обсудить лендинг", href: whatsappLink("Здравствуйте, Ильяс! Интересует лендинг.") }}
            />
          </div>
          <div className="col-span-4 md:col-span-8 lg:col-span-7">
            <PackageCard
              pkg={corporate}
              includes={[
                "Структура из нескольких разделов",
                "Дизайн под ваш бренд и адаптив",
                "Базовое SEO и метаданные",
                "Аналитика и заявки в мессенджеры",
                "Помощь с хостингом в Казахстане",
                "Передача всех доступов",
              ]}
              action={{ label: "Обсудить сайт", href: whatsappLink("Здравствуйте, Ильяс! Интересует корпоративный сайт.") }}
            />
          </div>
        </div>
      </Section>

      <Section title="Телефон и рамка демо" note="Рамка демо всегда с честной подписью. Тень есть только у телефона.">
        <div className="grid-page gap-y-6">
          <div className="col-span-4 md:col-span-5 lg:col-span-6">
            <DemoStage kind="demo">
              <PhoneFrame label="Пример экрана чат-бота">
                <div className="flex h-full flex-col gap-3 bg-mist px-4 pt-7 pb-4 t-body-s">
                  <p className="self-start rounded-sm bg-paper px-4 py-3">Здравствуйте! Я бот автосервиса. Что вас интересует?</p>
                  <p className="self-end rounded-sm bg-primary px-4 py-3 text-on-primary">Записаться</p>
                  <p className="self-start rounded-sm bg-paper px-4 py-3">Выберите услугу:</p>
                  <div className="mt-auto grid grid-cols-2 gap-2">
                    {["Замена масла", "Диагностика", "Шиномонтаж", "Другое"].map((b) => (
                      <span key={b} className="rounded-sm bg-paper px-3 py-3 text-center t-label">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </PhoneFrame>
            </DemoStage>
          </div>
          <div className="col-span-4 flex flex-col gap-5 md:col-span-3 lg:col-span-6">
            <DemoStage kind="demo" caption="Фрагмент токенов: генерируется из DESIGN.md командой pnpm tokens.">
              <pre className="overflow-x-auto rounded-sm bg-night p-4 t-code text-ink-inverse">
                <code>{tokenSnippet}</code>
              </pre>
            </DemoStage>
            <div className="flex items-center gap-5 rounded-md bg-mist p-5">
              <Monogram className="w-8 shrink-0" />
              <p className="t-body-s text-slate">Монограмма - исходник для 3D-сцены на главной.</p>
            </div>
          </div>
        </div>
      </Section>

      <Section
        title="Индекс услуг"
        note="Сигнатура: при наведении у цены прорисовывается синий штрих под углом монограммы, 39.5°. На телефоне его нет - там нет наведения."
      >
        <ServiceIndex
          rows={[
            { service: "websites", title: "Сайты и лендинги", line: "Быстрые сайты с заявками в WhatsApp", packageId: "landing" },
            { service: "mini-apps", title: "Telegram Mini Apps", line: "Каталог, запись или обучение внутри Telegram", packageId: "mini-app" },
            { service: "bots", title: "Telegram-боты", line: "Заявки и ответы на частые вопросы", packageId: "bot" },
            { service: "automation", title: "AI-автоматизация", line: "Меньше ручной работы с заявками и таблицами", packageId: "automation" },
            { service: "training", title: "Тренинги", line: "Корпоративно и лично", packageId: "training-personal" },
          ]}
        />
      </Section>

      <Section title="Фокус" note="Нажмите Tab: у каждого интерактивного элемента кольцо 2 px primary с белым зазором. Его никогда не убираем.">
        <div className="flex flex-wrap items-center gap-5">
          <span className="rounded-pill outline-2 outline-offset-2 outline-primary">
            <Button tabIndex={-1}>Так выглядит фокус</Button>
          </span>
          <a href="#top" className="link rounded-xs t-label outline-2 outline-offset-2 outline-primary" tabIndex={-1}>
            Ссылка в фокусе
          </a>
        </div>
      </Section>

      <Section
        title="Переход между страницами"
        note="View Transitions: общий элемент (заголовок услуги) переезжает со страницы на страницу. Без поддержки в браузере - обычная смена."
      >
        <ViewTransitionDemo />
      </Section>
    </main>
  );
}
