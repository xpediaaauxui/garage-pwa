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

## Formularios de vehículos
- Marca y modelo se consultan desde VehiclesDB (catálogo abierto CC BY 4.0), no desde una lista manual dentro del código.
- La búsqueda filtra mientras escribís (por ejemplo, `fo` muestra `Ford`) y los modelos cambian según la marca elegida.
- Se incluyen autos y utilitarios (`car` y `van`). Se guarda también el identificador estable de VehiclesDB para reconocer el modelo.
- Para guardar, hay que seleccionar una opción válida del menú; no alcanza con escribir texto libre.
- La primera descarga necesita conexión. El Service Worker guarda el JSON del catálogo para próximas visitas y uso offline.
- Fuente: https://github.com/vehiclesdb/vehiclesdb · Datos VehiclesDB, versión 2026.11.10. Atribución: VehiclesDB, licencia CC BY 4.0.
- Año, kilometraje, color, combustible, transmisión y carrocería mediante listas desplegables.
- El kilometraje se guarda como número aunque se muestre con formato local (por ejemplo, 120.000 km).

## Nota
Los datos se guardan localmente en el navegador. No hay backend, sincronización entre dispositivos ni cuentas reales. Las fotos de vehículos no se suben todavía; la galería está planteada como pantalla preparada para esa ampliación.
