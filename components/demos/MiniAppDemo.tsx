"use client";

import { useMemo, useState } from "react";
import { categories, ownBot, products, shopName, sizes, type Product } from "@/content/demos/miniapp";
import { play } from "@/lib/sfx";
import { haptic } from "@/lib/haptics";

type Line = { key: string; product: Product; size: (typeof sizes)[number]; qty: number };
type Screen = { name: "menu" } | { name: "product"; product: Product } | { name: "cart" } | { name: "done"; order: number };
type Order = { n: number; items: string; total: number };

const NBSP = " ";
const tenge = (n: number) => `${n.toLocaleString("ru-RU").replace(/\s/g, NBSP)}${NBSP}₸`;

/** Simple drawn cup / pastry instead of stock photos. */
function Pic({ p, big = false }: { p: Product; big?: boolean }) {
  const tone = { cap: "bg-primary", lat: "bg-primary-light", ame: "bg-ink", flt: "bg-primary-deep", cro: "bg-slate", chs: "bg-line" }[p.id];
  return (
    <span className={`relative grid place-items-center rounded-sm bg-mist ${big ? "aspect-[4/3]" : "aspect-square"}`} aria-hidden="true">
      {p.cat === "coffee" ? (
        <span className="relative flex flex-col items-center">
          <span className={`${big ? "h-8 w-9" : "h-6 w-7"} rounded-b-md ${tone}`} />
          <span className={`${big ? "h-2 w-10" : "h-1 w-8"} -mt-1 rounded-pill bg-ink/20`} />
        </span>
      ) : (
        <span className={`${big ? "h-7 w-9" : "h-5 w-7"} rounded-t-pill ${tone}`} />
      )}
    </span>
  );
}

