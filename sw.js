// CADA VEZ QUE HAGAS UN CAMBIO EN TU APP, CAMBIA ESTE NÚMERO (ej. v3, v4, v5...)
const CACHE_NAME = 'live-english-v3';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // Fuerza a que la nueva versión se instale inmediatamente
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  // Cuando se activa la nueva versión, borra el caché de las versiones anteriores (como la v1)
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Borrando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  // Estrategia: "Red primero, caché como respaldo". 
  // Siempre intentará traer los datos nuevos de Vercel. Si no hay internet, usa la memoria.
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
