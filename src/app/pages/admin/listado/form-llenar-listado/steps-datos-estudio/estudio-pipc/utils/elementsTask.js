//? Step 1
export const fallingObjects = [
  "Ventanas de vidrio",
  "Ventilas",
  "Canceles de vidrio",
  "Lámparas",
  "Entrepaños o repisas",
  "Objetos sobre entrepaños o repisas",
  "Cuadros",
  "Plantillas",
  "Espejos",
  "Líquidos tóxicos o inflamables",
  "Macetas y otros objectos colgantes",
  "Plafones",
  "Otros"
]

export const slidingObjects = ["Escritorios", "Máquinas", "Mesas", "Sillas", "Todos aquellos con ruedas y carretillas"]

export const overturningObjects = ["Equipos de cómputo", "Libreros", "Roperos, Casilleros", "Archiveros", "Estantes no anclados", "Vitrinas", "Subdivisiones no ancladas"]

export const flammableObjects = ["Bodegas de papel", "Bodegas de cartón", "Bodegas de tela", "Combustibles o solventes", "Otros productos o sustancis químicas"]

export const evacuationBlockingObjects = [
  "Tapetes mal colocados",
  "Desniveles que no se noten",
  "Macetas",
  "Botes de basura",
  "Cerraduras que no abren",
  "Archiveros",
  "Extintores en mala posición",
  "Objectos para protección para robos",
  "Rejas en puertas o ventanas",
  "Puertas que se atoran"
]

//? Step 2
export const elementTaskStructuralDamage = [
  "¿Presenta inclinación?",
  "¿Separación de elementos estructurales?",
  "¿Deformaciones en muros?",
  "¿Deformaciones en columnas?",
  "¿Deformaciones en losas (pisos)?",
  "¿Deformaciones en trabes (soportes)?",
  "¿Los muros presentan grietas?",
  "¿Existen filtraciones de agua?",
  "¿Presenta daños en escaleras y rampas?",
  "Líquidos tóxicos o inflamables"
]

export const nonStructuralElements = [
  "Anaqueles y/o estanteria",
  "Canceleria",
  "Vidrios",
  "Puertas y ventanas",
  "Antenas",
  "Elementos suspendidos",
  "Muros falsos",
  "Plafones",
  "Lamparas",
  "Elevadores"
]

export const finishesElements = [
  "Lambrines",
  "Recubrimientos de material incombustible",
  "Recubrimientos de material de combustible",
  "Pisos y desniveles",
  "Pisos falsos",
  "Losetas y azulejos"
]

//? Step 3
export const hydraulicInstallationElements = [
  "Presenta fugas",
  "Daños en cisterna"
]

export const gasInstallationElements = [
  "Presenta fugas",
  "Anomalias en el tanque"
]

export const electricalInstallationElements = [
  "Subestación",
  "Tablero",
  "Cableado",
  "Contactos",
  "Interruptores",
  "Lámparas",
  "Lámparas de emergencia",
  "Planta de emergencia",
  "Cajas de distribución"
]

export const airConditioningInstallationElements = [
  "Instalación especial",
  "Enfoque cual"
]

export const externalRisksElements = [
  "Tanques de Gas LP",
  "Torres con lineas de alta tensión",
  "Transformadores de energia eléctrica",
  "Postes en mal estado",
  "Vias de ferrocarril",
  "Inmuebles aldaños dañados",
  "Anuncios espectaculares",
  "Almacenes de sustancias peligrosas",
  "Fábricas",
  "Gasolineras y gaseras",
  "Plantas de PEMEX",
  "Ductos con sustancias peligrosas",
  "Basureros",
  "Rios y laderas",
  "Costas",
  "Presas",
  "Cámara de desague",
  "Lago",
  "Otro"
]

//? Step 4
export const majorAccidentsElements = [
  "Accidente de vehículos que transporten materiales químicos peligrosos. (explosivos, gas...)",
  "Accidente en donde se involucren vehículos terrestres de transporte de pasajeros",
  "Accidente en donde se involucren vehículos marítimos de transporte de carga",
  "Accidente en donde se involucren vehículos marítimos de transporte de pasajeros",
  "Otro"
]

export const criminalActsElements = [
  "Robo",
  "Robo con violencia",
  "Secuestro",
  "Invasión de bienes inmuebles",
  "Interrupción de vialidades",
  "Sabotaje a los servicios públicos",
  "Sabodaje a los servicios privados",
  "Otro"
]

export const socialDisturbancesElements = [
  "Marchas y manifestaciones",
  "Plantones y mitines",
  "Actos vandálicos",
  "Otro"
]

