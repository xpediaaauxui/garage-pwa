/*
 * Datos de ejemplo y almacenamiento local de GARAGE.
 * localStorage conserva la información en el navegador actual.
 */
window.GarageData = {
  key: "garage_app_v1",

  defaults: {
    profile: {
      name: "Alex Driver",
      username: "@alexdriver",
      city: "Buenos Aires",
      bio: "Fanático de los autos y los proyectos bien hechos.",
      email: "alex@email.com"
    },
    vehicles: [
      {
        id: 1,
        brand: "Ford",
        model: "Fiesta Kinetic Titanium",
        year: 2011,
        plate: "AB 123 CD",
        km: 142500,
        color: "Verde",
        fuel: "Nafta",
        engine: "1.6",
        notes: "Uso diario",
        emoji: "🚘"
      }
    ],
    services: [
      {
        id: 1,
        vehicleId: 1,
        type: "Cambio de aceite",
        date: "2026-10-12",
        km: 140000,
        cost: 85000,
        workshop: "Taller Norte",
        notes: "Aceite y filtros"
      }
    ],
    expenses: [
      {
        id: 1,
        vehicleId: 1,
        type: "Seguro",
        date: "2026-11-02",
        amount: 62000,
        notes: "Cuota mensual"
      }
    ],
    fuel: [
      {
        id: 1,
        vehicleId: 1,
        date: "2026-11-10",
        liters: 35,
        price: 66500,
        km: 142200,
        station: "YPF"
      }
    ],
    reminders: [
      {
        id: 1,
        title: "Revisar neumáticos",
        date: "2026-11-25",
        vehicleId: 1,
        done: false
      }
    ],
    mods: [
      {
        id: 1,
        vehicleId: 1,
        title: "Llantas",
        category: "Exterior",
        status: "Idea",
        cost: 0,
        notes: "Buscar opciones compatibles"
      }
    ],
    posts: [
      {
        id: 1,
        user: "Garage Team",
        time: "Hace 2 h",
        title: "¿Qué mantenimiento preventivo hacen antes de un viaje largo?",
        body: "Estamos armando una checklist para la comunidad. ¿Qué revisan siempre antes de salir a la ruta?",
        likes: 12,
        comments: 3,
        saved: false,
        emoji: "🛞"
      }
    ],
    comments: [],
    settings: {
      theme: "dark",
      currency: "ARS",
      notifications: true
    }
  },

  // Si todavía no hay datos guardados, carga la información de ejemplo.
  get: function () {
    var saved = localStorage.getItem(this.key);

    if (!saved) {
      this.save(this.defaults);
      return JSON.parse(JSON.stringify(this.defaults));
    }

    try {
      return JSON.parse(saved);
    } catch (error) {
      this.save(this.defaults);
      return JSON.parse(JSON.stringify(this.defaults));
    }
  },

  // Guarda el objeto completo como texto JSON.
  save: function (data) {
    localStorage.setItem(this.key, JSON.stringify(data));
  },

  // Lee los datos, ejecuta el cambio y vuelve a guardar.
  update: function (callback) {
    var data = this.get();
    callback(data);
    this.save(data);
    return data;
  },

  // Genera un identificador para cada registro nuevo.
  id: function () {
    return Date.now() + Math.floor(Math.random() * 1000);
  },

  money: function (amount) {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0
    }).format(Number(amount) || 0);
  },

  date: function (value) {
    if (!value) {
      return "Sin fecha";
    }

    return new Date(value + "T12:00:00").toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  }
};
