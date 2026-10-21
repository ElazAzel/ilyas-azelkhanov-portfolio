import type { ServiceId } from "@/content/pricing";
import { projectArt } from "@/content/demos/art";
import { ProjectSculpture } from "./ProjectSculpture";

export function ProjectSignature({
  id,
  compact = false,
  active = false,
}: {
  id: ServiceId;
  compact?: boolean;
  active?: boolean;
}) {
  const art = projectArt[id];
  return (
    <div
      className={`project-signature signature--${id} ${compact ? "signature--compact" : ""}`}
      data-active={active}
    >
      <div className="signature-copy">
        <span>{art.category}</span>
        <h3>
          {art.title[0]}
          <br />
          {art.title[1]}
        </h3>
        <p>{art.note}</p>
      </div>
      <ProjectSculpture id={id} />
      <span className="signature-brand" aria-hidden="true">
        {art.brand}
      </span>
      <span className="signature-cross" aria-hidden="true">
        +
      </span>
    </div>
  );
}
