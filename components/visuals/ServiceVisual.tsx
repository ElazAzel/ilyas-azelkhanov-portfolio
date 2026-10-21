import type { ServiceId } from "@/content/pricing";
import { products } from "@/content/demos/miniapp";
import { artEvidence, projectArt } from "@/content/demos/art";
import { DemoIcon, DemoPhoto } from "@/components/demos/DemoKit";
import { money } from "@/content/demos/shared";
import { ProjectSculpture } from "./ProjectSculpture";

export function ServiceVisual({
  id,
  className = "",
}: {
  id: ServiceId;
  className?: string;
}) {
  const art = projectArt[id];
  return (
    <div
      aria-hidden="true"
      className={`service-visual project-preview concept-cover cover--${id} relative overflow-hidden ${className}`}
    >
      <div className="concept-masthead">
        <strong>{art.brand}</strong>
        <span>{art.category}</span>
      </div>
      <div className="concept-title">
        {art.title[0]}
        <br />
        {art.title[1]}
      </div>
      <ProjectSculpture id={id} />
      {id === "mini-apps" && (
        <>
          <div className="concept-coffee-photo">
            <DemoPhoto name="cappuccino" alt="" />
          </div>
          <span className="concept-stamp">
            Самовывоз
            <br />
            без очереди
          </span>
          <div className="concept-proof proof--coffee">
            <DemoIcon name="bag" />
            <span>
              <b>{products[0]!.name}</b>
              <small>{money(products[0]!.price)} · 200 мл</small>
            </span>
            <DemoIcon name="plus" />
          </div>
        </>
      )}
      {id === "bots" && (
        <>
          <div className="concept-racing-line" />
          <div className="concept-proof proof--booking">
            <span className="concept-check">
              <DemoIcon name="check" />
            </span>
            <span>
              <b>{artEvidence.booking}</b>
              <small>{artEvidence.slot}</small>
            </span>
            <DemoIcon name="car" />
          </div>
        </>
      )}
      {id === "automation" && (
        <>
          <svg className="concept-wires" viewBox="0 0 500 400" fill="none">
            <path d="M-20 110h125q40 0 40 40v80q0 35 40 35h90q40 0 40 40v110M520 40H390q-40 0-40 40v55q0 40-40 40h-50" />
          </svg>
          <span className="concept-input">
            <DemoIcon name="send" />
            {artEvidence.incoming}
          </span>
          <div className="concept-proof proof--flow">
            <span className="concept-check">
              <DemoIcon name="check" />
            </span>
            <span>
              <b>435 000 ₸</b>
              <small>{artEvidence.result}</small>
            </span>
            <DemoIcon name="grid" />
          </div>
        </>
      )}
      {id === "websites" && (
        <>
          <div className="concept-interior-photo">
            <DemoPhoto name="interior" alt="" />
          </div>
          <span className="concept-vertical">{art.note}</span>
          <div className="concept-proof proof--interior">
            <span>{artEvidence.interior}</span>
            <DemoIcon name="arrow" />
          </div>
        </>
      )}
      {id === "training" && (
        <div className="concept-proof proof--program">
          <header>
            <b>{artEvidence.program}</b>
            <DemoIcon name="file" />
          </header>
          {artEvidence.topics.map((topic, i) => (
            <p key={topic}>
              <span>{i + 1}</span>
              {topic}
              <DemoIcon name="check" />
            </p>
          ))}
        </div>
      )}
      <span className="concept-footer">
        {id === "training" ? art.note : artEvidence.sample}
      </span>
      <span className="concept-corner">+</span>
    </div>
  );
}
