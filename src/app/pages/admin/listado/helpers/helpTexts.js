/**
 * Textos de ayuda del formulario del listado PIPC (ícono (i) / title).
 *
 * Cada texto dice qué hace el elemento, para qué sirve y cómo afecta a la
 * información guardada o al documento PIPC que se descarga. Mantenerlos
 * alineados con el generador del backend (context/riskSections.js y
 * buildContext.js): qué columna/tabla del PIPC llena cada dato.
 */

// ── Textos que se repiten en varias tablas ─────────────────────────────────

const COMMON = {
  index: "Número de fila. Sólo sirve como referencia en el formulario.",
  element:
    "Elemento que se revisa en el inmueble. El texto es fijo y sale tal cual en la primera columna de la tabla del PIPC.",
  evidence:
    "Foto del elemento; aparece en la columna Evidencia del PIPC. Pulsa para subirla, haz clic en la miniatura para verla en grande o reemplazarla, y en la X para quitarla.",
  evidenceNoColumn:
    "Foto de respaldo del elemento. Se guarda con el estudio para consulta, pero esta tabla del PIPC no tiene columna de evidencia.",
  evidenceButton: "Sube una foto del elemento (se guarda al momento).",
  notApplicable:
    "Marca si el elemento no existe o no aplica en este inmueble. En el PIPC la fila sale con X en la columna N/A y sin respuesta en Sí/No. No la combines con Sí: el paso quedaría pendiente.",
  observations:
    "Comentario libre sobre el elemento (estado, ubicación, recomendación). Aparece en la columna Observaciones del PIPC.",
  commentButton:
    "Abre un cuadro para escribir o editar las observaciones de esta fila. Se guardan al pulsar Guardar en el cuadro.",
  riskLevel:
    "Qué tan grave es el riesgo encontrado (Bajo, Medio, Alto o Crítico). Es obligatorio en las filas marcadas Sí para terminar el paso; sale en la columna Grado de Riesgo del PIPC.",
  back: "Regresa al paso anterior sin borrar nada. Lo que ya marcaste en este paso queda guardado.",
  next:
    "Guarda todas las tablas de este paso y avanza. Si falta algo obligatorio, se guarda igual pero el paso queda pendiente y se avisa qué falta.",
  sectionTable:
    "Cada fila es un elemento a revisar en el inmueble. Lo que marques se guarda al momento y llena la tabla equivalente del PIPC.",
};

// ── Datos generales ────────────────────────────────────────────────────────

const companyInfo = {
  section:
    "Datos de identificación de la empresa. Se imprimen en la portada y en el encabezado del PIPC.",
  logo:
    "Logotipo de la empresa (imagen). Aparece en la portada y el encabezado del PIPC. Si no subes uno, se usa el registrado en la empresa.",
  businessName:
    "Nombre comercial, denominación o razón social. Sale en la portada y en el encabezado de cada página del PIPC.",
  rfc: "RFC de la empresa (12 o 13 caracteres). Aparece en los datos generales del PIPC.",
  email: "Correo de contacto de la empresa. Aparece en los datos generales del PIPC.",
  phone: "Teléfono de contacto de la empresa. Aparece en los datos generales del PIPC.",
  address: "Domicilio físico del inmueble evaluado (calle, número, colonia). Aparece en los datos generales del PIPC.",
  city: "Ciudad donde está el inmueble. Aparece en los datos generales del PIPC.",
  state: "Estado (entidad federativa) donde está el inmueble. Aparece en los datos generales del PIPC.",
  next:
    "Guarda estos datos en el formulario y pasa a Información de la Dirección. Se envían al servidor al cambiar de paso y al pulsar Guardar en Información de Riesgo.",
};

