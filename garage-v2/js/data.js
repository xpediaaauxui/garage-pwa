
window.GarageData = {
  key: "garage_app_v1",
  defaults: {
    profile: {name:"Alex Driver", username:"@alexdriver", city:"Buenos Aires", bio:"Fanático de los autos y los proyectos bien hechos.", email:"alex@email.com"},
    vehicles: [{id:1,brand:"Ford",model:"Fiesta Kinetic Titanium",year:2011,plate:"AB 123 CD",km:142500,color:"Verde",fuel:"Nafta",engine:"1.6",notes:"Uso diario",emoji:"🚘"}],
    services: [{id:1,vehicleId:1,type:"Cambio de aceite",date:"2026-10-12",km:140000,cost:85000,workshop:"Taller Norte",notes:"Aceite y filtros"}],
    expenses: [{id:1,vehicleId:1,type:"Seguro",date:"2026-11-02",amount:62000,notes:"Cuota mensual"}],
    fuel: [{id:1,vehicleId:1,date:"2026-11-10",liters:35,price:66500,km:142200,station:"YPF"}],
    reminders: [{id:1,title:"Revisar neumáticos",date:"2026-11-25",vehicleId:1,done:false}],
    mods: [{id:1,vehicleId:1,title:"Llantas",category:"Exterior",status:"Idea",cost:0,notes:"Buscar opciones compatibles"}],
    posts: [{id:1,user:"Garage Team",time:"Hace 2 h",title:"¿Qué mantenimiento preventivo hacen antes de un viaje largo?",body:"Estamos armando una checklist para la comunidad. ¿Qué revisan siempre antes de salir a la ruta?",likes:12,comments:3,saved:false,emoji:"🛞"}],
    comments: [],
    settings: {theme:"dark",currency:"ARS",notifications:true}
  },
  get(){let saved=localStorage.getItem(this.key);if(!saved){this.save(this.defaults);return structuredClone(this.defaults)}try{return JSON.parse(saved)}catch(e){this.save(this.defaults);return structuredClone(this.defaults)}},
  save(data){localStorage.setItem(this.key,JSON.stringify(data))},
  update(fn){let d=this.get();fn(d);this.save(d);return d},
  id(){return Date.now()+Math.floor(Math.random()*1000)},
  money(n){return new Intl.NumberFormat("es-AR",{style:"currency",currency:"ARS",maximumFractionDigits:0}).format(Number(n)||0)},
  date(s){if(!s)return "Sin fecha";return new Date(s+"T12:00:00").toLocaleDateString("es-AR",{day:"2-digit",month:"short",year:"numeric"})}
};
