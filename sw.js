const CACHE_NAME = 'live-english-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Instala el Service Worker y guarda los archivos básicos en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Intercepta las peticiones para que la app funcione más rápido (requisito de las PWA)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Devuelve el archivo en caché si existe, o si no, lo descarga de internet
        return response || fetch(event.request);
      })
  );
});