const addressInfo = {
  section: "Datos del inmueble, sus responsables y sus colindancias para el PIPC.",
  taxCertificate:
    "Constancia de Situación Fiscal (imagen o PDF). Se guarda como respaldo del listado; no se imprime en el PIPC.",
  companyData: "Actividad y responsables del inmueble que se describen en el PIPC.",
  activities: "Actividades que se realizan en el inmueble. Si no hay giro, se usa como giro en el PIPC.",
  businessTurn: "Giro empresarial (ej. oficinas, comercio, industria). Aparece en los datos generales del PIPC.",
  propertyResponsibleName: "Persona responsable del inmueble. Aparece en los datos generales del PIPC.",
  propertyResponsiblePosition: "Cargo del responsable del inmueble. Aparece junto a su nombre en el PIPC.",
  legalRepresentative: "Datos de quien representa legalmente a la empresa.",
  legalRepresentativeName: "Nombre del representante legal. Aparece en los datos generales del PIPC.",
  legalRepresentativePosition: "Cargo del representante legal. Aparece junto a su nombre en el PIPC.",
  signature:
    "Firma del representante legal (opcional). Dibújala con el mouse o el dedo; se sube y guarda al pulsar Siguiente. Queda como respaldo del listado.",
  ine: "INE del representante legal (imagen o PDF). Se guarda como respaldo del listado; no se imprime en el PIPC.",
  domicile: "Características físicas del inmueble que se describen en el PIPC.",
  landArea: "Superficie total del terreno en metros cuadrados. Aparece en los datos del inmueble del PIPC.",
  builtArea: "Superficie construida en metros cuadrados. Aparece en los datos del inmueble del PIPC.",
  fixedPopulation: "Número de personas que trabajan o están siempre en el inmueble. Aparece en el PIPC.",
  floatingPopulation: "Número aproximado de visitantes (clientes, proveedores) al día. Aparece en el PIPC.",
  levels: "Número de pisos o niveles del inmueble. Aparece en los datos del inmueble del PIPC.",
  buildingAge: "Antigüedad aproximada del inmueble en años. Aparece en los datos del inmueble del PIPC.",
  boundaries:
    "Qué hay alrededor del inmueble en cada punto cardinal (calle, terreno, otra empresa...). Cada texto llena la tabla de colindancias del PIPC.",
  boundaryNorth: "Lo que colinda al norte del inmueble. Aparece en la tabla de colindancias del PIPC.",
  boundarySouth: "Lo que colinda al sur del inmueble. Aparece en la tabla de colindancias del PIPC.",
  boundaryEast: "Lo que colinda al este del inmueble. Aparece en la tabla de colindancias del PIPC.",
  boundaryWest: "Lo que colinda al oeste del inmueble. Aparece en la tabla de colindancias del PIPC.",
  boundaryImages:
    "Una foto por cada lado del inmueble. Se imprimen junto a la descripción de colindancias en el PIPC.",
  boundaryImage: "Foto de la colindancia de este lado; aparece en la sección de colindancias del PIPC.",
  internalAreas:
    "Áreas que hay dentro del inmueble (recepción, almacén, comedor...). Escribe una y pulsa Enter o Agregar; salen como lista en el PIPC.",
  addArea: "Agrega el área escrita a la lista de áreas internas.",
  removeArea: "Quita esta área de la lista.",
  back: "Regresa a Información de la Empresa sin borrar lo capturado.",
  next:
    "Valida los campos, sube y guarda la firma (si la dibujaste) y avanza a Información de Riesgo.",
};

