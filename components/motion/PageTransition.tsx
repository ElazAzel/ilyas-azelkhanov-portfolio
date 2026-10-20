"use client";

import { useEffect, useRef, ViewTransition, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { play } from "@/lib/sfx";
import { haptic } from "@/lib/haptics";

/**
 * S2: the page wipe runs only on navigation. Keying by pathname makes the old and the new page
 * a shared pair named "az-page"; in-page updates do not animate (default="none").
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    play("whoosh");
    haptic("light");
  }, [pathname]);
  return (
    <ViewTransition key={pathname} name="az-page" share="az-page" default="none">
      <div className="min-h-dvh bg-paper">{children}</div>
    </ViewTransition>
  );
}
