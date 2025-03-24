self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('hotter-or-colder-v1').then((cache) => {
            return cache.addAll([
                '/HotterOrColder/',
                '/HotterOrColder/index.html',
                '/HotterOrColder/home.html',
                '/HotterOrColder/addGame.html',
                '/HotterOrColder/game.html',
                '/HotterOrColder/styles.css',
                '/HotterOrColder/home.js',
                '/HotterOrColder/addGame.js',
                '/HotterOrColder/game.js',
                '/HotterOrColder/manifest.json',
                '/HotterOrColder/icon-192x192.png',
                '/HotterOrColder/icon-512x512.png'
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = ['hotter-or-colder-v1'];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});