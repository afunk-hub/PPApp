const CACHE_NAME = 'prairie-preludes-creator-studio-2.0.03';
const APP_FILES = ['./', './index.html', './PrairiePreludes2.0.03.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
const OLD_APP_CACHE = /^prairie-preludes-(?:creator-studio-|1\.0\.|2\.0\.)/;

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
    await Promise.all(keys.filter(key => key !== CACHE_NAME && OLD_APP_CACHE.test(key)).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const isNavigation = request.mode === 'navigate';
    if (isNavigation) {
      try {
        const fresh = await fetch(request, { cache: 'no-store' });
        if (fresh && fresh.ok) await cache.put(request, fresh.clone());
        return fresh;
      } catch (error) {
        return (await cache.match(request, { ignoreSearch: true })) ||
          (await cache.match('./index.html')) ||
          (await cache.match('./PrairiePreludes2.0.03.html'));
      }
    }
    const cached = await cache.match(request, { ignoreSearch: true });
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response && response.ok) await cache.put(request, response.clone());
      return response;
    } catch (error) {
      return (await cache.match('./index.html')) || (await cache.match('./PrairiePreludes2.0.03.html'));
    }
  })());
});
