"use client";

import { useRef, useState } from "react";
import {
  categories,
  products,
  shopName,
  sizes,
  milkOptions,
  coffeeCopy,
  type Product,
} from "@/content/demos/miniapp";
import { money } from "@/content/demos/shared";
import { DemoIcon, DemoPhoto, DemoWindow } from "./DemoKit";
import { play } from "@/lib/sfx";
import { haptic } from "@/lib/haptics";
import { ProjectSignature } from "@/components/visuals/ProjectSignature";

type Line = {
  key: string;
  product: Product;
  options: string;
  unit: number;
  qty: number;
};
type Order = {
  id: number;
  lines: Line[];
  total: number;
  status: number;
  pickup: string;
};
type Screen = "menu" | "product" | "cart" | "order";

export default function MiniAppDemo() {
  const [screen, setScreen] = useState<Screen>("menu");
  const [category, setCategory] = useState("coffee");
  const [product, setProduct] = useState(products[0]!);
  const [size, setSize] = useState(0);
  const [milk, setMilk] = useState(0);
  const [cart, setCart] = useState<Line[]>([]);
  const [pickup, setPickup] = useState(coffeeCopy.pickup[0]!);
  const [order, setOrder] = useState<Order | null>(null);
  const [tickets, setTickets] = useState<Order[]>([
    {
      id: 1041,
      lines: [
        {
          key: "sample",
          product: products[1]!,
          options: "300 мл · обычное",
          unit: 1600,
          qty: 1,
        },
      ],
      total: 1600,
      status: 1,
      pickup: "Самовывоз",
    },
  ]);
  const sequence = useRef(1042);
  const count = cart.reduce((sum, l) => sum + l.qty, 0);
  const total = cart.reduce((sum, l) => sum + l.unit * l.qty, 0);
  const isCoffee = product.cat === "coffee";
  const unit =
    product.price +
    (isCoffee
      ? sizes[size]!.add + (product.id === "ame" ? 0 : milkOptions[milk]!.add)
      : 0);

  const openProduct = (p: Product) => {
    setProduct(p);
    setSize(0);
    setMilk(0);
    setScreen("product");
  };
  const add = () => {
    const options = isCoffee
      ? sizes[size]!.label +
        (product.id === "ame"
          ? ""
          : " · " + milkOptions[milk]!.label.toLowerCase())
      : "1 порция";
    const key =
      product.id +
      ":" +
      (isCoffee ? size + ":" + (product.id === "ame" ? 0 : milk) : "portion");
    setCart((lines) =>
      lines.some((l) => l.key === key)
        ? lines.map((l) => (l.key === key ? { ...l, qty: l.qty + 1 } : l))
        : [...lines, { key, product, options, unit, qty: 1 }],
    );
    setScreen("menu");
    play("tick");
    haptic("light");
  };
  const change = (key: string, delta: number) =>
    setCart((lines) =>
      lines
        .map((l) => (l.key === key ? { ...l, qty: l.qty + delta } : l))
        .filter((l) => l.qty > 0),
    );
  const checkout = () => {
    if (!cart.length) return;
    const next = {
      id: sequence.current++,
      lines: [...cart],
      total,
      status: 0,
      pickup,
    };
    setOrder(next);
    setTickets((list) => [next, ...list]);
    setCart([]);
    setScreen("order");
    play("step");
    haptic("success");
  };
  const advance = (id: number) => {
    setTickets((list) =>
      list.map((t) =>
        t.id === id ? { ...t, status: Math.min(2, t.status + 1) } : t,
      ),
    );
    setOrder((o) =>
      o?.id === id ? { ...o, status: Math.min(2, o.status + 1) } : o,
    );
  };

  return (
    <div className="pd coffee-project">
      <div className="pd-project-heading">
        <span className="pd-tag">Mini App + рабочее место бариста</span>
        <span className="pd-subtle">Самовывоз без очереди</span>
      </div>
      <div className="coffee-workspace">
        <div className="coffee-device">
          <div className="coffee-system" aria-hidden="true">
            <span>9:41</span>
            <span className="coffee-island" />
            <span>5G ▰</span>
          </div>
          <div className="coffee-telegram">
            <button
              type="button"
              className="pd-icon-button"
              aria-label="Вернуться в меню"
              onClick={() => setScreen("menu")}
            >
              <DemoIcon name="back" />
            </button>
            <span>
              <strong>{shopName}</strong>
              <small>мини-приложение</small>
            </span>
            <span aria-hidden="true">···</span>
          </div>
          <div className="coffee-scroll" key={screen}>
            {screen === "menu" && (
              <>
                <ProjectSignature id="mini-apps" compact />
                <p className="coffee-address">
                  <DemoIcon name="pin" />
                  {coffeeCopy.address}
                </p>
                <div className="pd-tabs" aria-label="Категории меню">
                  {categories.map((c) => (
                    <button
                      type="button"
                      key={c.id}
                      aria-pressed={category === c.id}
                      onClick={() => setCategory(c.id)}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
                <div className="coffee-products">
                  {products
                    .filter((p) => p.cat === category)
                    .map((p) => (
                      <button
                        type="button"
                        className="coffee-product"
                        key={p.id}
                        onClick={() => openProduct(p)}
                        aria-label={"Выбрать " + p.name}
                      >
                        <div className="coffee-product-photo">
                          <DemoPhoto name={p.photo} alt={p.name} />
                          <span className="coffee-plus">
                            <DemoIcon name="plus" />
                          </span>
                        </div>
                        <strong>{p.name}</strong>
                        <small>{p.note}</small>
                        <b>{money(p.price)}</b>
                      </button>
                    ))}
                </div>
              </>
            )}
            {screen === "product" && (
              <>
                <DemoPhoto
                  name={product.photo}
                  alt={product.name}
                  className="coffee-detail-photo"
                />
                <div className="coffee-detail">
                  <span className="pd-tag">
                    {isCoffee ? "Готовим для вас" : "Свежая выпечка"}
                  </span>
                  <h3>{product.name}</h3>
                  <p>{product.detail}</p>
                  {isCoffee && (
                    <fieldset className="pd-fieldset">
                      <legend>Объём</legend>
                      <div className="pd-options">
                        {sizes.map((s, i) => (
                          <button
                            type="button"
                            key={s.id}
                            aria-pressed={size === i}
                            onClick={() => setSize(i)}
                          >
                            {s.label}
                            <small>{i ? "+" + money(s.add) : "Базовый"}</small>
                          </button>
                        ))}
                      </div>
                    </fieldset>
                  )}
                  {isCoffee && product.id !== "ame" && (
                    <fieldset className="pd-fieldset">
                      <legend>Молоко</legend>
                      <div className="pd-options pd-options--stack">
                        {milkOptions.map((m, i) => (
                          <button
                            type="button"
                            key={m.id}
                            aria-pressed={milk === i}
                            onClick={() => setMilk(i)}
                          >
                            {m.label}
                            <small>
                              {m.add ? "+" + money(m.add) : "Включено"}
                            </small>
                          </button>
                        ))}
                      </div>
                    </fieldset>
                  )}
                </div>
              </>
            )}
            {screen === "cart" && (
              <div className="coffee-detail">
                <span className="pd-tag">Почти готово</span>
                <h3>Ваш заказ</h3>
                {!cart.length && (
                  <div className="pd-empty">
                    <DemoIcon name="bag" />
                    <p>В корзине пока пусто</p>
                    <button
                      type="button"
                      className="pd-button"
                      onClick={() => setScreen("menu")}
                    >
                      Открыть меню
                    </button>
                  </div>
                )}
                {cart.map((l) => (
                  <div className="coffee-cart-line" key={l.key}>
                    <DemoPhoto name={l.product.photo} alt="" />
                    <div>
                      <strong>{l.product.name}</strong>
                      <small>{l.options}</small>
                      <b>{money(l.unit * l.qty)}</b>
                    </div>
                    <div className="pd-quantity">
                      <button
                        type="button"
                        aria-label={"Уменьшить " + l.product.name}
                        onClick={() => change(l.key, -1)}
                      >
                        <DemoIcon name="minus" />
                      </button>
                      <span>{l.qty}</span>
                      <button
                        type="button"
                        aria-label={"Увеличить " + l.product.name}
                        onClick={() => change(l.key, 1)}
                      >
                        <DemoIcon name="plus" />
                      </button>
                    </div>
                  </div>
                ))}
                {!!cart.length && (
                  <>
                    <fieldset className="pd-fieldset">
                      <legend>Когда заберёте?</legend>
                      <select
                        aria-label="Время самовывоза"
                        className="pd-select"
                        value={pickup}
                        onChange={(e) => setPickup(e.target.value)}
                      >
                        {coffeeCopy.pickup.map((p) => (
                          <option key={p}>{p}</option>
                        ))}
                      </select>
                    </fieldset>
                    <div className="coffee-receipt">
                      <span>Оплата при получении</span>
                      <strong>{money(total)}</strong>
                    </div>
                    <p className="pd-subtle">
                      Без онлайн-оплаты. Заказ появится у бариста справа.
                    </p>
                  </>
                )}
              </div>
            )}
            {screen === "order" && order && (
              <div className="coffee-order" aria-live="polite">
                <span className="coffee-success">
                  <DemoIcon name={order.status === 2 ? "check" : "coffee"} />
                </span>
                <span className="pd-tag">
                  Самовывоз · {order.pickup.toLowerCase()}
                </span>
                <h3>№ {order.id}</h3>
                <h4>{coffeeCopy.status[order.status]}</h4>
                <p>
                  {order.status === 2
                    ? "Ваш кофе ждёт на стойке. Хорошего дня!"
                    : "На экране бариста можно перевести заказ на следующий этап."}
                </p>
                <ol className="coffee-tracker">
                  {coffeeCopy.status.map((s, i) => (
                    <li key={s} data-complete={i <= order.status}>
                      <span>
                        {i < order.status ? <DemoIcon name="check" /> : i + 1}
                      </span>
                      {s}
                    </li>
                  ))}
                </ol>
                <div className="coffee-receipt">
                  <span>К оплате на кассе</span>
                  <strong>{money(order.total)}</strong>
                </div>
              </div>
            )}
          </div>
          <div className="coffee-bottom">
            {screen === "product" ? (
              <button
                type="button"
                className="coffee-main-button"
                onClick={add}
              >
                Добавить в заказ <span>{money(unit)}</span>
              </button>
            ) : screen === "cart" && count > 0 ? (
              <button
                type="button"
                className="coffee-main-button"
                onClick={checkout}
              >
                Подтвердить заказ <span>{money(total)}</span>
              </button>
            ) : screen === "order" ? (
              <button
                type="button"
                className="coffee-main-button"
                onClick={() => setScreen("menu")}
              >
                Вернуться в меню
                <DemoIcon name="arrow" />
              </button>
            ) : (
              <button
                type="button"
                className="coffee-main-button"
                onClick={() => setScreen("cart")}
              >
                <span>
                  <DemoIcon name="bag" />
                  Корзина{count ? " · " + count : ""}
                </span>
                <span>{count ? money(total) : "Открыть"}</span>
              </button>
            )}
            <span className="coffee-home-indicator" aria-hidden="true" />
          </div>
        </div>
        <DemoWindow title="MOLA / заказы" className="coffee-kitchen">
          <div className="coffee-kitchen-header">
            <span>
              <strong>Бариста</strong>
              <small>Смена открыта · точка на Абая</small>
            </span>
            <span className="pd-status">
              {tickets.filter((t) => t.status < 2).length} в работе
            </span>
          </div>
          <div className="coffee-ticket-list" aria-live="polite">
            {tickets.map((t) => (
              <article
                className="coffee-ticket"
                key={t.id}
                data-active={t.id === order?.id}
              >
                <header>
                  <strong>№ {t.id}</strong>
                  <span
                    className={
                      "pd-badge " + (t.status === 2 ? "pd-badge--success" : "")
                    }
                  >
                    {coffeeCopy.status[t.status]}
                  </span>
                </header>
                {t.lines.map((l) => (
                  <p key={l.key}>
                    <b>{l.qty}×</b>
                    <span>
                      {l.product.name}
                      <small>{l.options}</small>
                    </span>
                  </p>
                ))}
                <footer>
                  <span>{money(t.total)}</span>
                  {t.status < 2 ? (
                    <button
                      type="button"
                      className="pd-button pd-button--small"
                      onClick={() => advance(t.id)}
                    >
                      {t.status === 0 ? "Начать готовить" : "Заказ готов"}
                    </button>
                  ) : (
                    <span className="pd-success-text">
                      <DemoIcon name="check" />
                      Готов к выдаче
                    </span>
                  )}
                </footer>
              </article>
            ))}
          </div>
          <p className="pd-footnote">
            Закажите в приложении - новая карточка появится здесь.
          </p>
        </DemoWindow>
      </div>
      <p className="pd-disclaimer">
        Демонстрационный проект кофейни. Заказ и статусы работают в браузере.
      </p>
    </div>
  );
}
