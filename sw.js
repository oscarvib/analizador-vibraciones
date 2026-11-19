/* Service worker del Analizador de vibraciones: la app completa se guarda en caché y funciona sin conexión.
   IMPORTANTE: todas las apps de oscarvib.github.io comparten el mismo almacén de cachés, por eso esta solo
   gestiona (y borra) cachés con su propio prefijo. Cambia CACHE al publicar una versión nueva. */
const PREFIX = 'analizador-vibraciones-';
const CACHE = PREFIX + '2.2';
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'icon.svg', 'icon.png', 'icon-192.png', 'icon-512.png'];

async function precache() {
  const c = await caches.open(CACHE);
  await Promise.all(FILES.map(f => c.add(new Request(f, { cache: 'reload' })).catch(() => null)));
}
self.addEventListener('install', e => { e.waitUntil(precache().then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k.startsWith(PREFIX) && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('message', e => { if (e.data === 'recache') e.waitUntil(precache()); });
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith((async () => {
    const c = await caches.open(CACHE);                      // solo MI caché, nunca la de otras apps
    const hit = await c.match(req, { ignoreSearch: true });
    const net = fetch(req).then(r => { if (r && r.ok) c.put(req, r.clone()); return r; });
    if (hit) { e.waitUntil(net.catch(() => null)); return hit; }   // copia guardada primero; se actualiza en segundo plano
    try { return await net; }
    catch (_) {
      if (req.mode === 'navigate') return (await c.match('index.html')) || (await c.match('./')) || Response.error();
      return Response.error();
    }
  })());
});
