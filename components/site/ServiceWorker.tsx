"use client";

import { useEffect } from "react";
import { BASE_PATH } from "@/lib/base-path";

/** Registers public/sw.js in production builds only (offline page + static cache). */
export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    const register = () => navigator.serviceWorker.register(`${BASE_PATH}/sw.js`, { scope: `${BASE_PATH}/` }).catch(() => {});
    if (document.readyState === "complete") register();
    else addEventListener("load", register, { once: true });
  }, []);
  return null;
}
