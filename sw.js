/* Service worker: la aplicación completa se guarda en caché y funciona sin conexión.
   Cambia VERSION al publicar una versión nueva para que se actualice la copia guardada. */
const VERSION = 'vib-2.1';
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'icon.svg', 'icon.png', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, {ignoreSearch: true}).then(hit => {
      const net = fetch(e.request).then(r => {
        if (r && r.ok && new URL(e.request.url).origin === location.origin) { const cp = r.clone(); caches.open(VERSION).then(c => c.put(e.request, cp)); }
        return r;
      }).catch(() => hit || (e.request.mode === 'navigate' ? caches.match('index.html') : undefined));
      return hit || net;
    })
  );
});
