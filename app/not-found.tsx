import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return <section className="page-section"><div className="shell empty-state"><span className="eyebrow">404</span><h1>Эта страница пока не стала продуктом.</h1><p>Вернитесь к проектам — там есть что исследовать.</p><Link className="button" href="/projects"><ArrowLeft /> К проектам</Link></div></section>;
}
