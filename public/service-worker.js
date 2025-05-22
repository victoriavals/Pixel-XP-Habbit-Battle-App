// public/service-worker.js
const CACHE_NAME = 'pixel-xp-cache-v1';
const urlsToCache = [
  '/',
  '/manifest.webmanifest',
  // Add other critical assets if known.
  // Next.js handles its own caching for JS/CSS chunks effectively.
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // It's often better to not aggressively cache all URLs during install
        // as Next.js bundles can change frequently.
        // Let's cache only the minimal shell.
        return cache.addAll(urlsToCache.filter(url => url === '/' || url === '/manifest.webmanifest'));
      })
      .catch(error => {
        console.error('Failed to cache during install:', error);
      })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  // For navigation requests, try network first, then cache, then offline page (optional)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(event.request))
        .catch(() => caches.match('/offline.html')) // Optional: provide an offline fallback page
    );
    return;
  }

  // For other requests (assets), use cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Cache hit - return response
        }
        // Not in cache, fetch and cache
        return fetch(event.request).then(
          networkResponse => {
            // Check if we received a valid response
            if(!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return networkResponse;
          }
        );
      }
    ).catch(error => {
      console.error('Fetch error:', error);
      // Optionally, return a fallback for specific asset types if needed
    })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});
