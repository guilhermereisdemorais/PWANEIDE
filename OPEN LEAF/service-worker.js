// Open Leaf — Service Worker PWA
const CACHE = 'openleaf-v2';
const FILES = [
  '/splash.html', '/login.html', '/biblioteca.html',
  '/detalhes.html', '/loja.html', '/perfil.html',
  '/style.css', '/lang.js', '/theme.js', '/cart.js',
  '/biblioteca.js', '/manifest.json',
  '/imagens/open logo.png', '/icon-192.png', '/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('/api/')) return; // Não cacheia API
  e.respondWith(
    caches.match(e.request).then(cached =>
      cached || fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }).catch(() => caches.match('/splash.html'))
    )
  );
});
