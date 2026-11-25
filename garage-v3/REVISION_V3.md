# Revisión técnica — GARAGE V3

## Controles realizados

- 37 archivos HTML encontrados.
- Archivos principales presentes: CSS, JavaScript, manifest, Service Worker, offline y los dos íconos PNG.
- Sintaxis JavaScript comprobada con `node --check` en `app.js`, `data.js`, `pages.js` y `sw.js`.
- Rutas locales de estilos, scripts, manifest e imágenes revisadas.
- Configuración Mobile First observada en CSS: reglas base para celular y media queries con `min-width` para pantallas mayores.
- Manifest configurado con `icon-192.png` y `icon-512.png`.
- Service Worker con caché de archivos locales, respuesta offline y `ignoreSearch` para rutas con parámetros de vehículo.

## Límites y pendientes conocidos

- Los datos se almacenan en `localStorage`; no hay backend ni sincronización.
- La galería por vehículo es todavía informativa y no permite administrar fotos.
- La ficha técnica reutiliza la vista del detalle del vehículo.
- Las pantallas de detalle de servicio, modificación y publicación aún no seleccionan el registro mediante un ID; muestran el último registro disponible.
- Los comentarios no se agrupan por publicación y el contador de comentarios no se actualiza.
- La revisión técnica no sustituye una prueba manual en dispositivos reales ni una evaluación docente.
