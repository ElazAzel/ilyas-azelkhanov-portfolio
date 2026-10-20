"use client";

import { useState } from "react";

type Props = { legend: string; options: string[]; initial?: string };

/** Single-choice chips, as in the brief. Selected = primary pill (key state). */
export function ChoiceGroup({ legend, options, initial }: Props) {
  const [value, setValue] = useState(initial ?? options[0]);
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-3 t-label">{legend}</legend>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={legend}>
        {options.map((o) => {
          const on = o === value;
          return (
            <button
              key={o}
              type="button"
              role="radio"
              data-fx="select"
              aria-checked={on}
              onClick={() => setValue(o)}
              className={
                "min-h-7 rounded-pill px-5 py-3 t-label transition-[background-color,color] duration-[var(--dur-quick)] " +
                (on
                  ? "bg-primary text-on-primary"
                  : "bg-paper text-ink ring-[length:var(--stroke)] ring-line ring-inset hover:ring-ink")
              }
            >
              {o}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