/** Telegram Mini App simulator (SPEC.md §8): menu → product → cart → order; barista gets the order. Mock data only. */
export default function MiniAppDemo() {
  const [screen, setScreen] = useState<Screen>({ name: "menu" });
  const [cat, setCat] = useState<(typeof categories)[number]["id"]>("coffee");
  const [size, setSize] = useState<(typeof sizes)[number]>(sizes[1]);
  const [cart, setCart] = useState<Line[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const count = cart.reduce((a, l) => a + l.qty, 0);
  const total = useMemo(() => cart.reduce((a, l) => a + (l.product.price + l.size.add) * l.qty, 0), [cart]);

  const add = (p: Product, s: (typeof sizes)[number]) => {
    const key = `${p.id}-${s.id}`;
    setCart((c) => {
      const ex = c.find((l) => l.key === key);
      return ex ? c.map((l) => (l.key === key ? { ...l, qty: l.qty + 1 } : l)) : [...c, { key, product: p, size: s, qty: 1 }];
    });
    play("tick");
    haptic("light");
    setScreen({ name: "menu" });
  };

  const change = (key: string, d: number) =>
    setCart((c) => c.map((l) => (l.key === key ? { ...l, qty: l.qty + d } : l)).filter((l) => l.qty > 0));

  const checkout = () => {
    const n = 100 + Math.floor(Math.random() * 900);
    setOrders((o) => [{ n, total, items: cart.map((l) => `${l.product.name}${l.product.cat === "coffee" ? ` ${l.size.label}` : ""} × ${l.qty}`).join(", ") }, ...o]);
    setCart([]);
    setScreen({ name: "done", order: n });
    play("step");
    haptic("success");
  };

  const mainButton =
    screen.name === "menu" && count > 0
      ? { label: `Корзина · ${count} · ${tenge(total)}`, on: () => setScreen({ name: "cart" }) }
      : screen.name === "product"
        ? {
            label: `Добавить · ${tenge(screen.product.price + (screen.product.cat === "coffee" ? size.add : 0))}`,
            on: () => add(screen.product, screen.product.cat === "coffee" ? size : sizes[0]),
          }
        : screen.name === "cart" && count > 0
          ? { label: `Оформить заказ · ${tenge(total)}`, on: checkout }
          : screen.name === "done"
            ? { label: "Вернуться в меню", on: () => setScreen({ name: "menu" }) }
            : null;

  return (
    <div className="grid gap-5 md:grid-cols-[minmax(0,5fr)_minmax(0,4fr)] md:items-start">
      <div className="mx-auto w-full max-w-[var(--phone-w)] rounded-phone bg-ink p-2 shadow-[var(--shadow-phone)]">
        <div className="flex aspect-[9/17] flex-col overflow-hidden rounded-[calc(var(--radius-phone)-var(--spacing-2))] bg-paper">
          {/* Telegram header */}
          <div className="flex items-center justify-between gap-2 bg-mist px-4 pt-6 pb-3">
            {screen.name === "menu" ? (
              <span className="t-label text-slate">Закрыть</span>
            ) : (
              <button type="button" data-fx="select" onClick={() => setScreen({ name: "menu" })} className="t-label text-primary-deep">
                Назад
              </button>
            )}
            <span className="flex flex-col items-center">
              <span className="t-label">{shopName}</span>
              <span className="t-body-s text-slate">мини-приложение</span>
            </span>
            <span className="t-label text-slate">···</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            {screen.name === "menu" ? (
              <div className="v-in flex flex-col gap-3">
                <div className="flex gap-2">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      data-fx="select"
                      aria-pressed={cat === c.id}
                      onClick={() => setCat(c.id)}
                      className={`rounded-pill px-4 py-2 t-label ${cat === c.id ? "bg-primary text-on-primary" : "bg-mist text-ink"}`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {products
                    .filter((p) => p.cat === cat)
                    .map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        data-fx="select"
                        onClick={() => {
                          setSize(sizes[1]);
                          setScreen({ name: "product", product: p });
                        }}
                        className="flex flex-col gap-2 rounded-sm bg-paper p-2 text-left ring-[length:var(--stroke)] ring-line ring-inset active:scale-98"
                      >
                        <Pic p={p} />
                        <span className="t-label">{p.name}</span>
                        <span className="t-body-s text-slate">от {tenge(p.price)}</span>
                      </button>
                    ))}
                </div>
              </div>
            ) : null}

            {screen.name === "product" ? (
              <div className="v-in flex flex-col gap-3">
                <Pic p={screen.product} big />
                <h4 className="t-heading-s">{screen.product.name}</h4>
                <p className="t-body-s text-slate">{screen.product.note}</p>
                {screen.product.cat === "coffee" ? (
                  <div className="flex gap-2" role="radiogroup" aria-label="Размер">
                    {sizes.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        role="radio"
                        aria-checked={size.id === s.id}
                        data-fx="select"
                        onClick={() => setSize(s)}
                        className={`grid size-7 place-items-center rounded-pill t-label ${size.id === s.id ? "bg-primary text-on-primary" : "bg-mist"}`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}

            {screen.name === "cart" ? (
              <div className="v-in flex flex-col gap-2">
                <h4 className="t-heading-s">Корзина</h4>
                {cart.length === 0 ? <p className="t-body-s text-slate">Пусто — выберите что-нибудь в меню.</p> : null}
                {cart.map((l) => (
                  <div key={l.key} className="flex items-center justify-between gap-2 rounded-sm bg-mist p-2 t-body-s">
                    <span className="flex flex-col">
                      <span className="t-label">
                        {l.product.name}
                        {l.product.cat === "coffee" ? ` ${l.size.label}` : ""}
                      </span>
                      <span className="text-slate">{tenge((l.product.price + l.size.add) * l.qty)}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <button type="button" data-fx="select" aria-label="Меньше" onClick={() => change(l.key, -1)} className="grid size-6 place-items-center rounded-pill bg-paper t-label">
                        −
                      </button>
                      <span className="t-label">{l.qty}</span>
                      <button type="button" data-fx="select" aria-label="Больше" onClick={() => change(l.key, 1)} className="grid size-6 place-items-center rounded-pill bg-paper t-label">
                        +
                      </button>
                    </span>
                  </div>
                ))}
              </div>
            ) : null}

            {screen.name === "done" ? (
              <div className="v-in flex h-full flex-col items-center justify-center gap-3 text-center">
                <span className="grid size-8 place-items-center rounded-pill bg-primary text-on-primary t-heading-m" aria-hidden="true">
                  ✓
                </span>
                <h4 className="t-heading-s">Заказ № {screen.order} принят</h4>
                <p className="t-body-s text-slate">Бариста уже видит заказ. Заберите его на кассе.</p>
              </div>
            ) : null}
          </div>

          {/* Telegram MainButton */}
          <div className="bg-paper p-3">
            {mainButton ? (
              <button
                type="button"
                data-fx="press"
                onClick={mainButton.on}
                className="v-in min-h-7 w-full rounded-sm bg-primary px-3 py-3 t-label text-on-primary active:scale-98"
              >
                {mainButton.label}
              </button>
            ) : (
              <p className="py-3 text-center t-body-s text-slate">Выберите напиток или выпечку</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 rounded-md bg-night p-5 text-ink-inverse">
          <p className="t-label text-slate-inverse">Экран бариста</p>
          {orders.length === 0 ? (
            <p className="t-body-s text-slate-inverse">Оформите заказ в приложении слева — он появится здесь.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {orders.map((o) => (
                <li key={o.n} className="v-in flex flex-col gap-1 rounded-sm bg-night-raised p-4 t-body-s">
                  <span className="flex items-center gap-2 t-label">
                    <span className="size-2 rounded-pill bg-primary-light" aria-hidden="true" /> Заказ № {o.n}
                  </span>
                  <span>{o.items}</span>
                  <span>Итого: {tenge(o.total)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <a
          href={ownBot.url}
          target="_blank"
          rel="noopener"
          data-fx="press"
          className="flex flex-col gap-1 rounded-md bg-paper p-5 ring-[length:var(--stroke)] ring-line ring-inset"
        >
          <span className="t-label text-slate">Собственный продукт</span>
          <span className="t-heading-s">{ownBot.handle}</span>
          <span className="t-body-s text-slate">Мой {ownBot.what} в Telegram — откройте и попробуйте.</span>
        </a>
      </div>
    </div>
  );
}
