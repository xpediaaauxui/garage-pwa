
(function(){
const PAGES = window.GARAGE_PAGES || {};
const pages = PAGES;
const page = document.body.dataset.page || "index";
const d = GarageData.get();
const $ = (s,root=document)=>root.querySelector(s);
const money = GarageData.money;
const link = (slug,label,cls="")=>`<a class="${cls}" href="${slug}.html">${label}</a>`;
const navGroups = [
 ["GENERAL",[["index","⌂","Inicio"],["actividad","◷","Actividad"],["notificaciones","♢","Notificaciones"],["buscar","⌕","Buscar"]]],
 ["GARAGE",[["vehiculos","▣","Mis vehículos"],["mantenimiento","⚙","Mantenimiento"],["economia","＄","Economía"],["modificaciones","✦","Modificaciones"]]],
 ["COMUNIDAD",[["comunidad","◎","Comunidad"],["perfil","◉","Mi perfil"]]]
];
function navItem(item){return `<a class="nav-link-g ${page===item[0]?"nav-link-g--active":""}" href="${item[0]}.html"><span class="nav-link-g__icon">${item[1]}</span>${item[2]}</a>`}
function shell(content){
 let side=navGroups.map(g=>`<div class="nav-group"><div class="nav-group__title">${g[0]}</div>${g[1].map(navItem).join("")}</div>`).join("");
 let mobile=[["index","⌂","Inicio"],["vehiculos","▣","Garaje"],["mantenimiento","⚙","Servicio"],["comunidad","◎","Comunidad"],["perfil","◉","Perfil"]];
 document.getElementById("app").innerHTML=`<div class="app-layout"><aside class="sidebar"><a class="brand" href="index.html"><span class="brand__mark">G</span><span><span class="brand__name">GARAGE</span><small class="brand__tag">RACING / PERFORMANCE</small></span></a>${side}<div class="panel mt-4"><div class="tag">GARAGE PRO</div><p class="small mt-2 mb-1 fw-bold">Tu auto, bajo control.</p><p class="panel__muted mb-0">Registrá cada detalle de tu vehículo.</p></div></aside><div class="main-area"><header class="topbar"><div><div class="topbar__eyebrow">Racing / Performance</div><div class="topbar__title">${pages[page]?.title||"GARAGE"}</div></div><div class="topbar__actions"><a class="icon-button" href="notificaciones.html" aria-label="Notificaciones">♢</a><a class="avatar" href="perfil.html">${(d.profile.name||"G").charAt(0).toUpperCase()}</a></div></header><main class="content">${content}</main></div></div><nav class="mobile-nav">${mobile.map(x=>`<a class="mobile-nav__item ${page===x[0]?"mobile-nav__item--active":""}" href="${x[0]}.html"><span>${x[1]}</span><span>${x[2]}</span></a>`).join("")}</nav><div id="toast-root"></div>`;
}
function heading(title,desc,action=""){return `<div class="page-heading"><div><div class="page-heading__eyebrow">${pages[page]?.section||"GARAGE"}</div><h1 class="page-heading__title">${title}</h1><p class="page-heading__description">${desc||""}</p></div>${action}</div>`}
function panel(title,body,extra=""){return `<section class="panel ${extra}"><h2 class="panel__title">${title}</h2>${body}</section>`}
function empty(icon,title,txt,cta=""){return `<div class="empty-state"><div class="empty-state__icon">${icon}</div><div class="empty-state__title">${title}</div><p class="empty-state__text">${txt}</p>${cta}</div>`}
function stat(label,value,detail,icon="↗"){return `<div class="stat-card"><div class="d-flex justify-content-between"><span class="stat-card__label">${label}</span><span class="stat-card__accent">${icon}</span></div><div class="stat-card__value">${value}</div><div class="stat-card__detail">${detail}</div></div>`}
function rows(items,render){return items.length?`<div class="data-list">${items.map(render).join("")}</div>`:empty("＋","Todavía no hay registros","Cuando agregues información, aparecerá en esta sección.")}
function formField(label,name,type="text",placeholder="",required=false,value="",opts=null){let input=opts?`<select class="form-select" name="${name}" ${required?"required":""}>${opts.map(o=>`<option value="${o}" ${value===o?"selected":""}>${o}</option>`).join("")}</select>`:`<input class="form-control" type="${type}" name="${name}" placeholder="${placeholder}" value="${value??""}" ${required?"required":""}>`;return `<div class="col-12 col-md-6"><label class="form-label">${label}</label>${input}</div>`}
// VehiclesDB: catálogo abierto de marcas y modelos. Se carga desde CDN y queda
// disponible en la caché del Service Worker para próximas visitas sin conexión.
const VEHICLESDB_URL = "https://cdn.jsdelivr.net/gh/vehiclesdb/vehiclesdb@v2026.11.10/dist/vehicles.json";
let VEHICLE_CATALOG = {};
let VEHICLE_BRANDS = [];
let VEHICLE_DB_VERSION = "";
let VEHICLE_DB_READY = false;
const KM_OPTIONS = [0,...Array.from({length:30},(_,i)=>(i+1)*10000),350000,400000,450000,500000];
const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({length:CURRENT_YEAR-1980+1},(_,i)=>String(CURRENT_YEAR-i));
function selectField(label,name,options,value="",required=false,placeholder="Seleccionar..."){
 const normalized=String(value??"");
 const list=options.map(o=>String(o));
 if(normalized && !list.includes(normalized)) list.unshift(normalized);
 return `<div class="col-12 col-md-6"><label class="form-label" for="field-${name}">${label}</label><select class="form-select" id="field-${name}" name="${name}" ${required?"required":""}><option value="">${placeholder}</option>${list.map(o=>`<option value="${o.replace(/"/g,"&quot;")}" ${normalized===o?"selected":""}>${o}</option>`).join("")}</select></div>`;
}
function searchableVehicleField(label,name,options,value="",disabled=false,placeholder="Escribí para buscar..."){
 const selected=String(value??"");
 const safe=(text)=>String(text).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
 return `<div class="col-12 col-md-6 searchable-field"><label class="form-label" for="field-${name}">${label}</label><div class="searchable-field__control"><input class="form-control searchable-field__input" id="field-${name}" name="${name}" type="text" value="${safe(selected)}" placeholder="${placeholder}" autocomplete="off" data-searchable-select="${name}" ${disabled?"disabled":""} required aria-autocomplete="list" aria-expanded="false"><div class="searchable-field__menu" data-search-menu="${name}" hidden></div></div>${name==="model"?'<input type="hidden" name="vehiclesdbId" value="">':''}<div class="form-text" data-search-help="${name}" aria-live="polite">${name==="brand"?"Escribí parte de la marca, por ejemplo: fo → Ford.":"Los modelos disponibles dependen de la marca seleccionada."}</div></div>`;
}
function vehicleBrandField(value=""){return searchableVehicleField("Marca","brand",VEHICLE_BRANDS,value,false,"Buscar marca...")}
function vehicleModelField(brand="",value=""){
 return searchableVehicleField("Modelo","model",VEHICLE_CATALOG[brand]||[],value,!brand,brand?"Buscar modelo...":"Primero seleccioná una marca");
}
function vehicleKmOptions(){return KM_OPTIONS.map(k=>k.toLocaleString("es-AR")+" km")}
function kmValueFromLabel(label){return Number(String(label).replace(/[^0-9]/g,""))||0}

