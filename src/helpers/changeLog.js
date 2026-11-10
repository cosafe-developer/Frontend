/**
 * Historial de cambios del listado (listado.changeLog), que arma el backend:
 *   [{ section, sectionLabel, fields: [string], by: { userId, name, role }, at: ISODate }]
 *
 * Funciones puras para poder probarlas con node. Los listados viejos no
 * traen changeLog: todo tolera undefined/null/valores raros.
 */

export const CHANGE_SECTION_LABELS = {
  companyInfo: "Información de la Empresa",
  addressInfo: "Información de la Dirección",
  riskInfo: "Información de Riesgo",
  resourceInventory: "Inventario de Recursos Materiales",
  evidencePhotos: "Evidencias Fotográficas",
  nonStructuralRisks: "Riesgos por daños no estructurales",
  structuralRisks: "Riesgos por daños estructurales",
  serviceInstallations: "Instalaciones de servicio",
  socioOrganizationalAgent: "Agente Socio-Organizativo",
  geologicalAgent: "Agente Geológico",
  physicochemicalAgent: "Agente Físico-Químico",
  sanitaryAgent: "Agente Sanitario",
  surroundingRisks: "Riesgos Circundantes",
  securityMeasures: "Medidas y Equipos de Seguridad",
  damageEvaluation: "Evaluación de Daños",
  attachments: "Anexos",
  stepApplicability: "Aplicabilidad de pasos",
  estado: "Estado del listado",
  general: "General",
};

// Nombres legibles de los campos más comunes (el backend puede mandar la clave)
const FIELD_LABELS = {
  logoUrl: "logotipo",
  businessName: "razón social",
  rfc: "RFC",
  email: "email",
  phone: "teléfono",
  address: "domicilio",
  city: "ciudad",
  state: "estado",
  taxCertificateUrl: "constancia fiscal",
  activities: "actividades",
  businessTurn: "giro",
  propertyResponsibleName: "responsable del inmueble",
  propertyResponsiblePosition: "cargo del responsable",
  legalRepresentativeName: "representante legal",
  legalRepresentativePosition: "cargo del representante",
  legalRepresentativeSignatureUrl: "firma",
  legalRepresentativeIneUrl: "INE",
  landAreaM2: "superficie del terreno",
  builtAreaM2: "superficie construida",
  fixedPopulation: "población fija",
  floatingPopulation: "población flotante",
  levels: "niveles",
  buildingAge: "antigüedad",
  propertyBoundaries: "colindancias",
  internalAreas: "áreas internas",
  materialsInventoryApplies: "inventario aplica",
  companyDescription: "descripción",
  internalRiskType: "riesgo interno",
  surroundingRiskType: "riesgo por entorno",
  antecedentsRaw: "antecedentes",
  antecedentsParagraphs: "antecedentes",
  preventionCalendarDate: "calendario",
  preventionCalendarEvents: "calendario",
  internalGeneralRisks: "riesgos generales internos",
  items: "registros",
  documents: "documentos",
  isDone: "terminado",
  isApproved: "aprobación",
  status: "estado",
};

const toTime = (at) => {
  if (at === null || at === undefined || at === "") return NaN;
  const t = at instanceof Date ? at.getTime() : new Date(at).getTime();
  return Number.isNaN(t) ? NaN : t;
};

/** Entradas válidas (objeto con `section`), sin modificar el original. */
export function normalizeChangeLog(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.filter((e) => e && typeof e === "object" && typeof e.section === "string" && e.section);
}

/** Entradas ordenadas de la más reciente a la más vieja (sin fecha al final). */
export function sortChangesDesc(changeLog) {
  return normalizeChangeLog(changeLog)
    .map((entry, i) => ({ entry, i, t: toTime(entry.at) }))
    .sort((a, b) => {
      const at = Number.isNaN(a.t) ? -Infinity : a.t;
      const bt = Number.isNaN(b.t) ? -Infinity : b.t;
      // Misma fecha: la que está más al final del arreglo es la más nueva
      return bt - at || b.i - a.i;
    })
    .map(({ entry }) => entry);
}

