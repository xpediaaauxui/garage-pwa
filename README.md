# GARAGE 0.1

Primera versión de maquetación y prueba funcional de GARAGE para la materia Interacción con Dispositivos Móviles (ICDM).

## Qué incluye

- Inicio con un resumen básico.
- Mi garaje: agregar y eliminar vehículos.
- Mantenimiento: registrar un trabajo para un vehículo y consultar los registros.
- Gastos: registrar un gasto y consultar el total.
- Diseño Mobile First con adaptación a pantallas más grandes.
- Bootstrap y CSS .
- Manifest, Service Worker y página offline.
- LocalStorage para guardar una lista de vehículos, mantenimientos y gastos en el navegador.

## Qué no incluye

No tiene cuentas, inicio de sesión real, base de datos, servidor, sincronización, comunidad, publicaciones, comentarios, notificaciones, búsqueda avanzada, catálogos externos, carga de fotos ni estadísticas complejas.

## Almacenamiento

Los datos se guardan en `localStorage` con la clave `garage_v01`. Quedan guardados en el navegador y dispositivo actuales. No se envían a internet ni se sincronizan con otros dispositivos. Para reiniciar la prueba se puede borrar el almacenamiento del sitio desde las herramientas del navegador.

# Criterio de alcance

Esta versión se limita a los contenidos de ICDM y a un almacenamiento local simple.

## Contenidos aplicados

- HTML semántico: `header`, `nav`, `main`, `section`, `article` y `footer`.
- Formularios HTML con `label`, `input`, `select`, `required` y tipos de campo.
- CSS externo, selectores, clases, Box Model, Flexbox y Media Queries.
- Nombres de clases organizados con BEM.
- Bootstrap 5: contenedores, grilla, botones y utilidades.
- Mobile First: estilos de celular por defecto y adaptación a partir de 768 px.
- PWA: `manifest.json`, `sw.js`, caché y `offline.html`.
- JavaScript básico: variables, funciones, condicionales, ciclos, eventos y manipulación del DOM.
- LocalStorage pequeño para listas de vehículos, mantenimientos y gastos.

## Verificaciones

- Los formularios usan validación HTML requerida.
- Los datos se almacenan localmente y se leen al volver a cada sección.
- Las asociaciones de mantenimiento y gastos usan el ID local del vehículo.
- Los archivos PWA principales están incluidos en la caché inicial.
- No hay servicios de terceros para datos de vehículos ni backend.

## Limitaciones conocidas

- Bootstrap se carga desde CDN; sin conexión se mantiene el CSS propio, pero no están disponibles las clases visuales de Bootstrap hasta recuperar la conexión.
- Los datos solo existen en el navegador que los guarda.
- Al eliminar un vehículo, sus registros anteriores no se eliminan automáticamente; pueden quedar asociados a un vehículo eliminado.
- Esta versión no incluye edición de registros ni carga de imágenes.
