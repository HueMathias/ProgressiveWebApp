const PREFIX = "V5";

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil((async () => {
        const cache = await caches.open(PREFIX);
        cache.add(new Request('/offline.html'));
    })())
});

self.addEventListener('activate', () => {
    clients.claim();
});

self.addEventListener('fetch', (event) =>{
    if (event.request.mode == 'navigate'){
        event.respondWith((async () => {
            try{
                const preloadResponse = await event.preloadResponse
                if (preloadResponse)
                    return preloadResponse

                return await fetch(event.request)
            }
            catch{
                const cache = await caches.open(PREFIX);
                //return new Response('Vous êtes hors ligne');
                return await cache.match('/offline.html');
            }             
        })())
    }
});
