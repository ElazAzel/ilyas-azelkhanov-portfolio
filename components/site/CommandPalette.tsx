"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { commandCopy, commands, type Command } from "@/content/commands";
import { contacts } from "@/content/contacts";
import { BASE_PATH } from "@/lib/base-path";
import { play, setSoundEnabled, soundEnabled } from "@/lib/sfx";
import { haptic } from "@/lib/haptics";

// Typed with the wrong keyboard layout: "cfqn" → "сайт". Both variants are searched.
const EN = "`qwertyuiop[]asdfghjkl;'zxcvbnm,.";
const RU = "ёйцукенгшщзхъфывапролджэячсмитьбю";
const swap = (s: string) =>
  [...s].map((c) => {
    const i = EN.indexOf(c);
    if (i >= 0) return RU[i];
    const j = RU.indexOf(c);
    return j >= 0 ? EN[j] : c;
  }).join("");
const norm = (s: string) => s.toLowerCase().replace(/ё/g, "е");

function matches(c: Command, q: string): boolean {
  if (!q) return true;
  const hay = norm(`${c.label} ${c.hint ?? ""} ${c.keywords ?? ""} ${c.group}`);
  const test = (query: string) => norm(query).split(/\s+/).filter(Boolean).every((w) => hay.includes(w));
  return test(q) || test(swap(norm(q)));
}

const GROUPS: Command["group"][] = ["Действия", "Услуги", "Демо", "Страницы"];

/** ⌘K palette: pages, services with prices, demos and quick actions. Loaded on first open only. */
export default function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const router = useRouter();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const [toast, setToast] = useState("");

  const results = useMemo(() => {
    const found = commands.filter((c) => matches(c, q.trim()));
    return GROUPS.flatMap((g) => found.filter((c) => c.group === g));
  }, [q]);

  useLayoutEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
      setQ("");
      setActive(0);
      setToast("");
      input.current?.focus();
    } else if (!open && el.open) el.close();
  }, [open]);

  useEffect(() => setActive(0), [q]);
  useEffect(() => {
    list.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const run = async (c: Command) => {
    play("press");
    haptic("medium");
    if (c.action === "copy-phone") {
      try {
        await navigator.clipboard.writeText(`+${contacts.whatsapp.number}`);
        setToast(`Скопировано: ${contacts.whatsapp.display}`);
      } catch {
        setToast(contacts.whatsapp.display);
      }
      return;
    }
    if (c.action === "toggle-sound") {
      const on = !soundEnabled();
      setSoundEnabled(on);
      setToast(on ? "Звук включён" : "Звук выключен");
      return;
    }
    onClose();
    if (!c.href) return;
    if (c.external) window.open(c.href.startsWith("/") ? `${BASE_PATH}${c.href}` : c.href, "_blank", "noopener");
    else router.push(c.href);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % Math.max(1, results.length));
      play("tick");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a - 1 + results.length) % Math.max(1, results.length));
      play("tick");
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      void run(results[active]!);
    }
  };

  let lastGroup = "";
  return (
    <dialog
      ref={dialog}
      className="cmdk-dialog"
      aria-label={commandCopy.open}
      data-lenis-prevent
      onClose={onClose}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === dialog.current) onClose();
      }}
    >
      <div className="flex max-h-[inherit] flex-col" onKeyDown={onKey}>
        <div className="flex items-center gap-3 border-b border-line px-5">
          <svg viewBox="0 0 24 24" className="size-5 shrink-0 text-slate" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="6.5" />
            <path d="m16 16 4 4" />
          </svg>
          <input
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={commandCopy.placeholder}
            role="combobox"
            aria-expanded="true"
            aria-controls="cmdk-list"
            aria-activedescendant={results[active] ? `cmdk-${results[active]!.id}` : undefined}
            autoComplete="off"
            spellCheck={false}
            className="min-h-8 w-full bg-transparent t-body-l placeholder:text-slate focus:outline-none"
          />
          <kbd className="kbd max-md:hidden">Esc</kbd>
        </div>

        <ul ref={list} id="cmdk-list" role="listbox" className="flex-1 overflow-y-auto overscroll-contain p-2">
          {results.length === 0 ? <li className="px-4 py-6 t-body-m text-slate">{commandCopy.empty}</li> : null}
          {results.map((c, i) => {
            const header = c.group !== lastGroup ? c.group : null;
            lastGroup = c.group;
            return (
              <li key={c.id} role="presentation">
                {header ? <p className="px-4 pt-4 pb-2 t-body-s text-slate">{header}</p> : null}
                <div
                  id={`cmdk-${c.id}`}
                  role="option"
                  data-index={i}
                  aria-selected={i === active}
                  onMouseMove={() => i !== active && setActive(i)}
                  onClick={() => void run(c)}
                  className="cmdk-item flex min-h-7 cursor-pointer items-center justify-between gap-4 rounded-sm px-4 py-3"
                >
                  <span className="t-label">{c.label}</span>
                  <span className="flex items-center gap-3">
                    {c.hint ? <span className="t-body-s text-slate">{c.hint}</span> : null}
                    <kbd className="cmdk-enter kbd max-md:hidden">↵</kbd>
                  </span>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center justify-between gap-4 border-t border-line px-5 py-3 t-body-s text-slate">
          <span aria-live="polite">{toast || "↑ ↓ - выбрать, Enter - открыть"}</span>
          <span className="max-md:hidden">
            <kbd className="kbd">Ctrl</kbd> <kbd className="kbd">K</kbd>
          </span>
        </div>
      </div>
    </dialog>
  );
}
