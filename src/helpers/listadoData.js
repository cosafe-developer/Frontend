/**
 * Utilidades puras (sin dependencias de React ni de la API) para normalizar
 * los datos del listado PIPC antes de mostrarlos y antes de mandarlos al
 * backend. Se mantienen sin imports para poder probarlas con node.
 *
 * Reglas:
 * - En Mongo sólo deben guardarse URLs (string) de archivos ya subidos.
 * - Nunca se manda un File/Blob (JSON.stringify(File) === "{}") ni un dataURL.
 * - Los valores `{}` que quedaron guardados en producción por el bug de
 *   serialización, los placeholders falsos de `mybucket` y los archivos
 *   basura `<timestamp>-undefined` se tratan como "vacío".
 */

const PLACEHOLDER_HOST = "mybucket.digitaloceanspaces.com";
// replaceImage subía strings con fileName=undefined -> "<folder>/<ts>-undefined"
const GARBAGE_UPLOAD_RE = /\/\d+-undefined$/;

// Claves internas del formulario que nunca deben persistirse
const INTERNAL_KEYS = new Set(["_uid", "localPreview"]);

export const isBlobLike = (value) =>
  typeof Blob !== "undefined" && value instanceof Blob;

export const isDataUrl = (value) =>
  typeof value === "string" && value.startsWith("data:");

export const isPlainObject = (value) =>
  value !== null &&
  typeof value === "object" &&
  !Array.isArray(value) &&
  Object.getPrototypeOf(value) === Object.prototype;

/** URL remota válida de un archivo ya subido (no placeholder, no basura). */
export const isUsableUrl = (value) =>
  typeof value === "string" &&
  value.trim() !== "" &&
  !isDataUrl(value) &&
  !value.includes(PLACEHOLDER_HOST) &&
  !GARBAGE_UPLOAD_RE.test(value);

/**
 * Valor que un campo de archivo del formulario puede manejar:
 * File/Blob (pendiente de subir), dataURL (firma) o URL remota.
 * Cualquier otra cosa (`{}`, placeholder, basura, "") => null.
 */
export const normalizeUploadValue = (value) => {
  if (isBlobLike(value) || isDataUrl(value) || isUsableUrl(value)) return value;
  return null;
};

export const hasUploadValue = (value) => normalizeUploadValue(value) !== null;

/** Claves que guardan URLs de archivos (logoUrl, imageUrl, evidenceUrl, ...). */
const isUrlKey = (key) => /Url$/.test(key);

/**
 * Limpia un listado recién leído del backend:
 * - campos *Url que no sean una URL usable => "" (forma del schema)
 * - arrays `images` => sólo URLs usables
 * Devuelve una copia; no modifica el original.
 */
export function cleanLoadedListado(value, key = "") {
  if (isUrlKey(key)) {
    return isUsableUrl(value) ? value : "";
  }
  if (Array.isArray(value)) {
    if (key === "images") return value.filter(isUsableUrl);
    return value.map((item) => cleanLoadedListado(item));
  }
  if (isPlainObject(value)) {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = cleanLoadedListado(v, k);
    }
    return out;
  }
  return value;
}

const DROP = Symbol("drop");

function sanitizeValue(value, key) {
  if (value === undefined) return DROP;
  if (isBlobLike(value) || isDataUrl(value)) return DROP;
  if (value instanceof Date) return value;
  if (Array.isArray(value)) {
    return value
      .map((item) => sanitizeValue(item, ""))
      .filter((item) => item !== DROP);
  }
  if (value !== null && typeof value === "object") {
    // Objetos no planos (File ya cubierto, otros) o en un campo *Url: fuera
    if (!isPlainObject(value) || isUrlKey(key)) return DROP;
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      if (INTERNAL_KEYS.has(k)) continue;
      const clean = sanitizeValue(v, k);
      if (clean !== DROP) out[k] = clean;
    }
    // Un objeto vacío nunca debe reemplazar datos guardados
    return Object.keys(out).length === 0 ? DROP : out;
  }
  if (isUrlKey(key) && typeof value === "string" && value !== "" && !isUsableUrl(value)) {
    return DROP;
  }
  return value;
}

