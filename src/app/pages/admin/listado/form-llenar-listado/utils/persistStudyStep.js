/**
 * Guardado de un paso del estudio PIPC (studyData.<stepKey>).
 *
 * Funciones puras (sin React ni API; `save` se inyecta) para poder probarlas
 * con node. Siempre se arma el paso COMPLETO a partir de los valores actuales
 * del formulario: todas las sub-secciones con todas sus filas, incluidas las
 * que el usuario dejó en su valor por defecto ("No") sin tocarlas. Antes sólo
 * se guardaba la tabla modificada y el resto se tomaba de la prop `listado`
 * (cargada al inicio), por lo que las tablas no tocadas quedaban como [].
 */
import { sanitizeForBackend } from "helpers/listadoData";

/** Filas actuales del formulario de cada sub-sección del paso (sólo arrays). */
export function pickStepSections(sections, values) {
  const out = {};
  for (const { key } of sections ?? []) {
    const rows = values?.[key];
    if (Array.isArray(rows)) out[key] = rows;
  }
  return out;
}

/**
 * Datos del paso listos para el backend: cada fila pasa por el `filter` del
 * paso y luego por sanitizeForBackend (sin _uid, localPreview, File, dataURL
 * ni URLs inválidas). Las sub-secciones que no son array en el formulario se
 * omiten (el backend hace merge por sub-clave y conserva lo guardado).
 */
export function buildStudyStepData({ sections, values, filter = (row) => row }) {
  const picked = pickStepSections(sections, values);
  const filtered = Object.fromEntries(
    Object.entries(picked).map(([key, rows]) => [
      key,
      rows.filter((row) => row && typeof row === "object").map((row) => filter(row)),
    ]),
  );
  const clean = sanitizeForBackend(filtered) ?? {};
  // sanitizeForBackend deja [] tal cual, pero una sección cuyas filas se
  // descartaron todas no debe pisar lo guardado
  for (const key of Object.keys(picked)) {
    if (!Array.isArray(clean[key])) delete clean[key];
    else if (clean[key].length === 0 && picked[key].length > 0) delete clean[key];
  }
  return clean;
}

/** requestBody para updateListado con el paso completo. */
export function buildStudyStepPayload({ listadoId, stepKey, sections, values, filter, isDone }) {
  return {
    listado_id: listadoId,
    studyData: {
      [stepKey]: {
        ...buildStudyStepData({ sections, values, filter }),
        isDone: Boolean(isDone),
      },
    },
  };
}

/**
 * Persiste el paso completo. Lanza error si no hay listado o si el backend
 * responde ok:false (updateListado no lanza en 4xx/5xx). Un paso marcado
 * "no aplica" (stepApplicability[stepKey] === false) no se guarda.
 */
export async function persistStudyStep({
  save,
  listadoId,
  stepKey,
  sections,
  values,
  filter,
  isDone,
  stepApplicability,
}) {
  if (stepApplicability?.[stepKey] === false) return { skipped: true };
  if (!listadoId) throw new Error("No se encontró el id del listado");

  const requestBody = buildStudyStepPayload({ listadoId, stepKey, sections, values, filter, isDone });
  const result = await save({ requestBody });
  if (!result || result.ok === false) {
    throw new Error(result?.message || "Error al guardar el paso del estudio");
  }
  return { skipped: false, requestBody, result };
}
