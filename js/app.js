
// GUARDAR Y RECUPERAR DATOS

const claveDatos = "garage_v01";

function obtenerDatos() {
  const guardados = localStorage.getItem(claveDatos);

  if (guardados === null) {
    return {
      vehiculos: [],
      mantenimientos: [],
      gastos: [],
      ultimoId: 0
    };
  }

  return JSON.parse(guardados);
}

function guardarDatos(datos) {
  localStorage.setItem(claveDatos, JSON.stringify(datos));
}

// FUNCIONES GENERALES

function buscarVehiculo(datos, id) {
  for (let i = 0; i < datos.vehiculos.length; i++) {
    if (datos.vehiculos[i].id === id) {
      return datos.vehiculos[i].marca + " " + datos.vehiculos[i].modelo;
    }
  }

  return "Vehículo eliminado";
}

function crearElemento(etiqueta, clase, texto) {
  const elemento = document.createElement(etiqueta);
  elemento.className = clase;
  elemento.textContent = texto;
  return elemento;
}

function mostrarVacio(lista, mensaje, clase) {
  if (lista.children.length === 0) {
    lista.appendChild(crearElemento("p", clase, mensaje));
  }
}

function crearTarjeta(titulo, textos) {
  const tarjeta = crearElemento("article", "record-card", "");
  tarjeta.appendChild(crearElemento("h2", "record-card__title", titulo));

  for (let i = 0; i < textos.length; i++) {
    tarjeta.appendChild(crearElemento("p", "record-card__text", textos[i]));
  }

  return tarjeta;
}

// RESUMEN

function mostrarResumen() {
  const datos = obtenerDatos();

  const vehiculos = document.getElementById("total-vehiculos");
  const mantenimientos = document.getElementById("total-mantenimientos");
  const gastos = document.getElementById("total-gastos");

  if (vehiculos) vehiculos.textContent = datos.vehiculos.length;
  if (mantenimientos) mantenimientos.textContent = datos.mantenimientos.length;
  if (gastos) gastos.textContent = datos.gastos.length;
}

// VEHICULOS

function mostrarVehiculos() {
  const datos = obtenerDatos();
  const lista = document.getElementById("lista-vehiculos");

  if (!lista) return;

  lista.innerHTML = "";

  for (let i = 0; i < datos.vehiculos.length; i++) {
    const vehiculo = datos.vehiculos[i];

    const columna = crearElemento("div", "col-12 col-md-6", "");
    const tarjeta = crearElemento("article", "vehicle-card", "");

    tarjeta.appendChild(crearElemento("h2", "vehicle-card__title",
      vehiculo.marca + " " + vehiculo.modelo));

    tarjeta.appendChild(crearElemento("p", "vehicle-card__text",
      "Año: " + vehiculo.anio));

    tarjeta.appendChild(crearElemento("p", "vehicle-card__text",
      "Kilometraje: " + vehiculo.kilometros + " km"));

    const boton = crearElemento("button", "btn btn-sm btn-outline-danger", "Eliminar");
    boton.value = i;

    boton.addEventListener("click", function() {
      if (confirm("¿Querés eliminar este vehículo?")) {
        const datosActuales = obtenerDatos();
        datosActuales.vehiculos.splice(Number(this.value), 1);

        guardarDatos(datosActuales);
        mostrarVehiculos();
        mostrarResumen();
      }
    });

    tarjeta.appendChild(boton);
    columna.appendChild(tarjeta);
    lista.appendChild(columna);
  }

  mostrarVacio(lista, "Todavía no agregaste vehículos.", "empty-message col-12");
}

// CARGAR VEHICULOS EN SELECTORES

function cargarVehiculosEnSelectores() {
  const datos = obtenerDatos();

  const selectores = [
    document.getElementById("vehiculo-mantenimiento"),
    document.getElementById("vehiculo-gasto")
  ];

  for (let i = 0; i < selectores.length; i++) {
    const selector = selectores[i];

    if (selector) {
      for (let j = 0; j < datos.vehiculos.length; j++) {
        const vehiculo = datos.vehiculos[j];
        const opcion = document.createElement("option");

        opcion.value = vehiculo.id;
        opcion.textContent = vehiculo.marca + " " + vehiculo.modelo;

        selector.appendChild(opcion);
      }

      if (datos.vehiculos.length === 0 && i === 0) {
        selector.disabled = true;
      }
    }
  }
}

// MANTENIMIENTOS