/**
 * Último cambio de una sección (o de cualquiera de varias secciones), o null.
 */
export function lastChangeFor(changeLog, sections) {
  const wanted = new Set(Array.isArray(sections) ? sections : [sections]);
  return sortChangesDesc(changeLog).find((e) => wanted.has(e.section)) ?? null;
}

/** Las `limit` entradas más recientes. */
export function recentChanges(changeLog, limit = 10) {
  return sortChangesDesc(changeLog).slice(0, Math.max(0, limit));
}

/** Nombre legible de un campo: "addressInfo.legalRepresentativeName" => "representante legal". */
export function fieldLabel(field) {
  if (typeof field !== "string") return "";
  const trimmed = field.trim();
  if (!trimmed) return "";
  // Ya viene legible (con espacios o acentos): se deja igual
  if (/\s/.test(trimmed)) return trimmed;
  const parts = trimmed.split(".").filter((p) => p && !/^\d+$/.test(p));
  for (let i = parts.length - 1; i >= 0; i--) {
    if (FIELD_LABELS[parts[i]]) return FIELD_LABELS[parts[i]];
  }
  const last = parts[parts.length - 1] || trimmed;
  return CHANGE_SECTION_LABELS[last] ?? last;
}

/** "rfc, email y 3 más" (sin repetidos). */
export function summarizeFields(fields, max = 3) {
  const labels = [];
  for (const f of Array.isArray(fields) ? fields : []) {
    const label = fieldLabel(f);
    if (label && !labels.includes(label)) labels.push(label);
  }
  if (labels.length === 0) return "";
  if (labels.length <= max) {
    return labels.length === 1
      ? labels[0]
      : `${labels.slice(0, -1).join(", ")} y ${labels[labels.length - 1]}`;
  }
  return `${labels.slice(0, max).join(", ")} y ${labels.length - max} más`;
}

/** Fecha y hora local "09/11/2026, 14:05" (o "" si no es fecha). */
export function formatChangeAt(at, locale = "es-MX") {
  const t = toTime(at);
  if (Number.isNaN(t)) return "";
  try {
    return new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(t));
  } catch {
    return new Date(t).toISOString();
  }
}

export const changeAuthor = (entry) =>
  (typeof entry?.by?.name === "string" && entry.by.name.trim()) || "Usuario desconocido";

export const changeSectionLabel = (entry) =>
  (typeof entry?.sectionLabel === "string" && entry.sectionLabel.trim()) ||
  CHANGE_SECTION_LABELS[entry?.section] ||
  entry?.section ||
  "";

/** "Último cambio: Ana · 09/11/2026, 14:05 — rfc y email" o "Sin cambios registrados". */
export function describeLastChange(entry) {
  if (!entry) return "Sin cambios registrados";
  const when = formatChangeAt(entry.at);
  const what = summarizeFields(entry.fields);
  return `Último cambio: ${changeAuthor(entry)}${when ? ` · ${when}` : ""}${what ? ` — ${what}` : ""}`;
}

/** changeLog que viene en la respuesta del update/get ({ data: listado }), o null. */
export function changeLogFromResponse(response) {
  const log = response?.data?.changeLog;
  return Array.isArray(log) ? log : null;
}

const newestTime = (log) =>
  normalizeChangeLog(log).reduce((max, e) => {
    const t = toTime(e.at);
    return Number.isNaN(t) ? max : Math.max(max, t);
  }, -Infinity);

/**
 * Entre dos versiones conocidas del changeLog, la más actual (la que tiene la
 * entrada más reciente; empate => la más larga; si una no es arreglo, la otra).
 */
export function newerChangeLog(a, b) {
  const aOk = Array.isArray(a);
  const bOk = Array.isArray(b);
  if (!aOk) return bOk ? b : null;
  if (!bOk) return a;
  const ta = newestTime(a);
  const tb = newestTime(b);
  if (ta !== tb) return ta > tb ? a : b;
  return b.length > a.length ? b : a;
}
