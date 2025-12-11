const CACHE_NAME = 'jd-portfolio-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/assets/js/main.js',
    '/assets/js/data.js',
    '/assets/js/blog-data.js',
    '/manifest.json',
    '/assets/icon.svg'
];

// Install Event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS))
    );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Strategy: Stale-While-Revalidate
            const fetchPromise = fetch(event.request).then((networkResponse) => {
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                });
                return networkResponse;
            });
            return cachedResponse || fetchPromise;
        })
    );
});
