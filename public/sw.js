const CACHE_NAME = "img0-v2-seo";
// We include both versions to be safe with how different static hosts serve files
const URLS_TO_CACHE = [
    "/",
    "/manifest.json",
    "/insert-picture-icon.png",
    "/file.svg",
    "/globe.svg",
    "/window.svg",
    // Core CSS/JS if identifiable, but usually hashed. 
    // We reply on runtime caching for those.

    // Tool Pages - explicitly cache the HTML which is what matters for offline navigation
    // Using directory paths with trailing slashes to match Next.js output for static pages
    "/tools/",
    "/tools/image-to-base64/",
    "/tools/image-to-png/",
    "/tools/image-to-jpg/",
    "/tools/image-to-webp/",
    "/tools/image-to-ico/",
    "/tools/image-to-pdf/",
    "/tools/favicon-generator/",
    "/tools/svg-to-jsx/",
    "/tools/crop-image/",
    "/tools/rotate-image/",
    "/tools/remove-background/",
    "/tools/blur-background/",
    "/tools/join-images/",
];

self.addEventListener("install", (event) => {
    // This new strategy ensures that if ONE file 404s, it doesn't break the whole Service Worker.
    // It will cache whatever it can find.
    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            // console.log('Open Cache');
            // We explicitly fetch and cache each one to handle failures gracefully
            const promises = URLS_TO_CACHE.map(async (url) => {
                try {
                    const req = new Request(url);
                    const response = await fetch(req);
                    if (response.status === 200) {
                        return cache.put(req, response);
                    }
                } catch (e) {
                    // console.warn('Failed to pre-cache', url);
                }
            });
            await Promise.all(promises);
        })
    );
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        (async () => {
            try {
                const cache = await caches.open(CACHE_NAME);

                // 1. Try to find the exact request in the cache
                let cachedResponse = await cache.match(event.request);

                // 2. If not found, try normalizing URL (handling trailing slashes)
                if (!cachedResponse) {
                    const url = new URL(event.request.url);
                    if (url.pathname.endsWith("/")) {
                        // Try without slash
                        cachedResponse = await cache.match(url.pathname.slice(0, -1));
                    } else {
                        // Try with slash
                        cachedResponse = await cache.match(url.pathname + "/");
                    }
                }

                // 3. If still not found, try appending 'index.html' to the path
                // This handles cases where a directory path (e.g., /tools/) is requested,
                // but the cached asset is /tools/index.html
                if (!cachedResponse) {
                    const url = new URL(event.request.url);
                    if (url.pathname.endsWith('/')) {
                        cachedResponse = await cache.match(url.pathname + 'index.html');
                    } else {
                        // If it's not a directory, maybe it's a file that should be index.html
                        // e.g., /tools/image-to-base64 -> /tools/image-to-base64/index.html
                        cachedResponse = await cache.match(url.pathname + '/index.html');
                    }
                }

                // Return cached response immediately if available
                if (cachedResponse) {
                    // Update cache in background (Stale-While-Revalidate)
                    fetch(event.request).then((networkResponse) => {
                        if (networkResponse && networkResponse.status === 200) {
                            cache.put(event.request, networkResponse.clone());
                        }
                    }).catch(() => { });

                    return cachedResponse;
                }

                // If not in cache, fetch from network
                const networkResponse = await fetch(event.request);

                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== "basic") {
                    return networkResponse;
                }

                // Cache the new resource
                cache.put(event.request, networkResponse.clone());
                return networkResponse;

            } catch (error) {
                // Fallback for offline navigation
                if (event.request.mode === 'navigate' || event.request.headers.get("accept").includes("text/html")) {
                    return new Response(
                        `<!DOCTYPE html>
                        <html>
                          <head>
                            <title>Offline | img0.site</title>
                            <meta name="viewport" content="width=device-width, initial-scale=1">
                            <style>
                              body { font-family: system-ui, sans-serif; background: #fff; color: #0f172a; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
                              h1 { margin-bottom: 1rem; font-size: 2rem; letter-spacing: -0.05em; }
                              p { color: #64748b; margin-bottom: 2rem; }
                              button { background: #0f172a; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 9999px; font-weight: bold; cursor: pointer; }
                            </style>
                          </head>
                          <body>
                            <h1>You're Offline</h1>
                            <p>It seems you lost your internet connection.</p>
                            <button onclick="window.location.reload()">Try Again</button>
                            <br/><br/>
                            <a href="/" style="color: #0f172a;">Go Home</a>
                          </body>
                        </html>`,
                        {
                            headers: { "Content-Type": "text/html" }
                        }
                    );
                }
                // Generic offline response for other assets
                return new Response("Offline", { status: 503, statusText: "Offline" });
            }
        })()
    );
});