//? Step 5
export const geologicalDisruptionsElements = [
  "Agrietamiento de terreno",
  "Hundimiento de terreno",
  "Deslave",
  "Deslizamiento de talud",
  "Deforestación",
  "Desertificación",
  "Erosión del suelo productivo",
  "Sobre explotación de fuentes de agua",
  "Sobre explotación del manto freático",
  "Deslizamiento de talud"
]

export const seismicEventsElements = [
  "Derrumba de edificios aladaños",
  "Caida de torres de alta tensión",
  "Tsunami",
  "Otro"
]

export const volcanismElements = [
  "Lluvia de ceniza",
  "Afectación por lava"
]

//? Step 6
export const fireAgentElements = [
  "Incendio Forestal",
  "Incendio Rural",
  "Incendio Industrial"
]

export const chemicalSpillElements = [
  "Afectación: Gaseras y transporte",
  "Lugar de origen: Transporte, contenedores",
]

export const explosionAgentElements = [
  "Exposición a materiales radioactivos",
  "Explosión",
]

export const contaminationElements = [
  "Del aire",
  "Del suelo",
  "Del agua",
  "Otro"
]

export const floodingElements = [
  "Por frío",
  "Por lago, laguna, presa",
  "Por lluvia",
  "Por mar",
  "Vientos fuertes",
  "Huracán",
  "Marea de tormenta",
  "Tormenta eléctrica",
  "Lluvia torrencial",
  "Tromba",
  "Tornado",
  "Tormenta de granizo",
  "Helada",
  "Nevada",
  "Avalancha de nieve",
  "Sequía",
  "Otro",
]

//? Step 7
export const epidemicElements = [
  "Tipo de epidemia",
]

export const plagueElements = [
  "Tipo de plaga",
]

export const agentElements = [
  "Entrenamiento",
]

//? Step 8 
export const externalRiskElements = [
  "Tanques elevados",
  "Torres con cables de alta tensión",
  "Postes de corriente eléctrica",
  "Transformadores de electricidad",
  "Alcantarillados y registros abiertos",
  "Banquetas desniveladas",
  "Postes telefónicos",
  "Árboles viejos o grandes y ramas que puedan caer",
  "Rampas para autos",
  "Vías del ferrocarril",
  "Calles con excesiva circulación vehicular",
  "Carreteras",
  "Construcciones vecinas dañadas",
  "Desprendimiento de vidrios de ventanas",
  "Anuncios volados",
  "Acabados de fachadas",
  "Anuncios y marquesinas que puedan caer",
  "Perfiles de balcones que puedan desprenderse",
  "Inclinación notoria del inmueble",
  "Daños en cimentación",
  "Daños en columnas exteriores",
  "Daños graves en muros",
  "Fábricas, depósitos, almacenes de materiales...",
  "Pasos a desnivel para vehículos",
  "Puentes para peatones",
  "Gasolineras",
]

//? Step 9
export const alarmSystemElements = [
  "Alarma de seguridad",
  "Alarma contra incendios",
  "Alarma sonora",
  "Alarma luminosa",
  "Es conocida por el personal",
  "Cuenta con código establecido",
  "Se utiliza durante los simulacros",
  "Activación automática",
  "Fuente de energía independiente",
  "Cuenta con mantenimiento permanente",
]

//? Step 10
export const damageElements = [
  "Paredes del inmueble",
  "Columnas del inmueble",
  "Techos",
  "Piso",
  "Escaleras",
  "Accesos principales",
  "Rutas de evacuación",
  "Salidas de emergencia",
  "Equipo contra incendio",
  "Detectores de humo",
  "Inmobiliario",
  "Ventanas",
  "Sanitarios",
  "Cableado eléctrico",
  "Tubería de agua potable",
  "Elevador de material",
  "Aire acondicionado",
  "Red telefónica",
]

//? Step 11
export const documentsElements = [
  "ACTA CONSTITUTIVA DE LA UIPC",
  "CONSTANCIAS DE CAPACITACIÓN",
  "DICTAMEN DE INSTALACIONES SEGURA DE GAS LP O NATURAL",
  "DICTAMEN DE SEGURIDAD ESTRUCTURAL",
  "DICTAMEN ELÉCTRICO",
  "EVIDENCIA FOTOGRÁFICA DE CAPACITACIÓN",
  "HDS",
  "LAYOUT EQUIPO DE RIESGOS EXTERNOS",
  "LAYOUT EQUIPO DE RIESGOS INTERNOS",
  "LAYOUT EQUIPO DE SEGURIDAD",
  "LISTAS DE ASISTENCIA",
  "PÓLIZA DE SEGURO",
]