// QuaiPulse Service Worker
// Provides offline support via cache-first for static assets,
// network-first for HTML navigation, and network-only for API routes.

const CACHE_VERSION = 'quaipulse-v1';

const PRE_CACHE_URLS = [
  '/',
  '/neighborhoods',
  '/budget',
  '/checklist',
  '/katie',
  '/dossier',
  '/subscriptions',
  '/settings',
  '/gym-finder',
  '/language',
  '/sleep',
  '/social',
  '/flights',
  '/weather',
  '/apartments',
  '/currency',
  '/ai',
  '/offline.html',
];

// --- Install: pre-cache the app shell ---
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      // Use addAll for critical resources, but don't fail the entire
      // install if a non-critical page 404s during build.
      return Promise.allSettled(
        PRE_CACHE_URLS.map((url) =>
          cache.add(url).catch((err) => {
            console.warn(`[SW] Failed to pre-cache ${url}:`, err);
          })
        )
      );
    })
  );
  // Activate immediately without waiting for existing clients to close
  self.skipWaiting();
});

// --- Activate: purge stale caches from previous versions ---
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_VERSION)
          .map((key) => {
            console.log(`[SW] Deleting old cache: ${key}`);
            return caches.delete(key);
          })
      )
    )
  );
  // Take control of all open tabs immediately
  self.clients.claim();
});

// --- Fetch: route requests through the appropriate cache strategy ---
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests entirely
  if (request.method !== 'GET') return;

  // API routes: network-only, never cache
  if (url.pathname.startsWith('/api/')) return;

  // tRPC routes: network-only
  if (url.pathname.startsWith('/trpc/')) return;

  // Navigation requests (HTML pages): network-first with cache fallback
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstWithOfflineFallback(request));
    return;
  }

  // Static assets (JS, CSS, images, fonts): cache-first with network fallback
  event.respondWith(cacheFirstWithNetworkFallback(request));
});

/**
 * Network-first strategy for HTML navigation.
 * Tries the network, caches the response on success,
 * falls back to cache, then to offline.html.
 */
async function networkFirstWithOfflineFallback(request) {
  try {
    const networkResponse = await fetch(request);
    // Cache successful responses for future offline use
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_VERSION);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (_err) {
    // Network failed — try the cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) return cachedResponse;

    // Nothing in cache either — serve the offline fallback
    const offlinePage = await caches.match('/offline.html');
    return offlinePage || new Response('Offline', { status: 503 });
  }
}

/**
 * Cache-first strategy for static assets.
 * Returns cached version if available, otherwise fetches from
 * network and caches the result for next time.
 */
async function cacheFirstWithNetworkFallback(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) return cachedResponse;

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_VERSION);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (_err) {
    // For non-navigation requests, just return a basic error
    return new Response('', { status: 408 });
  }
}
