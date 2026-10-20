import { Logo } from "@/components/brand/Logo";

export const metadata = { robots: { index: false } };

// Placeholder until Phase 3 (home page). Only /style is part of Phase 1.
export default function Home() {
  return (
    <main className="container-page flex min-h-dvh flex-col items-start justify-center gap-6">
      <Logo className="w-10" />
      <p className="t-body-l text-slate">Сайт в разработке.</p>
      <a href="/style/" className="link t-label">
        Дизайн-система
      </a>
    </main>
  );
}
