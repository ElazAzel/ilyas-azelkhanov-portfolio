import Link from "next/link";

export default function OfflinePage() {
  return <section className="page-section"><div className="shell empty-state"><span className="eyebrow">OFFLINE</span><h1>Соединение прервалось.</h1><p>Часть уже открытых страниц доступна. Проверьте сеть и попробуйте снова.</p><Link className="button" href="/">Попробовать снова</Link></div></section>;
}
