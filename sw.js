const CACHE_NAME = 'prairie-preludes-creator-studio-2.0.09';
const APP_FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './prairie-preludes-logo.png',
  './icon-192.png',
  './icon-512.png'
];
// Only retire cache namespaces belonging to Prairie Preludes; leave unrelated site caches alone.
const PRAIRIE_CACHE = /^prairie-preludes-(?:creator-studio-|2\.0\.01$|2\.0\.02$|2\.0\.03$|2\.0\.04$|1\.0\.)/;

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(APP_FILES);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter(key => key !== CACHE_NAME && PRAIRIE_CACHE.test(key))
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const navigation = request.mode === 'navigate';

    if (navigation) {
      try {
        const response = await fetch(request, { cache: 'no-store' });
        if (response && response.ok) await cache.put(request, response.clone());
        return response;
      } catch (error) {
        return (await cache.match(request, { ignoreSearch: true })) ||
          (await cache.match('./index.html'));
      }
    }

    const cached = await cache.match(request, { ignoreSearch: true });
    if (cached) return cached;

    try {
      const response = await fetch(request, { cache: 'no-store' });
      if (response && response.ok) await cache.put(request, response.clone());
      return response;
    } catch (error) {
      return (await cache.match('./index.html')) || Response.error();
    }
  })());
});
