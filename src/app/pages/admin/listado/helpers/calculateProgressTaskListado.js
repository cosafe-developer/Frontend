import { isRowAnswered, rowIssue } from "./studyStepRules.js";

/**
 * Filas de una sección de studyData: los elementos de cada sub-sección array
 * y, para secciones con sub-objetos (evidencePhotos: { fire: {...} }), cada
 * sub-objeto como una fila. `isDone` y otros escalares no son filas.
 */
function sectionRows(task) {
  const rows = [];
  for (const [subKey, value] of Object.entries(task)) {
    if (Array.isArray(value)) {
      value.forEach((row) => rows.push({ subKey, row }));
    } else if (value !== null && typeof value === "object" && !(value instanceof Date)) {
      rows.push({ subKey, row: value });
    }
  }
  return rows;
}

/**
 * Progreso de una sección (paso) del estudio.
 * - isDone === true (el usuario terminó el paso con "Siguiente") => 100%.
 * - Sin filas => 0% (una sección vacía nunca cuenta como completa).
 * - Si no: % de filas respondidas (algún valor distinto del por defecto) y sin
 *   problema según las reglas del paso (studyStepRules.rowIssue).
 * (Antes había un modo `strictRiskLevel`; las reglas ya exigen el grado donde
 * corresponde.)
 */
export function calculateProgressTaskListado(task, sectionKey) {
  if (!task || typeof task !== "object" || Array.isArray(task)) {
    return { total: 0, completados: 0, percent: 0 };
  }

  const rows = sectionRows(task);
  const total = rows.length;

  if (task.isDone === true) {
    return { total, completados: total, percent: 100 };
  }

  const completados = rows.filter(
    ({ subKey, row }) => isRowAnswered(row) && !rowIssue(sectionKey, subKey, row),
  ).length;

  return {
    total,
    completados,
    percent: total === 0 ? 0 : (completados / total) * 100,
  };
}
