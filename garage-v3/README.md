# GARAGE V3 — Racing / Performance

GARAGE es una PWA multipágina para registrar vehículos, consultar su mantenimiento, controlar gastos y combustible, anotar modificaciones y crear publicaciones de prueba.

## Ejecutar el proyecto

1. Descomprimí la carpeta del proyecto.
2. Abrila en Visual Studio Code.
3. Ejecutá `index.html` con Live Server.
4. Para probar la instalación y el modo sin conexión, usá `localhost` o HTTPS. No abras el proyecto directamente con `file://`.

## Tecnologías y contenidos de ICDM

- HTML5 con estructura semántica y formularios.
- CSS3 con Box Model, Flexbox, Grid, clases BEM y Media Queries.
- Enfoque Mobile First: los estilos base son para celular; las reglas de tablet y escritorio se agregan con `min-width`.
- Bootstrap 5 para grilla, contenedores, utilidades y componentes de interfaz.
- `manifest.json` con íconos PNG de 192 y 512 píxeles.
- `sw.js` con instalación, activación, caché y respuesta alternativa sin conexión.
- `offline.html` como página estática independiente.

## Organización

- Cada pantalla tiene su propio archivo HTML.
- `css/styles.css`: estilos compartidos, escritos Mobile First.
- `js/data.js`: datos iniciales y almacenamiento en el navegador.
- `js/pages.js`: títulos y secciones de las pantallas.
- `js/app.js`: contenido y comportamiento de los formularios y controles.
- `manifest.json`: configuración de instalación de la PWA.
- `sw.js`: archivos almacenados para el uso sin conexión.
- `offline.html`: pantalla estática de respaldo.
- `assets/`: identidad visual e íconos de la aplicación.

## Funciones del prototipo

- Agregar, editar y eliminar vehículos.
- Buscar marcas y modelos mientras se escribe. El catálogo se obtiene de VehiclesDB, una fuente externa con licencia CC BY 4.0.
- Asociar mantenimiento, recordatorios, gastos, cargas de combustible y modificaciones a un vehículo específico.
- Filtrar el historial de mantenimiento por vehículo.
- Crear publicaciones locales con hasta tres fotos optimizadas.
- Exportar o restablecer los datos de ejemplo.

## Límites importantes

Este proyecto es un prototipo de cursada. Los datos se guardan en `localStorage` del navegador: no hay backend, cuentas reales, sincronización entre dispositivos ni comunidad pública. Las publicaciones y sus fotos solo se ven en el mismo navegador donde se guardaron. Las fotos se comprimen antes de guardarse, pero el almacenamiento local del navegador tiene un límite.

El buscador de marcas y modelos consulta VehiclesDB desde un CDN, por lo que la primera carga del catálogo requiere conexión. El Service Worker intenta guardar la última respuesta para reutilizarla después.

Las funciones de almacenamiento local, consulta del catálogo y manejo de imágenes son ampliaciones del prototipo; no son necesarias para demostrar los contenidos principales de HTML, CSS, Bootstrap y PWA vistos en ICDM. En una defensa, conviene diferenciarlas de los requisitos centrales de la materia.

## Atribución de datos

VehiclesDB: https://github.com/vehiclesdb/vehiclesdb — licencia CC BY 4.0. Ver `VEHICLESDB_ATTRIBUTION.md`.


## Estado de revisión de la versión 3

Se verificaron la sintaxis de los archivos JavaScript, la existencia de las 37 páginas HTML, los recursos locales vinculados, las dimensiones de los íconos y la configuración básica de la PWA. También se revisaron el enfoque Mobile First y la respuesta alternativa del Service Worker.

Quedan funciones intencionalmente pendientes en este prototipo: la galería de fotos por vehículo todavía es una pantalla informativa; la ficha técnica reutiliza el detalle general; las páginas de detalle de servicio, modificación y publicación aún muestran el último registro en vez de seleccionar un registro por ID; y los comentarios todavía no se agrupan por publicación. Antes de una entrega final conviene completar esos recorridos y hacer una prueba visual manual en un celular y en escritorio.
