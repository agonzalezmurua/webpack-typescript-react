/* eslint-disable no-console */
const DEBUG = false

// When the user navigates to your site,
// the browser tries to redownload the script file that defined the service
// worker in the background.
// If there is even a byte's difference in the service worker file compared
// to what it currently has, it considers it 'new'.
const {
    assets
} = global.serviceWorkerOption

const CACHE_NAME = new Date().toISOString()

CACHE_FILES = [...assets].map(path => {
    return new URL(path, global.location).toString()
})

// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
    if (DEBUG) {
        console.log("CACHE_NAME", CACHE_NAME)
    }
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => cache.addAll(CACHE_FILES))
        .then(self.skipWaiting())
    );
});

// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
self.addEventListener('fetch', event => {
    if (DEBUG) {
        console.log("Fetching resource", event.request.url)
    }
    // Skip cross-origin requests, like those for Google Analytics.
    if (event.request.url.startsWith(self.location.origin)) {
        event.respondWith(
            caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    if (DEBUG) {
                        console.log("Found", event.request.url, "in cache")
                    }
                    return cachedResponse;
                }
                const matches = CACHE_FILES.find(file => event.request.url === file) !== undefined;

                if (matches) {
                    if (DEBUG) {
                        console.log("Didn't found", event.request.url, ", in cache but matches known assets")
                    }
                    return caches.open(CACHE_NAME).then(cache => {
                        return fetch(event.request).then(response => {
                            // Put a copy of the response in the runtime cache.
                            return cache.put(event.request, response.clone()).then(() => {
                                return response;
                            });
                        });
                    });
                }
                
                if (DEBUG) {
                    console.log("Didn't match", event.request.url)
                }
                return fetch(event.request);
            })
        );
    }
});