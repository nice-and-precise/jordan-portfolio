
self.addEventListener('install', (e) => {
    // Skip waiting to activate immediately
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    // Unregister immediately
    self.registration.unregister()
        .then(() => {
            console.log('Old Service Worker unregistered via self-destruct.');
            // Force page reload to get fresh non-SW content if needed
            // clients.matchAll({type: 'window'}).then(clients => {
            //     clients.forEach(client => client.navigate(client.url));
            // });
        });
});

// Pass-through fetch (though unregister should happen fast)
self.addEventListener('fetch', (e) => {
    e.respondWith(fetch(e.request));
});
