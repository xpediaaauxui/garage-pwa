const CACHE_NAME = "garage-racing-v4";
const VEHICLESDB_URL = "https://cdn.jsdelivr.net/gh/vehiclesdb/vehiclesdb@v2026.11.10/dist/vehicles.json";
const APP_FILES = [
"index.html","actividad.html","notificaciones.html","buscar.html","vehiculos.html","vehiculo-nuevo.html","vehiculo-detalle.html","vehiculo-editar.html","vehiculo-galeria.html","vehiculo-ficha.html","mantenimiento.html","mantenimiento-nuevo.html","mantenimiento-historial.html","mantenimiento-detalle.html","recordatorios.html","recordatorio-nuevo.html","economia.html","gasto-nuevo.html","combustible-nuevo.html","gastos-historial.html","economia-estadisticas.html","modificaciones.html","modificacion-nueva.html","modificacion-detalle.html","proyectos.html","comunidad.html","comunidad-explorar.html","publicacion-nueva.html","publicacion-detalle.html","comentarios.html","guardados.html","perfil.html","perfil-editar.html","configuracion.html","preferencias.html","ayuda.html","offline.html","manifest.json","css/styles.css","js/data.js","js/pages.js","js/app.js","assets/garage-icon.svg"
];
self.addEventListener("install",event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_FILES)));self.skipWaiting()});
self.addEventListener("activate",event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key)))));self.clients.claim()});
self.addEventListener("fetch",event=>{
 if(event.request.method!=="GET")return;
 const requestUrl=event.request.url;
 if(requestUrl===VEHICLESDB_URL){
  event.respondWith(caches.open(CACHE_NAME).then(async cache=>{
   const cached=await cache.match(event.request);
   if(cached){event.waitUntil(fetch(event.request).then(response=>{if(response.ok)return cache.put(event.request,response.clone());}).catch(()=>{}));return cached;}
   const response=await fetch(event.request);
   if(response.ok)await cache.put(event.request,response.clone());
   return response;
  }));
  return;
 }
 event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{let copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy));return response}).catch(()=>caches.match("offline.html"))));
});
