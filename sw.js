/* Kompas mobil 1.1: aplikacija radi i bez interneta (prikazuje poslednje podatke). Binance ide mimo keša. */
const V = "kompas-mobil-1.1";
const SHELL = ["./", "index.html", "lightweight-charts.js", "manifest.webmanifest","ikone/ikona-192.png", "ikone/ikona-512.png", "ikone/apple-touch-icon.png"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(V).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then((r) => { const copy = r.clone(); caches.open(V).then((c) => c.put(e.request, copy)); return r; })
    .catch(() => caches.match(e.request).then((r) => r || caches.match("index.html"))));
});
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((ws) => (ws.length ? ws[0].focus() : self.clients.openWindow("./"))));
});
