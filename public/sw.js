const CACHE_NAME = "cmp-public-offline-v4";
const CACHE_PREFIX = "cmp-public-offline-";
const OFFLINE_URL = "/offline.html";
const OFFLINE_ROUTES = new Set(["/", "/quienes-somos", "/servicios", "/directorio-medico"]);
const PUBLIC_ASSETS = [
  OFFLINE_URL,
  "/offline.css",
  "/offline.js",
  "/manifest.webmanifest",
  "/pwa/icon-192.png",
  "/pwa/icon-512.png",
  "/logo.png",
  "/Pichardo.jpg",
  "/headerquienesomos.png",
  "/headerimg.png",
  "/headermedico.png",
  "/no_imagen_uwvduy.png",
  "/pediatric-illustration.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PUBLIC_ASSETS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((names) =>
        Promise.all(
          names
            .filter((name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
            .map((name) => caches.delete(name)),
        ),
      ),
      self.clients.claim(),
    ]),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Ninguna API, navegación o respuesta ligada a una sesión se almacena.
  if (request.mode === "navigate") {
    const pathname = url.pathname.replace(/\/$/, "") || "/";
    if (!OFFLINE_ROUTES.has(pathname)) return;
    event.respondWith(
      fetch(request).catch(async () => {
        const cached = await caches.match(OFFLINE_URL);
        return cached || Response.error();
      }),
    );
    return;
  }

  if (!url.search && PUBLIC_ASSETS.includes(url.pathname)) {
    event.respondWith(caches.match(request).then((cached) => cached || fetch(request)));
  }
});
