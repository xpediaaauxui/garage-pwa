// Nombre de la caché de esta versión.
var CACHE_NAME = "garage-v01";

// Archivos principales que se guardan para poder abrir la aplicación sin conexión.
var ARCHIVOS_CACHE = [
  "./",
  "./index.html",
  "./vehiculos.html",
  "./vehiculo-nuevo.html",
  "./mantenimiento.html",
  "./mantenimiento-nuevo.html",
  "./economia.html",
  "./gasto-nuevo.html",
  "./offline.html",
  "./css/styles.css",
  "./js/app.js",
  "./manifest.json",
  "./assets/icon-192.png",
  "./assets/icon-512.png"
];

// Al instalarse, el Service Worker guarda los archivos de la aplicación.
self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ARCHIVOS_CACHE);
    })
  );
  self.skipWaiting();
});

// Al activarse, se eliminan las cachés de versiones anteriores.
self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(nombres) {
      return Promise.all(
        nombres.map(function(nombre) {
          if (nombre !== CACHE_NAME) {
            return caches.delete(nombre);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Primero se intenta consultar la red. Si no hay conexión, se busca el archivo guardado.
self.addEventListener("fetch", function(event) {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    fetch(event.request).then(function(respuesta) {
      var copia = respuesta.clone();
      caches.open(CACHE_NAME).then(function(cache) {
        cache.put(event.request, copia);
      });
      return respuesta;
    }).catch(function() {
      return caches.match(event.request).then(function(archivoGuardado) {
        if (archivoGuardado) {
          return archivoGuardado;
        }
        if (event.request.mode === "navigate") {
          return caches.match("./offline.html");
        }
        return Response.error();
      });
    })
  );
});
