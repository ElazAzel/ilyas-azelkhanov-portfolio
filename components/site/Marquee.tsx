"use client";

import { useId, useState } from "react";
import { venues, partnerCopy } from "@/content/partners";
import { PartnerLogo } from "./PartnerLogo";

const rows = [venues.filter((v) => v.group === "business"), venues.filter((v) => v.group === "education")];

export function Marquee({ compact = false }: { compact?: boolean }) {
  const [paused, setPaused] = useState(false);
  const id = useId();
  return (
    <section aria-labelledby={`${id}-title`} className={`partners ${compact ? "partners--compact" : ""}`} data-paused={paused}>
      <div className={compact ? "partners-heading" : "container-page partners-heading"}>
        <div>
          <p className="partners-intro t-label text-slate">{partnerCopy.lead}</p>
          <h2 id={`${id}-title`} className="t-display-l">{partnerCopy.title}<span aria-hidden="true" className="partners-period">.</span></h2>
        </div>
        {!compact ? (
          <button type="button" className="partners-pause" onClick={() => setPaused((v) => !v)} aria-pressed={paused} aria-label={paused ? partnerCopy.play : partnerCopy.pause}>
            {paused ? <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m9 5 11 7-11 7z" /></svg> : <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5h3v14H7zm7 0h3v14h-3z" /></svg>}
          </button>
        ) : null}
      </div>
      {!compact ? (
        <div className="partners-window" aria-hidden="true">
          {rows.map((row, i) => (
            <div className={`partners-lane ${i === 1 ? "partners-lane--reverse" : ""}`} key={i}>
              {[0, 1].map((copy) => (
                <ul className="partners-track" key={copy}>
                  {row.map((venue) => <li className="partner-tile" key={venue.name}><PartnerLogo venue={venue} /></li>)}
                </ul>
              ))}
            </div>
          ))}
        </div>
      ) : null}
      <div className={compact ? "" : "container-page"}>
        <details className="partners-directory" open={compact || undefined}>
          <summary><span className="partners-show">{partnerCopy.all}</span><span className="partners-hide">{partnerCopy.collapse}</span><span className="partners-plus" aria-hidden="true" /></summary>
          <ul className="partners-grid">
            {venues.map((venue) => <li className="partner-tile" key={venue.name}><PartnerLogo venue={venue} /></li>)}
          </ul>
        </details>
      </div>
    </section>
  );
}