const riskInfo = {
  section: "Clasificación de riesgo, antecedentes e inventario de recursos del inmueble.",
  inventoryApplies:
    "Activa Sí si el inmueble tiene equipo de emergencia (extintores, botiquines, lámparas, detectores, señalización) que deba inventariarse. Al activarlo aparecen el inventario y las evidencias fotográficas, que llenan la tabla de inventario y las galerías de fotos del PIPC.",
  companyDescription:
    "Descripción general de la empresa y el inmueble. Si no escribes antecedentes, este texto se usa como antecedentes en el PIPC.",
  internalRiskType:
    "Clasificación del riesgo interno del inmueble (Ordinario, Alto o Crítico). En el PIPC se marca con X la columna correspondiente de la tabla de tipo de riesgo.",
  surroundingRiskType:
    "Clasificación del riesgo por el entorno (vecinos, calles, industrias cercanas). En el PIPC se marca con X la columna correspondiente.",
  antecedents:
    "Historia del inmueble y emergencias previas. Cada salto de línea (Enter) inicia un párrafo nuevo en la sección Antecedentes del PIPC; las líneas vacías se ignoran.",
  preventionCalendar:
    "Fecha programada para las actividades del subprograma de prevención (simulacros, capacitación). Aparece en el calendario del PIPC.",
  internalGeneralRisks:
    "Lista de riesgos generales dentro del inmueble. Se guarda en la Información de Riesgo del listado.",
  internalRiskApplies: "Marca la casilla si este riesgo existe en el inmueble.",
  internalRiskLevel: "Grado del riesgo (Bajo, Medio, Alto o Crítico) si está presente.",
  back: "Regresa a Información de la Dirección sin borrar lo capturado.",
  save:
    "Sube los archivos pendientes y guarda en el servidor toda la información de la empresa, dirección y riesgo. Al terminar puedes continuar con el estudio.",
};

const resourceInventory = {
  section:
    "Un registro por cada equipo (ej. cada extintor) con su foto, ubicación y estado. Llena la tabla de inventario del PIPC y sus fotos salen en la galería correspondiente.",
  addRecord: "Agrega un registro vacío de este recurso para capturar su foto, ubicación y estado.",
  addWithPhotos:
    "Elige o arrastra varias fotos a la vez: se crea un registro por cada foto. Después llena la ubicación y el estado de cada uno.",
  photo: "Foto de esta unidad; sale en la galería de fotos del PIPC con su ubicación y estado como pie de foto.",
  location: "Dónde está la unidad (ej. Recepción, Nivel 1). Aparece en la tabla de inventario y en el pie de foto del PIPC.",
  condition: "Estado de la unidad (Buen estado, Regular, Mal estado, Operable). Aparece en la tabla de inventario del PIPC.",
  removeRecord: "Elimina este registro del inventario (y su fila en el PIPC).",
};

const evidencePhotos = {
  section:
    "Fotos de la señalización del inmueble. Salen en la galería de Señalizaciones del PIPC.",
  applies:
    "Desmarca si el inmueble no tiene señalización; entonces no se piden fotos y no sale la galería en el PIPC.",
  upload: "Elige o arrastra varias fotos a la vez; cada una se agrega a la galería de señalizaciones.",
  remove: "Quita esta foto de la galería.",
};

// ── Estudio (pasos 1 a 11) ─────────────────────────────────────────────────

