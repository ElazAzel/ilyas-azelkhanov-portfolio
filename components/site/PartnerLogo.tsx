"use client";

import { useEffect, useRef, useState } from "react";
import type { Venue } from "@/content/partners";
import { BASE_PATH } from "@/lib/base-path";

/** Keep a readable name if an asset fails; never synthesize a brand mark. */
export function PartnerLogo({ venue }: { venue: Venue }) {
  const [failed, setFailed] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    // An exported HTML image can fail before React attaches its error handler.
    const image = imageRef.current;
    if (image?.complete && image.naturalWidth === 0) setFailed(true);
  }, []);
  const hasLogo = venue.logo && !failed;
  return (
    <div
      className={`partner-logo ${venue.dark && hasLogo ? "partner-logo--dark" : ""} ${venue.mark ? "partner-logo--mark" : ""} ${venue.crop ? "partner-logo--cropped" : ""}`}
    >
      {hasLogo ? (
        <img
          ref={imageRef}
          src={`${BASE_PATH}/logos/${venue.logo}`}
          alt={venue.mark ? "" : venue.name}
          width={180}
          height={64}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : null}
      {!hasLogo || venue.mark ? <span>{venue.name}</span> : null}
    </div>
  );
}
