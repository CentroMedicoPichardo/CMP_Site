import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

const script = readFileSync(new URL("../public/sw.js", import.meta.url), "utf8");

function createWorker(network = async () => ({ source: "network" })) {
  const handlers = new Map();
  const entries = new Map();
  const stores = new Map();
  const cache = {
    addAll: async (urls) => urls.forEach((url) => entries.set(url, { source: url })),
  };
  const caches = {
    open: async (name) => {
      stores.set(name, cache);
      return cache;
    },
    match: async (request) => entries.get(typeof request === "string" ? request : request.url.replace("https://cmp.test", "")),
    keys: async () => [...stores.keys()],
    delete: async (name) => stores.delete(name),
  };
  const self = {
    location: { origin: "https://cmp.test" },
    addEventListener: (name, handler) => handlers.set(name, handler),
    skipWaiting: () => {},
    clients: { claim: async () => {} },
  };
  vm.runInNewContext(script, { self, caches, fetch: network, URL, Promise, Response });
  return { handlers, entries, stores };
}

test("solo precarga recursos públicos explícitos", async () => {
  const worker = createWorker();
  let pending;
  worker.handlers.get("install")({ waitUntil: (promise) => { pending = promise; } });
  await pending;
  assert.deepEqual([...worker.entries.keys()], [
    "/offline.html",
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
  ]);
});

test("las cuatro rutas públicas muestran la interfaz local sin guardar HTML de navegación", async () => {
  const worker = createWorker(async () => { throw new Error("offline"); });
  worker.entries.set("/offline.html", { source: "offline" });
  for (const pathname of ["/", "/quienes-somos", "/servicios", "/directorio-medico"]) {
    let response;
    worker.handlers.get("fetch")({
      request: { method: "GET", mode: "navigate", url: "https://cmp.test" + pathname },
      respondWith: (promise) => { response = promise; },
    });
    assert.equal((await response).source, "offline");
  }
  assert.deepEqual([...worker.entries.keys()], ["/offline.html"]);
});

test("API, páginas privadas y terceros no se interceptan como recursos cacheados", () => {
  const worker = createWorker();
  for (const url of [
    "https://cmp.test/api/auth/check-session",
    "https://cmp.test/api/cliente/dashboard",
    "https://cmp.test/mis-compras/cursos",
    "https://cmp.test/dashboard",
    "https://otro.test/imagen.png",
  ]) {
    let intercepted = false;
    worker.handlers.get("fetch")({
      request: { method: "GET", mode: "cors", url },
      respondWith: () => { intercepted = true; },
    });
    assert.equal(intercepted, false, url);
  }
  let privateNavigationIntercepted = false;
  worker.handlers.get("fetch")({
    request: { method: "GET", mode: "navigate", url: "https://cmp.test/dashboard" },
    respondWith: () => { privateNavigationIntercepted = true; },
  });
  assert.equal(privateNavigationIntercepted, false);
});

test("la activación borra versiones anteriores, no otras cachés", async () => {
  const worker = createWorker();
  worker.stores.set("cmp-public-offline-v0", {});
  worker.stores.set("cmp-public-offline-v1", {});
  worker.stores.set("otra-aplicacion", {});
  let pending;
  worker.handlers.get("activate")({ waitUntil: (promise) => { pending = promise; } });
  await pending;
  assert.deepEqual([...worker.stores.keys()], ["otra-aplicacion"]);
});
