// Deploy base path: "" on azelkhanov.kz, "/ilyas-azelkhanov-portfolio" on the GitHub Pages preview.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// Canonical origin: azelkhanov.kz in production; the Pages preview sets NEXT_PUBLIC_SITE_URL in the workflow.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://azelkhanov.kz").replace(/\/$/, "");
