import { calculateProgressTaskListado } from "./calculateProgressTaskListado.js";

/**
 * Pasos del estudio PIPC (mismo orden y claves que estudioSteps en
 * EstudioSteps.js; se repiten aquí para no importar componentes React).
 */
export const STUDY_STEP_KEYS = [
  "nonStructuralRisks",
  "structuralRisks",
  "serviceInstallations",
  "socioOrganizationalAgent",
  "geologicalAgent",
  "physicochemicalAgent",
  "sanitaryAgent",
  "surroundingRisks",
  "securityMeasures",
  "damageEvaluation",
  "attachments",
];

/** Secciones de studyData que se capturan en Información de Riesgo; cuentan sólo si existen. */
const OPTIONAL_SECTION_KEYS = ["resourceInventory", "evidencePhotos"];

/**
 * Progreso general del estudio.
 *
 * CRITERIO
 * - Se evalúan los 11 pasos del estudio aunque todavía no estén en studyData
 *   (un paso sin guardar cuenta 0%, no se omite), más resourceInventory /
 *   evidencePhotos si existen. Claves internas (estudio, stepApplicability) u
 *   otras desconocidas no cuentan.
 * - Un paso marcado "no aplica" (stepApplicability[paso] === false) se EXCLUYE
 *   del cálculo (ni suma ni resta); ya no cuenta como 100%.
 * - Cada sección vale lo que dice calculateProgressTaskListado: 100% si
 *   isDone, 0% si está vacía, y si no el % de filas respondidas y válidas.
 *   Ya no hay secciones que cuenten 100% siempre.
 * - globalPercent = promedio de las secciones incluidas (0 si no hay).
 *
 * `stepApplicability` puede venir dentro de studyData o como 2º argumento
 * (estado del formulario). El 2º argumento booleano (strictRiskLevel) de la
 * versión anterior se ignora.
 */
export function calculateProgressGeneralListado(studyData, stepApplicabilityArg) {
  const data = studyData && typeof studyData === "object" ? studyData : {};
  const stepApplicability = {
    ...(data.stepApplicability ?? {}),
    ...(stepApplicabilityArg && typeof stepApplicabilityArg === "object" ? stepApplicabilityArg : {}),
  };

  const keys = [
    ...STUDY_STEP_KEYS,
    ...OPTIONAL_SECTION_KEYS.filter(
      (key) => data[key] && typeof data[key] === "object" && !Array.isArray(data[key]),
    ),
  ].filter((key) => stepApplicability[key] !== false);

  const progressSections = {};
  let totalGlobal = 0;
  let completadosGlobal = 0;

  for (const key of keys) {
    const { total, completados, percent } = calculateProgressTaskListado(data[key], key);
    progressSections[key] = percent;
    totalGlobal += total;
    completadosGlobal += completados;
  }

  const percents = Object.values(progressSections);
  const globalPercent = percents.length === 0 ? 0 : percents.reduce((a, b) => a + b, 0) / percents.length;

  return { globalPercent, totalGlobal, completadosGlobal, progressSections };
}

/** progressPercentage (entero 0-100) que se guarda en el listado. */
export function progressPercentageOf(studyData, stepApplicability) {
  const { globalPercent } = calculateProgressGeneralListado(studyData, stepApplicability);
  return Math.max(0, Math.min(100, Math.round(globalPercent)));
}