function mostrarMantenimientos() {
  const datos = obtenerDatos();
  const lista = document.getElementById("lista-mantenimientos");

  if (!lista) return;

  lista.innerHTML = "";

  for (let i = 0; i < datos.mantenimientos.length; i++) {
    const registro = datos.mantenimientos[i];

    const tarjeta = crearTarjeta(registro.servicio, [
      "Vehículo: " + buscarVehiculo(datos, registro.vehiculoId),
      "Fecha: " + registro.fecha,
      "Kilometraje: " + registro.kilometros + " km"
    ]);

    lista.appendChild(tarjeta);
  }

  mostrarVacio(lista, "Todavía no hay mantenimientos registrados.", "empty-message");
}

// GASTOS

function mostrarGastos() {
  const datos = obtenerDatos();
  const lista = document.getElementById("lista-gastos");
  const total = document.getElementById("total-gastos-pesos");

  if (!lista) return;

  lista.innerHTML = "";

  let suma = 0;

  for (let i = 0; i < datos.gastos.length; i++) {
    suma = suma + Number(datos.gastos[i].importe);
  }

  if (total) {
    total.textContent = "$ " + suma;
  }

  for (let i = 0; i < datos.gastos.length; i++) {
    const gasto = datos.gastos[i];

    let vehiculo = "Sin vehículo asociado";

    if (gasto.vehiculoId !== "") {
      vehiculo = "Vehículo: " + buscarVehiculo(datos, Number(gasto.vehiculoId));
    }

    const tarjeta = crearTarjeta(gasto.concepto, [
      "Importe: $ " + Number(gasto.importe),
      "Fecha: " + gasto.fecha,
      vehiculo
    ]);

    lista.appendChild(tarjeta);
  }

  mostrarVacio(lista, "Todavía no hay gastos registrados.", "empty-message");
}

// FORMULARIO DE VEHICULOS

function activarFormularioVehiculo() {
  const formulario = document.getElementById("form-vehiculo");

  if (!formulario) return;

  formulario.addEventListener("submit", function(event) {
    event.preventDefault();

    const datos = obtenerDatos();
    datos.ultimoId++;

    const vehiculo = {
      id: datos.ultimoId,
      marca: document.getElementById("marca").value,
      modelo: document.getElementById("modelo").value,
      anio: document.getElementById("anio").value,
      kilometros: document.getElementById("kilometros").value
    };

    datos.vehiculos.push(vehiculo);

    guardarDatos(datos);
    window.location.href = "vehiculos.html";
  });
}

// FORMULARIO DE MANTENIMIENTOS

function activarFormularioMantenimiento() {
  const formulario = document.getElementById("form-mantenimiento");

  if (!formulario) return;

  formulario.addEventListener("submit", function(event) {
    event.preventDefault();

    const datos = obtenerDatos();
    const selector = document.getElementById("vehiculo-mantenimiento");

    if (datos.vehiculos.length === 0 || selector.value === "") {
      document.getElementById("mensaje-mantenimiento").textContent =
        "Primero agregá un vehículo a tu garaje.";
      return;
    }

    const registro = {
      vehiculoId: Number(selector.value),
      servicio: document.getElementById("servicio").value,
      fecha: document.getElementById("fecha-mantenimiento").value,
      kilometros: document.getElementById("km-mantenimiento").value
    };

    datos.mantenimientos.push(registro);

    guardarDatos(datos);
    window.location.href = "mantenimiento.html";
  });
}

// FORMULARIO DE GASTOS

function activarFormularioGasto() {
  const formulario = document.getElementById("form-gasto");

  if (!formulario) return;

  formulario.addEventListener("submit", function(event) {
    event.preventDefault();

    const datos = obtenerDatos();

    const gasto = {
      concepto: document.getElementById("concepto-gasto").value,
      importe: document.getElementById("importe-gasto").value,
      fecha: document.getElementById("fecha-gasto").value,
      vehiculoId: document.getElementById("vehiculo-gasto").value
    };

    datos.gastos.push(gasto);

    guardarDatos(datos);
    window.location.href = "economia.html";
  });
}

// SERVICE WORKER

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker.register("sw.js");
  });
}

// INICIAR FUNCIONES

mostrarResumen();
mostrarVehiculos();
mostrarMantenimientos();
mostrarGastos();

cargarVehiculosEnSelectores();

activarFormularioVehiculo();
activarFormularioMantenimiento();
activarFormularioGasto();
