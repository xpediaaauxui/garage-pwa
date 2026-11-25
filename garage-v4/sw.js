/*
 * Service Worker de GARAGE.
 * Guarda las pantallas principales para poder abrir la PWA sin conexión.
 */
const CACHE_NAME = "garage-racing-v7";
const VEHICLESDB_URL = "https://cdn.jsdelivr.net/gh/vehiclesdb/vehiclesdb@v2026.11.10/dist/vehicles.json";
const BOOTSTRAP_CSS_URL = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css";
const APP_FILES = [
  "actividad.html",
  "ayuda.html",
  "buscar.html",
  "combustible-nuevo.html",
  "comentarios.html",
  "comunidad-explorar.html",
  "comunidad.html",
  "configuracion.html",
  "economia-estadisticas.html",
  "economia.html",
  "gasto-nuevo.html",
  "gastos-historial.html",
  "guardados.html",
  "index.html",
  "login.html",
  "register.html",
  "mantenimiento-detalle.html",
  "mantenimiento-historial.html",
  "mantenimiento-nuevo.html",
  "mantenimiento.html",
  "modificacion-detalle.html",
  "modificacion-nueva.html",
  "modificaciones.html",
  "notificaciones.html",
  "offline.html",
  "perfil-editar.html",
  "perfil.html",
  "preferencias.html",
  "proyectos.html",
  "publicacion-detalle.html",
  "publicacion-nueva.html",
  "recordatorio-nuevo.html",
  "recordatorios.html",
  "vehiculo-detalle.html",
  "vehiculo-editar.html",
  "vehiculo-ficha.html",
  "vehiculo-galeria.html",
  "vehiculo-nuevo.html",
  "vehiculos.html",
  "manifest.json",
  "css/styles.css",
  "js/data.js",
  "js/pages.js",
  "js/app.js",
  "assets/garage-icon.svg",
  "assets/icon-192.png",
  "assets/icon-512.png"
];

// Durante la instalación se guardan los archivos básicos de la aplicación.
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(APP_FILES).then(function () {
        // Bootstrap se descarga desde CDN, pero también se guarda para el modo offline.
        return cache.add(BOOTSTRAP_CSS_URL).catch(function () {});
      });
    })
  );
  self.skipWaiting();
});

// Al activar la nueva versión se eliminan las cachés anteriores.
self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (key) {
          return key !== CACHE_NAME;
        }).map(function (key) {
          return caches.delete(key);
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

// Se priorizan los archivos guardados; si falta uno, se intenta consultar la red.
self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") {
    return;
  }

  const requestUrl = event.request.url;
  const isNavigation = event.request.mode === "navigate";

  // El catálogo externo se actualiza cuando hay conexión y usa la última copia guardada si no.
  if (requestUrl === VEHICLESDB_URL) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function (cache) {
        return fetch(event.request).then(function (response) {
          if (response.ok) {
            cache.put(event.request, response.clone());
          }
          return response;
        }).catch(function () {
          return cache.match(event.request).then(function (savedResponse) {
            return savedResponse || new Response("", { status: 503, statusText: "Catálogo sin conexión" });
          });
        });
      })
    );
    return;
  }

  // Bootstrap también es externo; se busca primero en caché para que el diseño no se rompa offline.
  if (requestUrl === BOOTSTRAP_CSS_URL) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function (cache) {
        return cache.match(event.request).then(function (savedResponse) {
          if (savedResponse) {
            return savedResponse;
          }
          return fetch(event.request).then(function (response) {
            if (response.ok) {
              cache.put(event.request, response.clone());
            }
            return response;
          }).catch(function () {
            return new Response("", { status: 503, statusText: "Sin conexión" });
          });
        });
      }).catch(function () {
        return new Response("", { status: 503, statusText: "Sin conexión" });
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then(function (savedResponse) {
      if (savedResponse) {
        return savedResponse;
      }

      return fetch(event.request).then(function (response) {
        if (response.ok && new URL(event.request.url).origin === self.location.origin) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, copy);
          });
        }

        // Si una navegación falla, se devuelve la página offline; los demás recursos conservan su error.
        if (!response.ok && isNavigation) {
          return caches.match("offline.html", { ignoreSearch: true }).then(function (offlinePage) {
            return offlinePage || response;
          });
        }
        return response;
      }).catch(function () {
        if (isNavigation) {
          return caches.match("offline.html", { ignoreSearch: true });
        }
        return new Response("", { status: 503, statusText: "Sin conexión" });
      });
    })
  );
});