/**
 * Prepara un objeto para mandarlo al backend:
 * quita _uid/localPreview, File/Blob, dataURLs, objetos vacíos, valores
 * no-string en campos *Url y URLs placeholder/basura. Las claves eliminadas
 * no se envían, por lo que el merge del backend conserva lo ya guardado.
 */
export function sanitizeForBackend(value) {
  const clean = sanitizeValue(value, "");
  return clean === DROP ? undefined : clean;
}

/**
 * ¿Quedan archivos pendientes de subir (File/Blob o dataURL) en el objeto?
 */
export function hasPendingUploads(value) {
  if (isBlobLike(value) || isDataUrl(value)) return true;
  if (Array.isArray(value)) return value.some(hasPendingUploads);
  if (isPlainObject(value)) return Object.values(value).some(hasPendingUploads);
  return false;
}

/**
 * Construye el payload del auto-guardado a partir del estado del contexto.
 * No incluye `studyData.estudio` (marcador interno de la UI).
 */
export function buildAutosavePayload({ stepStatus = {}, formData = {}, listadoId }) {
  const payload = { listado_id: listadoId };

  for (const section of ["companyInfo", "addressInfo", "riskInfo"]) {
    const raw = stepStatus[section];
    if (!raw) continue;
    const { isDone, ...data } = raw;
    const clean = sanitizeForBackend(data);
    if (clean && Object.keys(clean).length > 0) {
      payload[section] = { ...clean, isDone: isDone ?? false };
    }
  }

  const studyData = {};
  for (const [key, value] of Object.entries(formData)) {
    if (key === "estudio") continue;
    if (!value || typeof value !== "object") continue;
    const clean = sanitizeForBackend(value);
    if (clean && Object.keys(clean).length > 0) studyData[key] = clean;
  }
  if (Object.keys(studyData).length > 0) payload.studyData = studyData;

  return payload;
}

/** Convierte un dataURL (p.ej. la firma del SignaturePad) en File. */
export function dataUrlToFile(dataUrl, baseName = "archivo") {
  const [header, data] = dataUrl.split(",");
  const mime = (header.match(/^data:([^;]+)/) || [])[1] || "application/octet-stream";
  const isBase64 = /;base64/i.test(header);
  const binary = isBase64 ? atob(data) : decodeURIComponent(data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const ext = (mime.split("/")[1] || "bin").replace(/[^a-z0-9]/gi, "");
  return new File([bytes], `${baseName}.${ext}`, { type: mime });
}

/**
 * Key del objeto en Spaces a partir de su URL pública, o null.
 */
export function storageKeyFromUrl(url) {
  if (!isUsableUrl(url)) return null;
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.endsWith("digitaloceanspaces.com")) return null;
    return decodeURIComponent(parsed.pathname.replace(/^\/+/, ""));
  } catch {
    return null;
  }
}

/** Carpeta de Spaces donde se guardan los archivos propios de un listado. */
export const listadoFolder = (listadoId) => `listado-${listadoId}`;

/**
 * Sólo se puede borrar del storage un archivo que pertenezca a ESTE listado
 * (carpetas `listado-<id>/` o `listado-formulario-<id>/`). Nunca el logo de la
 * empresa (`empresa/...`) ni carpetas compartidas.
 */
export function isOwnedByListado(url, listadoId) {
  if (!listadoId) return false;
  const key = storageKeyFromUrl(url);
  if (!key) return false;
  return (
    key.startsWith(`listado-${listadoId}/`) ||
    key.startsWith(`listado-formulario-${listadoId}/`)
  );
}

/** Primer valor de fecha (acepta fecha única o el array del modo "multiple"). */
export function toSingleDate(value) {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === null || raw === undefined || raw === "") return null;
  const date = raw instanceof Date ? raw : new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Número o null (para inputs numéricos como approxDistance). */
export function toNumberOrNull(value) {
  if (value === null || value === undefined || value === "") return null;
  const n = typeof value === "number" ? value : Number(String(value).replace(",", "."));
  return Number.isFinite(n) ? n : null;
}
