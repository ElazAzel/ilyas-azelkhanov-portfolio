// The motion prototype grew into the home page; /lab stays as an alias for links already shared.
import type { Metadata } from "next";

export { default } from "../page";

export const metadata: Metadata = { robots: { index: false } };