function formPage(title,desc,action,fields,submit="Guardar"){return `${heading(title,desc)}<section class="panel"><form data-form="${action}" class="row g-3">${fields.join("")}<div class="col-12 d-flex gap-2 mt-3"><button class="btn-garage" type="submit">${submit}</button><a class="btn-outline-garage" href="index.html">Cancelar</a></div></form></section>`}
function vehicleOptions(){return d.vehicles.map(v=>({value:v.id,label:v.brand+" "+v.model}));}
function vehicleSelect(){return `<div class="col-12 col-md-6"><label class="form-label">Vehículo</label><select class="form-select" name="vehicleId">${d.vehicles.map(v=>`<option value="${v.id}">${v.brand} ${v.model}</option>`).join("")}</select></div>`}
function vehicleCards(){return d.vehicles.map(v=>`<div class="col-12 col-md-6 col-xl-4"><article class="vehicle-card"><div class="vehicle-card__visual">${v.emoji||"🚘"}<span class="tag position-absolute top-0 end-0 m-3">${v.year}</span></div><div class="vehicle-card__body"><div class="vehicle-card__name">${v.brand} ${v.model}</div><div class="vehicle-card__meta">${v.plate||"Sin patente"} · ${Number(v.km||0).toLocaleString("es-AR")} km</div><div class="d-flex gap-2">${link("vehiculo-detalle","Ver vehículo","btn-garage flex-grow-1 text-center")}${link("vehiculo-editar","Editar","btn-outline-garage")}</div></div></article></div>`).join("")}
function dashboard(){let total=d.vehicles.length,spent=d.expenses.reduce((a,x)=>a+Number(x.amount),0)+d.fuel.reduce((a,x)=>a+Number(x.price),0);return `${heading("Tu garage, en marcha.","Todo lo que pasa con tus vehículos, organizado en un solo lugar.",link("vehiculo-nuevo","+ Agregar vehículo","btn-garage"))}<div class="row g-3 mb-4">${stat("Vehículos",total,"En tu garaje","▣")}${stat("Gastos registrados",money(spent),"Total acumulado","＄")}${stat("Servicios",d.services.length,"En el historial","⚙")}${stat("Recordatorios",d.reminders.filter(x=>!x.done).length,"Pendientes","◷")}</div><div class="row g-3"><div class="col-12 col-xl-7">${panel("Mis vehículos",d.vehicles.length?`<div class="row g-3">${vehicleCards()}</div>`:empty("🚘","Tu garaje está vacío","Agregá tu primer vehículo para empezar.",link("vehiculo-nuevo","Agregar vehículo","btn-garage")))}<div class="mt-3">${panel("Actividad reciente",rows([...d.services.map(x=>({...x,kind:"Servicio",label:x.type,amount:x.cost})),...d.expenses.map(x=>({...x,kind:"Gasto",label:x.type,amount:x.amount}))].slice(-4).reverse(),x=>`<div class="data-row"><div class="data-row__main"><p class="data-row__title">${x.label}</p><p class="data-row__meta">${x.kind} · ${GarageData.date(x.date)}</p></div><div class="data-row__value">${money(x.amount)}</div></div>`))}</div></div><div class="col-12 col-xl-5">${panel("Accesos rápidos",`<div class="d-grid gap-2">${link("mantenimiento-nuevo","＋ Registrar mantenimiento","btn-outline-garage text-start")}${link("gasto-nuevo","＋ Registrar gasto","btn-outline-garage text-start")}${link("combustible-nuevo","＋ Cargar combustible","btn-outline-garage text-start")}${link("publicacion-nueva","＋ Crear publicación","btn-outline-garage text-start")}</div>`)}<div class="mt-3">${panel("Próximos recordatorios",rows(d.reminders.filter(x=>!x.done).slice(0,3),x=>`<div class="data-row"><div class="data-row__main"><p class="data-row__title">${x.title}</p><p class="data-row__meta">${GarageData.date(x.date)}</p></div><span class="tag">Pendiente</span></div>`))}</div></div></div>`}
function vehicleDetail(){let v=d.vehicles[0];if(!v)return heading("Detalle del vehículo","No hay vehículos cargados.");return `${heading("Detalle del vehículo","Información principal de tu vehículo.",link("vehiculo-editar","Editar vehículo","btn-garage"))}<div class="row g-3"><div class="col-12 col-lg-5"><div class="vehicle-card"><div class="vehicle-card__visual" style="height:220px;font-size:90px">${v.emoji||"🚘"}</div><div class="vehicle-card__body"><div class="tag">VEHÍCULO PRINCIPAL</div><h2 class="h4 fw-bold mt-3">${v.brand} ${v.model}</h2><p class="panel__muted">${v.year} · ${v.color||"Color no indicado"} · ${v.plate||"Sin patente"}</p><div class="d-flex gap-2">${link("vehiculo-galeria","Galería","btn-outline-garage")}${link("vehiculo-ficha","Ficha técnica","btn-outline-garage")}</div></div></div></div><div class="col-12 col-lg-7">${panel("Datos generales",`<div class="row g-3">${[["Kilometraje",Number(v.km||0).toLocaleString("es-AR")+" km"],["Motor",v.engine||"—"],["Combustible",v.fuel||"—"],["Patente",v.plate||"—"],["Uso",v.notes||"—"]].map(a=>`<div class="col-6"><div class="stat-card"><div class="stat-card__label">${a[0]}</div><div class="fw-bold mt-2">${a[1]}</div></div></div>`).join("")}</div>`)}</div></div>`}
function render(){
 let c="";
 switch(page){
 case "index": c=dashboard();break;
 case "actividad": c=heading("Actividad reciente","Un registro de los últimos movimientos de tu garage.")+rows([...d.services.map(x=>({...x,kind:"Mantenimiento",label:x.type,amount:x.cost})),...d.expenses.map(x=>({...x,kind:"Gasto",label:x.type,amount:x.amount})),...d.fuel.map(x=>({...x,kind:"Combustible",label:"Carga de combustible",amount:x.price}))].sort((a,b)=>b.id-a.id),x=>`<div class="data-row"><div class="data-row__main"><p class="data-row__title">${x.label}</p><p class="data-row__meta">${x.kind} · ${GarageData.date(x.date)}</p></div><div class="data-row__value">${money(x.amount)}</div></div>`);break;
 case "notificaciones": c=heading("Notificaciones","Avisos y recordatorios de tu actividad.")+rows(d.reminders.filter(x=>!x.done),x=>`<div class="data-row"><div class="data-row__main"><p class="data-row__title">${x.title}</p><p class="data-row__meta">Recordatorio · ${GarageData.date(x.date)}</p></div><button class="btn-outline-garage" data-done-reminder="${x.id}">Marcar hecho</button></div>`);break;
 case "buscar": c=heading("Búsqueda global","Buscá vehículos, gastos, servicios y publicaciones.")+`<div class="panel"><input class="form-control" id="global-search" placeholder="Ej. cambio de aceite, Fiesta, combustible..."><div id="search-results" class="data-list mt-3"></div></div>`;break;
 case "vehiculos": c=heading("Mi garaje","Administrá los vehículos que tenés registrados.",link("vehiculo-nuevo","+ Agregar vehículo","btn-garage"))+`<div class="row g-3">${d.vehicles.length?vehicleCards():`<div class="col-12">${empty("🚘","Todavía no tenés vehículos","Agregá uno para registrar su mantenimiento y gastos.",link("vehiculo-nuevo","Agregar vehículo","btn-garage"))}</div>`}</div>`;break;
 case "vehiculo-nuevo": c=formPage("Agregar vehículo","Completá los datos principales para registrar un vehículo.","vehicle",[vehicleBrandField(),vehicleModelField(),selectField("Año","year",YEAR_OPTIONS,String(new Date().getFullYear()),true),formField("Patente","plate","text","AA 000 AA"),selectField("Kilometraje","km",vehicleKmOptions(),"0 km",false,"Seleccioná el kilometraje..."),selectField("Color","color",["Blanco","Negro","Gris","Plateado","Rojo","Azul","Verde","Beige","Marrón","Amarillo","Naranja","Otro"]),selectField("Combustible","fuel",["Nafta","Diésel","GNC","Híbrido","Eléctrico"]),selectField("Transmisión","transmission",["Manual","Automática","CVT","Automatizada"]),selectField("Carrocería","bodyType",["Hatchback","Sedán","SUV","Pick-up","Coupé","Familiar","Monovolumen","Otro"]),formField("Motor","engine","text","Ej. 1.6"),formField("Notas","notes","text","Uso diario")],"Guardar vehículo");break;
 case "vehiculo-detalle": c=vehicleDetail();break;
 case "vehiculo-editar": {let v=d.vehicles[0]||{};let kmLabel=vehicleKmOptions().find(x=>kmValueFromLabel(x)===Number(v.km))||((Number(v.km)||0).toLocaleString("es-AR")+" km");c=formPage("Editar vehículo","Actualizá los datos del vehículo principal.","edit-vehicle",[vehicleBrandField(v.brand),vehicleModelField(v.brand,v.model),selectField("Año","year",YEAR_OPTIONS,String(v.year||""),true),formField("Patente","plate","text","AA 000 AA",false,v.plate),selectField("Kilometraje","km",vehicleKmOptions(),kmLabel,false,"Seleccioná el kilometraje..."),selectField("Color","color",["Blanco","Negro","Gris","Plateado","Rojo","Azul","Verde","Beige","Marrón","Amarillo","Naranja","Otro"],v.color),selectField("Combustible","fuel",["Nafta","Diésel","GNC","Híbrido","Eléctrico"],v.fuel),selectField("Transmisión","transmission",["Manual","Automática","CVT","Automatizada"],v.transmission),selectField("Carrocería","bodyType",["Hatchback","Sedán","SUV","Pick-up","Coupé","Familiar","Monovolumen","Otro"],v.bodyType),formField("Motor","engine","text","Ej. 1.6",false,v.engine),formField("Notas","notes","text","Uso diario",false,v.notes)],"Guardar cambios");break}
 case "vehiculo-galeria": c=heading("Galería del vehículo","Espacio visual para organizar fotos del auto.")+panel("Galería",empty("▧","Todavía no hay fotos","La galería está preparada como sección. La carga de archivos se puede incorporar en una siguiente etapa."));break;
 case "vehiculo-ficha": c=vehicleDetail();break;
 case "mantenimiento": c=heading("Mantenimiento","Controlá servicios realizados y próximos trabajos.",link("mantenimiento-nuevo","+ Registrar servicio","btn-garage"))+`<div class="row g-3 mb-3"><div class="col-6">${stat("Servicios",d.services.length,"Registrados","⚙")}</div><div class="col-6">${stat("Recordatorios",d.reminders.filter(x=>!x.done).length,"Pendientes","◷")}</div></div>`+panel("Próximos recordatorios",rows(d.reminders.filter(x=>!x.done),x=>`<div class="data-row"><div class="data-row__main"><p class="data-row__title">${x.title}</p><p class="data-row__meta">${GarageData.date(x.date)}</p></div><span class="tag">Pendiente</span></div>`))+`<div class="mt-3">${panel("Últimos servicios",rows(d.services.slice().reverse(),x=>`<div class="data-row"><div class="data-row__main"><p class="data-row__title">${x.type}</p><p class="data-row__meta">${GarageData.date(x.date)} · ${Number(x.km||0).toLocaleString("es-AR")} km</p></div><div class="data-row__value">${money(x.cost)}</div></div>`))}</div>`;break;
 case "mantenimiento-nuevo": c=formPage("Registrar servicio","Guardá cada mantenimiento realizado.","service",[formField("Tipo de servicio","type","text","Ej. Cambio de aceite",true),formField("Fecha","date","date","",true),formField("Kilometraje","km","number","",true),formField("Costo","cost","number","",true),formField("Taller","workshop","text","Nombre del taller"),formField("Notas","notes","text","Detalles del trabajo")]);break;
 case "mantenimiento-historial": c=heading("Historial de servicios","Todos los trabajos registrados en tus vehículos.") + rows(d.services.slice().reverse(),x=>`<div class="data-row"><div class="data-row__main"><p class="data-row__title">${x.type}</p><p class="data-row__meta">${GarageData.date(x.date)} · ${x.workshop||"Sin taller"} · ${x.km||0} km</p></div><div class="data-row__value">${money(x.cost)}</div></div>`);break;
 case "mantenimiento-detalle": c=heading("Detalle del servicio","Información del último servicio registrado.")+rows(d.services.slice(-1),x=>`<div class="data-row"><div class="data-row__main"><p class="data-row__title">${x.type}</p><p class="data-row__meta">${GarageData.date(x.date)} · ${x.workshop||"Sin taller"} · ${x.notes||""}</p></div><div class="data-row__value">${money(x.cost)}</div></div>`);break;
 case "recordatorios": c=heading("Recordatorios","No dejes pasar un mantenimiento importante.",link("recordatorio-nuevo","+ Nuevo recordatorio","btn-garage"))+rows(d.reminders,x=>`<div class="data-row"><div class="data-row__main"><p class="data-row__title">${x.title}</p><p class="data-row__meta">${GarageData.date(x.date)}</p></div><button class="btn-outline-garage" data-done-reminder="${x.id}">${x.done?"Hecho":"Marcar hecho"}</button></div>`);break;
 case "recordatorio-nuevo": c=formPage("Nuevo recordatorio","Creá un aviso para una tarea futura.","reminder",[formField("Título","title","text","Ej. Rotación de neumáticos",true),formField("Fecha","date","date","",true)]);break;
 case "economia": {let total=d.expenses.reduce((a,x)=>a+Number(x.amount),0)+d.fuel.reduce((a,x)=>a+Number(x.price),0);c=heading("Economía","Tené control de cuánto cuesta mantener tu vehículo.")+`<div class="row g-3 mb-3"><div class="col-6">${stat("Gasto total",money(total),"Gastos + combustible","＄")}</div><div class="col-6">${stat("Registros",d.expenses.length+d.fuel.length,"Movimientos","◷")}</div></div><div class="row g-3"><div class="col-12 col-lg-6">${panel("Acciones",`<div class="d-grid gap-2">${link("gasto-nuevo","＋ Registrar gasto","btn-outline-garage text-start")}${link("combustible-nuevo","＋ Cargar combustible","btn-outline-garage text-start")}${link("gastos-historial","Ver historial","btn-outline-garage text-start")}${link("economia-estadisticas","Ver estadísticas","btn-outline-garage text-start")}</div>`)}</div><div class="col-12 col-lg-6">${panel("Últimos movimientos",rows([...d.expenses,...d.fuel].slice(-5).reverse(),x=>`<div class="data-row"><div class="data-row__main"><p class="data-row__title">${x.type||"Combustible"}</p><p class="data-row__meta">${GarageData.date(x.date)}</p></div><div class="data-row__value">${money(x.amount||x.price)}</div></div>`))}</div></div>`;break}
 case "gasto-nuevo": c=formPage("Registrar gasto","Anotá los gastos relacionados con tu vehículo.","expense",[formField("Categoría","type","text","Ej. Seguro, patente, repuestos",true),formField("Fecha","date","date","",true),formField("Importe (ARS)","amount","number","",true),formField("Descripción","notes","text","Detalle opcional")]);break;
 case "combustible-nuevo": c=formPage("Cargar combustible","Registrá cada carga para seguir el consumo.","fuel",[formField("Fecha","date","date","",true),formField("Litros","liters","number","",true),formField("Importe (ARS)","price","number","",true),formField("Kilometraje","km","number",""),formField("Estación","station","text","Ej. YPF")]);break;
 case "gastos-historial": c=heading("Historial de gastos","Todos los movimientos económicos registrados.")+rows([...d.expenses.map(x=>({...x,label:x.type,value:x.amount})),...d.fuel.map(x=>({...x,label:"Combustible · "+x.liters+" L",value:x.price}))].sort((a,b)=>b.id-a.id),x=>`<div class="data-row"><div class="data-row__main"><p class="data-row__title">${x.label}</p><p class="data-row__meta">${GarageData.date(x.date)}</p></div><div class="data-row__value">${money(x.value)}</div></div>`);break;
 case "economia-estadisticas": {let ex=d.expenses.reduce((a,x)=>a+Number(x.amount),0),fu=d.fuel.reduce((a,x)=>a+Number(x.price),0),tot=ex+fu;c=heading("Estadísticas económicas","Un resumen de los importes que registraste.")+`<div class="row g-3"><div class="col-12 col-md-4">${stat("Gastos",money(ex),"Otros conceptos","＄")}</div><div class="col-12 col-md-4">${stat("Combustible",money(fu),"Cargas registradas","⛽")}</div><div class="col-12 col-md-4">${stat("Total",money(tot),"Acumulado","↗")}</div></div>`;break}
 case "modificaciones": c=heading("Modificaciones","Registrá mejoras, cambios y personalizaciones.",link("modificacion-nueva","+ Agregar modificación","btn-garage"))+rows(d.mods,x=>`<div class="data-row"><div class="data-row__main"><p class="data-row__title">${x.title}</p><p class="data-row__meta">${x.category} · ${x.status}</p></div><div class="data-row__value">${money(x.cost)}</div></div>`);break;
 case "modificacion-nueva": c=formPage("Agregar modificación","Anotá una mejora realizada o que quieras realizar.","mod",[formField("Nombre","title","text","Ej. Suspensión",true),formField("Categoría","category","text","Ej. Exterior"),formField("Estado","status","text","Idea / En proceso / Instalada"),formField("Costo estimado","cost","number","0"),formField("Notas","notes","text","Detalles")]);break;
 case "modificacion-detalle": c=heading("Detalle de modificación","Consultá el estado de tus proyectos.")+rows(d.mods.slice(-1),x=>`<div class="data-row"><div class="data-row__main"><p class="data-row__title">${x.title}</p><p class="data-row__meta">${x.category} · ${x.status} · ${x.notes||""}</p></div><div class="data-row__value">${money(x.cost)}</div></div>`);break;
 case "proyectos": c=heading("Proyectos pendientes","Ideas y trabajos que todavía no terminaste.")+rows(d.mods.filter(x=>x.status!=="Instalada"),x=>`<div class="data-row"><div class="data-row__main"><p class="data-row__title">${x.title}</p><p class="data-row__meta">${x.category} · ${x.status}</p></div><span class="tag">Pendiente</span></div>`);break;
 case "comunidad": c=heading("Comunidad","Compartí experiencias, consultas y proyectos.",link("publicacion-nueva","+ Crear publicación","btn-garage"))+`<div class="row g-3"><div class="col-12 col-xl-8">${d.posts.slice().reverse().map(postCard).join("")||empty("◎","Todavía no hay publicaciones","Sé el primero en compartir algo.",link("publicacion-nueva","Crear publicación","btn-garage"))}</div><div class="col-12 col-xl-4">${panel("Tu comunidad",`<p class="panel__muted">Un espacio para compartir proyectos, aprender y conversar sobre autos.</p>${link("comunidad-explorar","Explorar publicaciones","btn-outline-garage d-block text-center mb-2")}${link("guardados","Ver guardados","btn-outline-garage d-block text-center")}`)}</div></div>`;break;
 case "comunidad-explorar": c=heading("Explorar publicaciones","Descubrí conversaciones de la comunidad.")+d.posts.slice().reverse().map(postCard).join("");break;
 case "publicacion-nueva": c=formPage("Crear publicación","Compartí una consulta, una idea o un proyecto.","post",[formField("Título","title","text","¿Qué querés compartir?",true),formField("Contenido","body","text","Escribí tu publicación...",true)]);break;
 case "publicacion-detalle": c=heading("Publicación","Detalle del contenido compartido.")+(d.posts.length?postCard(d.posts[d.posts.length-1]):empty("◎","No hay publicaciones","Creá una publicación para empezar."));break;
 case "comentarios": c=heading("Comentarios","Conversación de la publicación.")+rows(d.comments,x=>`<div class="data-row"><div class="data-row__main"><p class="data-row__title">${x.user}</p><p class="data-row__meta">${x.body}</p></div></div>`)+`<form data-form="comment" class="panel mt-3"><label class="form-label">Agregar comentario</label><input class="form-control mb-3" name="body" required placeholder="Escribí un comentario..."><button class="btn-garage">Comentar</button></form>`;break;
 case "guardados": c=heading("Publicaciones guardadas","Contenido que querés volver a consultar.")+d.posts.filter(x=>x.saved).map(postCard).join("");if(!d.posts.some(x=>x.saved))c+=empty("☆","Todavía no guardaste publicaciones","Usá el botón Guardar en una publicación.");break;
 case "perfil": c=heading("Mi perfil","Tu identidad dentro de GARAGE.",link("perfil-editar","Editar perfil","btn-garage"))+panel("Perfil",`<div class="d-flex align-items-center gap-3"><div class="avatar" style="width:64px;height:64px;font-size:24px">${(d.profile.name||"G")[0]}</div><div><h2 class="h5 fw-bold mb-1">${d.profile.name}</h2><p class="panel__muted mb-0">${d.profile.username} · ${d.profile.city}</p></div></div><hr class="section-divider"><p>${d.profile.bio||""}</p><div class="row g-2"><div class="col-6">${stat("Vehículos",d.vehicles.length,"En el garaje")}</div><div class="col-6">${stat("Publicaciones",d.posts.length,"En comunidad")}</div></div>`);break;
 case "perfil-editar": c=formPage("Editar perfil","Actualizá la información de tu cuenta.","profile",[formField("Nombre","name","text","",true,d.profile.name),formField("Usuario","username","text","",false,d.profile.username),formField("Ciudad","city","text","",false,d.profile.city),formField("Email","email","email","",false,d.profile.email),formField("Biografía","bio","text","",false,d.profile.bio)]);break;
 case "configuracion": c=heading("Configuración","Administrá las opciones generales de GARAGE.")+panel("Preferencias",`<div class="data-row"><div class="data-row__main"><p class="data-row__title">Notificaciones</p><p class="data-row__meta">Avisos de recordatorios y actividad</p></div><input type="checkbox" id="notifications-toggle" ${d.settings.notifications?"checked":""}></div><div class="data-row mt-2"><div class="data-row__main"><p class="data-row__title">Moneda</p><p class="data-row__meta">Moneda para mostrar importes</p></div><span class="tag">${d.settings.currency}</span></div><div class="mt-3">${link("preferencias","Más preferencias","btn-outline-garage")}</div>`);break;
 case "preferencias": c=heading("Preferencias","Ajustá cómo querés usar la aplicación.")+panel("Datos locales",`<p class="panel__muted">Los datos de GARAGE se guardan en este navegador mediante localStorage.</p><button class="btn-outline-garage" data-export>Exportar mis datos</button> <button class="btn-outline-garage" data-reset>Restablecer datos de ejemplo</button>`);break;
 case "ayuda": c=heading("Ayuda y soporte","Información para usar GARAGE.")+panel("Preguntas frecuentes",`<h3 class="h6 fw-bold">¿Dónde se guardan mis datos?</h3><p class="panel__muted">En el almacenamiento local de este navegador. No se envían a un servidor.</p><hr class="section-divider"><h3 class="h6 fw-bold">¿Puedo usar la app sin conexión?</h3><p class="panel__muted">Después de la primera carga, el Service Worker guarda los archivos principales para abrir la aplicación offline.</p><hr class="section-divider"><h3 class="h6 fw-bold">¿Cómo instalo GARAGE?</h3><p class="panel__muted">Desde el menú del navegador, elegí instalar aplicación o agregar a pantalla de inicio.</p>`);break;
 case "offline": c=heading("Estás sin conexión","GARAGE no pudo cargar contenido nuevo.")+empty("⌁","Seguís teniendo acceso a la app","Volvé al inicio para consultar los datos guardados.",link("index","Ir al inicio","btn-garage"));break;
 default: c=heading("Sección","Contenido en preparación.");
 }
 shell(c);
 bind();
}
function postCard(p){return `<article class="feed-card mb-3"><div class="feed-card__top"><div class="avatar">${(p.user||"G")[0]}</div><div><div class="fw-bold small">${p.user}</div><div class="panel__muted">${p.time}</div></div></div><h2 class="h6 fw-bold">${p.title}</h2><p class="small text-light-emphasis mb-2">${p.body}</p><div class="feed-card__photo">${p.emoji||"🚘"}</div><div class="feed-card__actions"><button class="btn btn-link p-0 text-decoration-none text-secondary" data-like="${p.id}">♡ ${p.likes||0} Me gusta</button><a class="muted-link" href="comentarios.html">Comentarios (${p.comments||0})</a><button class="btn btn-link p-0 text-decoration-none text-secondary" data-save="${p.id}">${p.saved?"★ Guardado":"☆ Guardar"}</button></div></article>`}
function toast(msg){let root=$("#toast-root");if(!root)return;root.innerHTML=`<div class="toast-garage">${msg}</div>`;setTimeout(()=>root.innerHTML="",2600)}
function bind(){
 const brandInput=$('input[data-searchable-select="brand"]');
 const modelInput=$('input[data-searchable-select="model"]');
 const normalizeSearch=(value)=>String(value||"").normalize("NFD").replace(/[\\u0300-\\u036f]/g,"").toLowerCase().trim();
 function optionsForSearch(input){
  if(input.dataset.searchableSelect==="brand")return VEHICLE_BRANDS;
  if(input.dataset.searchableSelect==="model")return VEHICLE_CATALOG[brandInput?.value]||[];
  return [];
 }
 function renderSearchMenu(input){
  const key=input.dataset.searchableSelect;
  const menu=$(`[data-search-menu="${key}"]`);
  if(!menu)return;
  const query=normalizeSearch(input.value);
  const matches=optionsForSearch(input).filter(option=>normalizeSearch(typeof option==="string"?option:option.name).includes(query));
  const escapeHtml=value=>String(value).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  menu.innerHTML=matches.length?matches.map(option=>{const label=typeof option==="string"?option:option.name;const id=typeof option==="string"?"":option.id;return `<button type="button" class="searchable-field__option" data-search-option="${key}" data-value="${escapeHtml(label)}" data-model-id="${escapeHtml(id)}">${escapeHtml(label)}</button>`}).join(""):'<div class="searchable-field__empty">No se encontraron resultados</div>';
  menu.hidden=false;
  input.setAttribute("aria-expanded","true");
  input.setCustomValidity("Elegí una opción de la lista.");
 }
 function closeSearchMenu(input){
  const menu=$(`[data-search-menu="${input.dataset.searchableSelect}"]`);
  if(menu)menu.hidden=true;
  input.setAttribute("aria-expanded","false");
 }
 document.querySelectorAll("input[data-searchable-select]").forEach(input=>{
  input.addEventListener("focus",()=>renderSearchMenu(input));
  input.addEventListener("input",()=>{
   input.setCustomValidity("Elegí una opción de la lista.");
   if(input.dataset.searchableSelect==="model"){const idField=input.closest(".searchable-field")?.querySelector('input[name="vehiclesdbId"]');if(idField)idField.value="";}
   renderSearchMenu(input);
   if(input.dataset.searchableSelect==="brand"&&modelInput){
    modelInput.value="";
    modelInput.disabled=true;
    modelInput.setCustomValidity("");
    closeSearchMenu(modelInput);
   }
  });
  input.addEventListener("keydown",event=>{
   if(event.key==="Escape")closeSearchMenu(input);
   if(event.key==="Enter"){
    const first=$(`[data-search-menu="${input.dataset.searchableSelect}"] .searchable-field__option`);
    if(first&&!$(`[data-search-menu="${input.dataset.searchableSelect}"]`).hidden){event.preventDefault();first.click();}
   }
  });
 });
 document.addEventListener("click",event=>{
  const option=event.target.closest("[data-search-option]");
  if(option){
   const key=option.dataset.searchOption;
   const input=$(`input[data-searchable-select="${key}"]`);
   if(input){
    input.value=option.dataset.value;
    input.setCustomValidity("");
    closeSearchMenu(input);
    if(key==="model"){const idField=input.closest(".searchable-field")?.querySelector('input[name="vehiclesdbId"]');if(idField)idField.value=option.dataset.modelId||"";}
    if(key==="brand"&&modelInput){
     modelInput.value="";
     modelInput.disabled=false;
     modelInput.placeholder="Buscar modelo...";
     modelInput.setCustomValidity("");
     const modelId=modelInput.closest(".searchable-field")?.querySelector('input[name="vehiclesdbId"]');if(modelId)modelId.value="";
    }
   }
   return;
  }
  document.querySelectorAll("input[data-searchable-select]").forEach(input=>{
   if(!input.closest(".searchable-field").contains(event.target))closeSearchMenu(input);
  });
 });
 document.querySelectorAll("form[data-form]").forEach(form=>form.addEventListener("submit",e=>{e.preventDefault();let fd=new FormData(form),v=Object.fromEntries(fd.entries());GarageData.update(data=>{
 let id=GarageData.id();
 if(form.dataset.form==="vehicle")data.vehicles.push({...v,id,year:Number(v.year),km:kmValueFromLabel(v.km),vehiclesdbId:v.vehiclesdbId||"",emoji:"🚘"});
 if(form.dataset.form==="edit-vehicle"&&data.vehicles[0])data.vehicles[0]={...data.vehicles[0],...v,year:Number(v.year),km:kmValueFromLabel(v.km),vehiclesdbId:v.vehiclesdbId||data.vehicles[0].vehiclesdbId||""};
 if(form.dataset.form==="service")data.services.push({...v,id,km:Number(v.km),cost:Number(v.cost)});
 if(form.dataset.form==="expense")data.expenses.push({...v,id,amount:Number(v.amount)});
 if(form.dataset.form==="fuel")data.fuel.push({...v,id,liters:Number(v.liters),price:Number(v.price),km:Number(v.km||0)});
 if(form.dataset.form==="reminder")data.reminders.push({...v,id,done:false});
 if(form.dataset.form==="mod")data.mods.push({...v,id,cost:Number(v.cost||0)});
 if(form.dataset.form==="post")data.posts.push({...v,id,user:data.profile.name,time:"Ahora",likes:0,comments:0,saved:false,emoji:"🚘"});
 if(form.dataset.form==="profile")data.profile={...data.profile,...v};
 if(form.dataset.form==="comment")data.comments.push({...v,id,user:data.profile.name});
 });toast("Cambios guardados correctamente.");setTimeout(()=>location.href=form.dataset.form==="post"?"comunidad.html":form.dataset.form==="profile"?"perfil.html":form.dataset.form==="comment"?"comentarios.html":form.dataset.form==="vehicle"?"vehiculos.html":"index.html",500)}));
 document.querySelectorAll("[data-done-reminder]").forEach(b=>b.addEventListener("click",()=>{GarageData.update(x=>{let r=x.reminders.find(y=>y.id==b.dataset.doneReminder);if(r)r.done=!r.done});location.reload()}));
 document.querySelectorAll("[data-like]").forEach(b=>b.addEventListener("click",()=>{GarageData.update(x=>{let p=x.posts.find(y=>y.id==b.dataset.like);if(p)p.likes=(p.likes||0)+1});location.reload()}));
 document.querySelectorAll("[data-save]").forEach(b=>b.addEventListener("click",()=>{GarageData.update(x=>{let p=x.posts.find(y=>y.id==b.dataset.save);if(p)p.saved=!p.saved});location.reload()}));
 let search=$("#global-search");if(search)search.addEventListener("input",()=>{let q=search.value.toLowerCase();let items=[...d.vehicles.map(x=>({a:x.brand+" "+x.model,b:"Vehículo"})),...d.services.map(x=>({a:x.type,b:"Mantenimiento"})),...d.expenses.map(x=>({a:x.type,b:"Gasto"})),...d.posts.map(x=>({a:x.title,b:"Publicación"}))].filter(x=>x.a.toLowerCase().includes(q));$("#search-results").innerHTML=items.map(x=>`<div class="data-row"><div class="data-row__title">${x.a}</div><span class="tag">${x.b}</span></div>`).join("")||empty("⌕","Sin resultados","Probá con otra palabra.")});
 let nt=$("#notifications-toggle");if(nt)nt.addEventListener("change",()=>{GarageData.update(x=>x.settings.notifications=nt.checked);toast("Preferencia actualizada")});
 let ex=$("[data-export]");if(ex)ex.addEventListener("click",()=>{let blob=new Blob([JSON.stringify(GarageData.get(),null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="garage-datos.json";a.click();URL.revokeObjectURL(a.href)});
 let reset=$("[data-reset]");if(reset)reset.addEventListener("click",()=>{if(confirm("¿Restablecer todos los datos de ejemplo?")){localStorage.removeItem(GarageData.key);location.reload()}});
}
render();

// Descarga el catálogo oficial de VehiclesDB. El Service Worker conserva la
// respuesta del CDN para reutilizarla en visitas posteriores y en modo offline.
async function loadVehiclesDatabase(){
 if("serviceWorker" in navigator && location.protocol!=="file:"){try{await navigator.serviceWorker.ready;}catch(error){console.warn("Service Worker no disponible:",error);}}
 const brandInput=$('input[data-searchable-select="brand"]');
 const modelInput=$('input[data-searchable-select="model"]');
 if(!brandInput||!modelInput)return;
 const brandHelp=$('[data-search-help="brand"]');
 const modelHelp=$('[data-search-help="model"]');
 if(brandHelp)brandHelp.textContent="Cargando catálogo de VehiclesDB...";
 try{
  const response=await fetch(VEHICLESDB_URL);
  if(!response.ok)throw new Error("No se pudo descargar el catálogo");
  const data=await response.json();
  const makes=(data.makes||[]).filter(make=>(make.kinds||[]).some(kind=>kind==="car"||kind==="van"));
  const catalog={};
  makes.forEach(make=>{
   const models=(make.models||[]).filter(model=>model.kind==="car"||model.kind==="van").map(model=>({name:model.name,id:`${model.kind}/${make.slug}/${model.slug}`,kind:model.kind}));
   const unique=models.filter((model,index)=>models.findIndex(item=>item.name.toLowerCase()===model.name.toLowerCase())===index);
   if(unique.length){unique.push({name:"Otro / No listado",id:"",kind:"other"});catalog[make.name]=unique.sort((a,b)=>a.name.localeCompare(b.name,"es"));}
  });
  catalog["Otra marca"]=[{name:"Otro / No listado",id:"",kind:"other"}];
  VEHICLE_CATALOG=catalog;
  VEHICLE_BRANDS=Object.keys(catalog).sort((a,b)=>a.localeCompare(b,"es"));
  VEHICLE_DB_VERSION=data.version||"desconocida";
  VEHICLE_DB_READY=true;
  const currentBrand=brandInput.value;
  const currentModel=modelInput.value;
  if(currentBrand&&catalog[currentBrand]){modelInput.disabled=false;modelInput.placeholder="Buscar modelo...";}
  if(brandHelp)brandHelp.textContent=`VehiclesDB ${VEHICLE_DB_VERSION} · ${VEHICLE_BRANDS.length.toLocaleString("es-AR")} marcas · datos CC BY 4.0.`;
  if(modelHelp)modelHelp.textContent="Modelos de autos y utilitarios. Si no aparece, elegí Otro modelo.";
  if(currentBrand&&currentModel&&catalog[currentBrand]){
   const match=catalog[currentBrand].find(model=>model.name===currentModel);
   const idField=modelInput.closest(".searchable-field")?.querySelector('input[name="vehiclesdbId"]');
   if(idField&&match)idField.value=match.id;
  }
 }catch(error){
  if(brandHelp)brandHelp.textContent="No se pudo cargar VehiclesDB. Revisá la conexión y volvé a intentar.";
  if(modelHelp)modelHelp.textContent="El buscador necesita conexión la primera vez que descarga el catálogo.";
  console.error("VehiclesDB:",error);
 }
}
loadVehiclesDatabase();

if("serviceWorker" in navigator && location.protocol!=="file:"){navigator.serviceWorker.register("sw.js").catch(()=>{})}
})();
