const SHELL_CACHE = 'feasto-shell-v3';
const ASSETS_CACHE = 'feasto-assets-v3';
const API_CACHE = 'feasto-api-v3';

const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/manifest.json'
];

// Sensitive or dynamic routes that must NEVER be cached or served stale
const UNCACHED_PATHS = [
  '/api/v1/checkout',
  '/api/v1/orders',
  '/api/v1/payments',
  '/api/v1/razorpay',
  '/api/v1/cashfree',
  '/api/v1/auth',
  '/checkout',
  '/payment',
  '/auth'
];

// Install event: Pre-cache the basic app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => {
      return cache.addAll(SHELL_ASSETS);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activate event: Clean up legacy caches immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (
            cacheName !== SHELL_CACHE &&
            cacheName !== ASSETS_CACHE &&
            cacheName !== API_CACHE
          ) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Helper to determine if a request is a static immutable asset
const isStaticAsset = (url) => {
  const ext = url.pathname.split('.').pop()?.toLowerCase();
  return ['js', 'css', 'woff2', 'woff', 'ttf', 'png', 'jpg', 'jpeg', 'svg', 'webp', 'ico'].includes(ext || '');
};

// Fetch event: Network interception & caching
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // 1. Skip all non-GET requests (Never cache POST, PUT, DELETE, PATCH mutations)
  if (request.method !== 'GET') {
    return;
  }

  // 2. Skip cross-origin requests (CDNs, Firebase APIs, Razorpay SDKs, etc.)
  if (url.origin !== self.location.origin) {
    return;
  }

  // 3. Sensitive paths (checkout, payments, auth) must always go directly to network
  if (UNCACHED_PATHS.some((p) => url.pathname.startsWith(p))) {
    return;
  }

  // 4. Navigation Requests (SPA Route transitions, page reloads, deep links like /checkout, /cart)
  // Network first: if network is available, fetch freshly; if offline, serve cached index.html
  const isNavigation = request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html');
  if (isNavigation) {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.open(SHELL_CACHE).then((cache) => {
          return cache.match('/index.html') ||
            new Response('<!DOCTYPE html><html><body><h1>Offline</h1><p>Please check your connection and retry.</p></body></html>', {
              headers: { 'Content-Type': 'text/html' }
            });
        });
      })
    );
    return;
  }

  // 5. Static Assets (JS, CSS, Fonts, Images) -> Cache-first with background network update
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Serve from cache, background refresh if not hashed chunk
          const isImmutable = url.pathname.includes('/assets/') && (url.pathname.includes('-') || url.pathname.includes('.hash'));
          if (!isImmutable) {
            fetch(request).then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                caches.open(ASSETS_CACHE).then((cache) => cache.put(request, networkResponse));
              }
            }).catch(() => {/* ignore background network error */});
          }
          return cachedResponse;
        }

        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(ASSETS_CACHE).then((cache) => cache.put(request, responseToCache));
          }
          return networkResponse;
        }).catch(() => {
          // Graceful fallback for static assets without emitting 408
          return new Response('', { status: 404, statusText: 'Not Found' });
        });
      })
    );
    return;
  }

  // 6. Default: Pass through to native network
});

// Skip waiting message listener
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
