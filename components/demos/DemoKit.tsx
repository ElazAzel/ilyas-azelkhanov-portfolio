import type { ReactNode } from "react";
import { BASE_PATH } from "@/lib/base-path";

type IconName =
  | "plus"
  | "minus"
  | "back"
  | "check"
  | "bag"
  | "clock"
  | "pin"
  | "send"
  | "bolt"
  | "file"
  | "calendar"
  | "download"
  | "refresh"
  | "search"
  | "coffee"
  | "car"
  | "arrow"
  | "close"
  | "grid"
  | "chevron";
const paths: Record<IconName, string> = {
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  back: "m14 6-6 6 6 6",
  check: "m5 12 4 4L19 6",
  bag: "M5 7h14l1 14H4L5 7ZM9 8V5a3 3 0 0 1 6 0v3",
  clock: "M12 8v4l3 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0",
  pin: "M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
  send: "m22 2-7 20-4-9-9-4L22 2ZM22 2 11 13",
  bolt: "m13 2-9 12h7l-1 8 10-12h-7l1-8",
  file: "M14 2H4v20h16V8l-6-6ZM14 2v6h6M8 13h8M8 17h5",
  calendar: "M4 5h16v16H4V5ZM8 2v6M16 2v6M4 10h16M8 14h2M14 14h2",
  download: "M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5",
  refresh: "M20 7v5h-5M4 17v-5h5M20 12a8 8 0 0 0-14-5M4 12a8 8 0 0 0 14 5",
  search: "m21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
  coffee:
    "M3 8h14v7a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8ZM17 8h2a3 3 0 0 1 0 6h-2M6 2v3M10 2v3M14 2v3",
  car: "m5 5 2-3h10l2 3 2 5v8H3v-8l2-5ZM4 10h16M6 14h2M16 14h2M5 18v3M19 18v3",
  arrow: "M5 12h14m-6-6 6 6-6 6",
  close: "m6 6 12 12M6 18 18 6",
  grid: "M3 3h7v7H3V3ZM14 3h7v7h-7V3ZM3 14h7v7H3v-7ZM14 14h7v7h-7v-7",
  chevron: "m6 9 6 6 6-6",
};
export function DemoIcon({
  name,
  className = "",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      className={`pd-icon ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}
export function DemoPhoto({
  name,
  alt,
  className = "",
}: {
  name: string;
  alt: string;
  className?: string;
}) {
  return (
    <img
      className={`pd-photo ${className}`}
      src={`${BASE_PATH}/demo-media/${name}.webp`}
      alt={alt}
      width={800}
      height={600}
      loading="lazy"
      decoding="async"
    />
  );
}
export function DemoWindow({
  title,
  children,
  className = "",
  action,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}) {
  return (
    <section className={`pd-window ${className}`} aria-label={title}>
      <div className="pd-window-bar">
        <span className="pd-window-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="pd-window-title">{title}</span>
        {action || (
          <span className="pd-live">
            <i />
            Интерактивно
          </span>
        )}
      </div>
      {children}
    </section>
  );
}
