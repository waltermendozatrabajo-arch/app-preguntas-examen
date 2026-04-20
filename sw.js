const CACHE_NAME = 'flashcards-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './preguntas.json',
  './icons/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap'
];

// Instalar Service Worker y cachear recursos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cache abierto');
      return cache.addAll(ASSETS);
    })
  );
});

// Activar y limpiar caches antiguos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptar peticiones para servir desde cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Retornar desde cache si existe, si no, ir a la red
      return response || fetch(event.request).then((networkResponse) => {
        // Opcional: Cachear dinámicamente nuevas peticiones
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    }).catch(() => {
      // Si falla todo (offline y no en cache), podrías retornar una página offline genérica
      if (event.request.mode === 'navigate') {
        return caches.match('./index.html');
      }
    })
  );
});