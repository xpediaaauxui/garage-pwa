# GARAGE — Racing / Performance

PWA multipágina para gestionar vehículos, mantenimiento, gastos, modificaciones y comunidad.

## Cómo ejecutar
1. Descomprimir la carpeta.
2. Abrirla en Visual Studio Code.
3. Ejecutar `index.html` con Live Server.
4. Para probar la instalación y el modo offline, usar `http://localhost` o un servidor HTTPS. No abrir directamente con `file://`.

## Tecnologías
HTML5, CSS3, Bootstrap 5.3, JavaScript, localStorage, Web App Manifest y Service Worker.

## Organización
- Un archivo HTML por pantalla.
- `css/styles.css`: estilos compartidos y responsive.
- `js/data.js`: lectura, escritura y datos iniciales en localStorage.
- `js/pages.js`: títulos y secciones de cada pantalla.
- `js/app.js`: navegación, renderizado y acciones.
- `manifest.json`: configuración instalable.
- `sw.js`: caché y estrategia offline.
- `offline.html`: pantalla de contingencia.

## Nota
Los datos se guardan localmente en el navegador. No hay backend, sincronización entre dispositivos ni cuentas reales. Las fotos de vehículos no se suben todavía; la galería está planteada como pantalla preparada para esa ampliación.
