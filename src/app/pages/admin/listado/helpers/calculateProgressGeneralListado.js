import { calculateProgressTaskListado } from "./calculateProgressTaskListado";

export function calculateProgressGeneralListado(studyData, strictRiskLevel = false) {
  if (!studyData || typeof studyData !== "object") {
    return { globalPercent: 0, totalGlobal: 0, completadosGlobal: 0, progressSections: {} };
  }

  const sectionPercents = {};
  const sectionsList = Object.keys(studyData);
  let totalItemsGlobal = 0;
  let totalCompletedGlobal = 0;

  const alwaysCompleteSections = [
    "socioOrganizationalAgent",
    "geologicalAgent",
    "physicochemicalAgent",
    "sanitaryAgent",
    "securityMeasures"
  ];

  for (const sectionKey of sectionsList) {
    const section = studyData[sectionKey];

    if (alwaysCompleteSections.includes(sectionKey)) {
      sectionPercents[sectionKey] = 100;
      continue;
    }

    const { total, completados, percent } = calculateProgressTaskListado(section, sectionKey, strictRiskLevel);

    sectionPercents[sectionKey] = percent;
    totalItemsGlobal += total;
    totalCompletedGlobal += completados;
  }

  const globalPercent =
    sectionsList.length === 0
      ? 0
      : Object.values(sectionPercents).reduce((a, b) => a + b, 0) / sectionsList.length;

  return {
    globalPercent,
    totalGlobal: totalItemsGlobal,
    completadosGlobal: totalCompletedGlobal,
    progressSections: sectionPercents,
  };
}
