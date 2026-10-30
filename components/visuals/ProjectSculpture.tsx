import type { ServiceId } from "@/content/pricing";
import { BASE_PATH } from "@/lib/base-path";

/** Projected 3D surfaces with lighting. Vectors remain sharp at every viewport. */
export function ProjectSculpture({
  id,
  className = "",
}: {
  id: ServiceId;
  className?: string;
}) {
  return (
    <div
      className={`project-sculpture sculpture--${id} ${className}`}
      aria-hidden="true"
    >
      <div className="sculpture-shadow" />
      {id === "websites" ? (
        <svg className="sculpture-object" viewBox="0 0 400 400" fill="none">
          <path
            d="M78 344V167a122 122 0 0 1 244 0v177h-61V167a61 61 0 0 0-122 0v177H78Z"
            fill="var(--sculpture-shadow)"
            transform="translate(28 -20)"
          />
          <path
            d="m322 344 28-20V147a122 122 0 0 0-56-103l-28 20a122 122 0 0 1 56 103v177Z"
            fill="var(--sculpture-mid)"
          />
          <path
            d="M78 344V167a122 122 0 0 1 244 0v177h-61V167a61 61 0 0 0-122 0v177H78Z"
            fill="var(--sculpture-light)"
          />
          <path
            d="m139 344 28-20V147a61 61 0 0 1 56-61 61 61 0 0 0-84 57v201Z"
            fill="var(--sculpture-mid)"
          />
          {Array.from({ length: 15 }, (_, i) => (
            <path
              key={i}
              d={`M${81 + i * 4} 342V167a${119 - i * 4} ${119 - i * 4} 0 0 1 ${238 - i * 8} 0v175`}
              stroke="var(--sculpture-shadow)"
              strokeOpacity=".14"
              strokeWidth=".6"
            />
          ))}
        </svg>
      ) : (
        <img
          className="sculpture-object"
          src={`${BASE_PATH}/media/sculptures/${id}.svg`}
          alt=""
          width={400}
          height={400}
          decoding="async"
        />
      )}
      <span className="sculpture-orbit" />
    </div>
  );
}
