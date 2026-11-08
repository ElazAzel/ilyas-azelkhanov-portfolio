"use client";

import Script from "next/script";
import { useEffect } from "react";
import { goal, YM_ID } from "@/lib/analytics";

/** Metrica counter + goals for messenger clicks and demo use. Renders nothing without NEXT_PUBLIC_YM_ID. */
export function Analytics() {
  useEffect(() => {
    if (!YM_ID) return;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]");
      const href = a?.getAttribute("href") ?? "";
      if (href.includes("wa.me")) goal("whatsapp");
      else if (href.includes("t.me")) goal("telegram");
    };
    // First interaction inside a demo counts once per demo per page view.
    const seen = new Set<string>();
    const onDemo = (e: Event) => {
      const el = (e.target as Element | null)?.closest?.("[data-demo]");
      const id = el?.getAttribute("data-demo");
      if (id && !seen.has(id)) {
        seen.add(id);
        goal(`demo-${id}`);
      }
    };
    document.addEventListener("click", onClick, { capture: true });
    document.addEventListener("pointerdown", onDemo, { capture: true });
    // Field Core Web Vitals as visit params.
    import("web-vitals").then(({ onLCP, onINP, onCLS }) => {
      const send = (m: { name: string; value: number }) =>
        (window as unknown as { ym?: (...a: unknown[]) => void }).ym?.(YM_ID, "params", { cwv: { [m.name]: Math.round(m.name === "CLS" ? m.value * 1000 : m.value) } });
      onLCP(send);
      onINP(send);
      onCLS(send);
    });
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      document.removeEventListener("pointerdown", onDemo, { capture: true });
    };
  }, []);

  if (!YM_ID) return null;
  return (
    <Script id="yandex-metrica" strategy="lazyOnload">
      {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");ym(${YM_ID},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true});`}
    </Script>
  );
}