const study = {
  configure:
    "Elige qué pasos del estudio aplican a este inmueble. Los que no apliquen se saltan y cuentan como terminados en el avance; si no tienen datos capturados, sus tablas salen sin marcas en el PIPC.",
  appliesYes: "El paso aplica: se muestra para llenarlo.",
  appliesNo: "El paso no aplica: se salta y cuenta como terminado en el avance.",
  stepApplies:
    "Encendido: el paso aplica y debe llenarse. Apagado: no aplica, se salta en el formulario y, si no tiene datos capturados, su tabla sale sin marcas en el PIPC.",

  // Paso 1: riesgos no estructurales (columnas Sí | No | Grado | Evidencia)
  nonStructural: {
    applies:
      "Marca Sí si el elemento representa un riesgo en el inmueble. En el PIPC se pone una X en la columna Sí o No.",
  },

  // Paso 2: estructurales (Existe | S/N | N/A | Observaciones)
  structural: {
    exists:
      "Marca si el elemento existe en el inmueble. En el PIPC la columna Existe dice Sí o No.",
    applies:
      "Activa si el elemento presenta el daño o riesgo descrito. En el PIPC la columna S/N muestra S (sí) o N (no).",
  },

  // Paso 3: instalaciones de servicio (Cierto/Falso | N/A | Observaciones)
  service: {
    applies:
      "Activa si lo descrito ocurre en la instalación (ej. presenta fugas). En el PIPC sale Cierto o Falso.",
    externalApplies:
      "Activa si este riesgo externo existe cerca del inmueble. En el PIPC sale Sí o No.",
    distance:
      "Distancia aproximada en metros entre el inmueble y el riesgo externo (0 es válido). Es obligatoria en las filas marcadas Sí. Se guarda al salir del campo o con la palomita y sale en la columna Distancia del PIPC.",
  },

  // Pasos 4 a 7: agentes perturbadores (columna Sí/No)
  agent: {
    applies:
      "Activa Sí si este agente perturbador puede afectar al inmueble. En el PIPC la columna muestra Sí o No.",
  },

  // Paso 8: riesgos circundantes (Con riesgo / Sin riesgo)
  surrounding: {
    applies:
      "Activa si el elemento cercano representa un riesgo para el inmueble. En el PIPC sale Con riesgo o Sin riesgo.",
  },

  // Paso 9: medidas y equipos de seguridad (Existencia)
  security: {
    exists:
      "Marca si el inmueble cuenta con esta medida o equipo de seguridad. En el PIPC la columna Existencia dice Sí o No.",
  },

  // Paso 10: evaluación de daños (Leve | Mayor | Severo | Irrecuperable)
  damage: {
    notApplicable:
      "Marca si el elemento no existe o no aplica; la fila sale sin marca de grado de daño en el PIPC.",
    level:
      "Grado de daño observado: Leve, Mayor, Severo o Irrecuperable. Cada fila necesita un grado o N/A para terminar el paso. En el PIPC se pone una X en la columna del grado elegido.",
  },

  // Paso 11: anexos
  attachments: {
    file:
      "Archivos del anexo (imágenes o PDF). Puedes elegir o arrastrar varios a la vez; quedan guardados con el estudio como anexos.",
    addFiles: "Elige o arrastra uno o varios archivos (imágenes o PDF) para este anexo.",
    removeFile: "Quita este archivo del anexo.",
    finish:
      "Guarda los anexos, marca el estudio como terminado y lo envía a revisión.",
  },
};

// ── Observaciones (modal) ──────────────────────────────────────────────────

const observationsModal = {
  save: "Guarda el comentario en esta fila; aparece en la columna Observaciones del PIPC.",
  cancel: "Cierra sin guardar los cambios del comentario.",
};

// ── Detalle del listado ────────────────────────────────────────────────────

const detail = {
  download:
    "Genera y descarga el documento PIPC (archivo Word .docx) con la información guardada en este momento.",
  approve:
    "Marca el listado como aprobado y su estado pasa a Completado. Si después hay que corregirlo, usa Reabrir.",
  approved: "El listado ya está aprobado.",
  reopen:
    "Quita la aprobación y regresa el listado a pendiente para poder editarlo de nuevo.",
  delete: "Elimina el listado. Pide confirmación antes de borrar.",
  confirmDelete: "Borra el listado de forma definitiva. Esta acción no se puede deshacer.",
  cancelDelete: "Cancela la eliminación; el listado no se borra.",
  progress: "Avance de cada sección del estudio según las filas y pasos terminados.",
  history: "Últimos cambios guardados en el listado: qué sección, quién y cuándo.",
};

export const HELP = {
  common: COMMON,
  companyInfo,
  addressInfo,
  riskInfo,
  resourceInventory,
  evidencePhotos,
  study,
  observationsModal,
  detail,
  lastChange:
    "Quién guardó por última vez esta sección, cuándo y qué campos cambió. Se actualiza al guardar.",
};

export default HELP;
