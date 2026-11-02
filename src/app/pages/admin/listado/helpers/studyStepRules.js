/**
 * Reglas de llenado de los pasos del estudio PIPC (studyData.<paso>).
 *
 * Módulo puro (sin imports de React ni de la API) para usarlo tanto en la
 * validación de "paso terminado" (isDone, useStudyStepPersistence) como en el
 * cálculo de progreso (calculateProgressGeneralListado) y probarlo con node.
 *
 * CRITERIO DE PASO TERMINADO (isDone)
 * Un paso cuenta como terminado cuando el usuario pulsa "Siguiente" y ninguna
 * fila tiene un problema según estas reglas. Las filas en "No" (applies=false)
 * no exigen nada: no se pide grado, observaciones ni evidencia. Evidencia y
 * observaciones son siempre opcionales.
 *  - Paso 1 nonStructuralRisks: fila en "Sí" => debe tener grado de riesgo.
 *  - Paso 2 structuralRisks y paso 8 surroundingRisks: una fila no puede estar
 *    en "Sí" y en "N/A" a la vez (respuesta contradictoria).
 *  - Paso 3 serviceInstallations: igual que el 2; además en "Riesgos externos"
 *    una fila en "Sí" (y no N/A) debe tener la distancia aproximada (0 vale).
 *  - Paso 10 damageEvaluation: cada fila tiene grado de daño o está en N/A
 *    (el documento tiene una columna por grado: no hay respuesta "No").
 *  - Resto de pasos: sin reglas; cuentan como terminados al pulsar Siguiente.
 */

/** Grados de daño del documento PIPC (tabla de evaluación de daños). */
export const DAMAGE_LEVELS = [
  { id: "leve", label: "Leve" },
  { id: "mayor", label: "Mayor" },
  { id: "severo", label: "Severo" },
  { id: "irrecuperable", label: "Irrecuperable" },
];

/** Valores viejos (Bajo/Medio/Alto) => grados del documento. Mismo mapeo que el backend. */
export const LEGACY_DAMAGE_LEVELS = { bajo: "leve", medio: "mayor", alto: "severo" };

/** Grado de daño normalizado ('leve'|'mayor'|'severo'|'irrecuperable') o null. */
export function normalizeDamageLevel(value) {
  if (typeof value !== "string") return null;
  const key = value.trim().toLowerCase();
  if (!key) return null;
  if (DAMAGE_LEVELS.some((level) => level.id === key)) return key;
  return LEGACY_DAMAGE_LEVELS[key] ?? null;
}

const INTERNAL_KEYS = new Set(["element", "_uid", "localPreview"]);

/** Valor "lleno": true, texto no vacío, número finito, array con elementos. */
export function isFilled(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.trim() !== "";
  if (typeof value === "number") return Number.isFinite(value);
  if (Array.isArray(value)) return value.length > 0;
  return typeof value === "object" && Object.keys(value).length > 0;
}

const isNotApplicable = (row) => row?.no_aplica === true || row?.notApplicable === true;

const hasNumber = (value) => {
  if (value === null || value === undefined || value === "") return false;
  const n = typeof value === "number" ? value : Number(String(value).replace(",", "."));
  return Number.isFinite(n) && n >= 0;
};

export const STEP_ISSUES = {
  missingRiskLevel: "Falta el grado de riesgo en filas marcadas \"Sí\".",
  contradictory: "Hay filas marcadas \"Sí\" y \"N/A\" a la vez.",
  missingDistance: "Falta la distancia aproximada en riesgos externos marcados \"Sí\".",
  missingDamageLevel: "Cada daño necesita un grado (Leve, Mayor, Severo o Irrecuperable) o N/A.",
};

/** Problema de una fila según las reglas de su paso, o null si está bien. */
export function rowIssue(stepKey, sectionKey, row) {
  if (!row || typeof row !== "object") return null;
  switch (stepKey) {
    case "nonStructuralRisks":
      return row.applies === true && !isFilled(row.riskLevel) ? STEP_ISSUES.missingRiskLevel : null;
    case "structuralRisks":
    case "surroundingRisks":
      return row.applies === true && isNotApplicable(row) ? STEP_ISSUES.contradictory : null;
    case "serviceInstallations":
      if (row.applies === true && isNotApplicable(row)) return STEP_ISSUES.contradictory;
      if (sectionKey === "externalRisks" && row.applies === true && !hasNumber(row.approxDistance)) {
        return STEP_ISSUES.missingDistance;
      }
      return null;
    case "damageEvaluation":
      return isNotApplicable(row) || normalizeDamageLevel(row.riskLevel)
        ? null
        : STEP_ISSUES.missingDamageLevel;
    default:
      return null;
  }
}

/**
 * Problemas del paso (sin repetir). `data` = { subSeccion: filas[] }; las
 * claves que no son array (isDone, etc.) se ignoran. [] => paso completo.
 */
export function getStudyStepIssues(stepKey, data) {
  const issues = new Set();
  for (const [sectionKey, rows] of Object.entries(data ?? {})) {
    if (!Array.isArray(rows)) continue;
    for (const row of rows) {
      const issue = rowIssue(stepKey, sectionKey, row);
      if (issue) issues.add(issue);
    }
  }
  return [...issues];
}

export const isStudyStepComplete = (stepKey, data) => getStudyStepIssues(stepKey, data).length === 0;

/**
 * ¿El usuario respondió algo en la fila? (algún campo distinto de element /
 * _uid / localPreview con valor). Una fila con los valores por defecto ("No",
 * sin grado, sin evidencia) no cuenta como respondida para el progreso.
 */
export function isRowAnswered(row) {
  if (!row || typeof row !== "object") return false;
  return Object.entries(row).some(([key, value]) => !INTERNAL_KEYS.has(key) && isFilled(value));
}
