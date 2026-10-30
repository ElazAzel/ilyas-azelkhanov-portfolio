import { SITE_URL } from "./base-path";

/** SITE_URL already includes the deployment subdirectory when hosted on Pages. */
export const canonicalFor = (path: string) => ({
  canonical: `${SITE_URL}${path}`,
});
