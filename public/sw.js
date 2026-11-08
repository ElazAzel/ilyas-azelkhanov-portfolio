// Minimal service worker: pages network-first with an offline fallback, static assets cache-first.
// Never caches messenger links, forms or anything cross-origin (CLAUDE.md → Mobile / PWA).
const VERSION = "az-v1";
const BASE = new URL(self.registration.scope).pathname.replace(/\/$/, "");
const OFFLINE = `${BASE}/offline/`;

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll([OFFLINE, `${BASE}/icon-192.png`])).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== self.location.origin || url.pathname.startsWith(`${BASE}/api/`)) return;

  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          if (res.ok) caches.open(VERSION).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((hit) => hit || caches.match(OFFLINE))),
    );
    return;
  }

  // Hashed build files, fonts, frames and images never change under the same URL.
  if (/\/_next\/static\/|\/fonts\/|\/media\/|\.(?:png|webp|avif|svg|woff2)$/.test(url.pathname)) {
    e.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            const copy = res.clone();
            if (res.ok) caches.open(VERSION).then((c) => c.put(req, copy));
            return res;
          }),
      ),
    );
  }
});
