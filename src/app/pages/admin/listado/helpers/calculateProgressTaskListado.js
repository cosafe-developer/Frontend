function isItemComplete(item, sectionKey, strictRiskLevel = false) {
  if (!item || typeof item !== "object") return false;

  switch (sectionKey) {
    case "nonStructuralRisks":
      if (item.riskLevel !== undefined && item.riskLevel !== null) {
        if (typeof item.riskLevel === "string") {
          return item.riskLevel.trim() !== "";
        }
        return true;
      }
      return strictRiskLevel ? false : Object.keys(item).some((k) => k !== "element" && !!item[k]);

    /*    "observations", "applies", "exists", "no_aplica" */
    case "structuralRisks":
      // Contamos como completado si observations tiene texto o no_aplica es true
      if ((item.observations && item.observations.trim() !== "") || item.no_aplica || item.applies || item.exists) return true;
      return false;


    /*   "observations", "applies", "no_aplica", "distancia_aproximada" */
    case "serviceInstallations":
      if ((item.observations && item.observations.trim() !== "") || item.no_aplica || item.applies || item?.distancia_aproximada > 0) return true;
      return false;

    case "socioOrganizationalAgent":
      return true;

    case "geologicalAgent":
      return true;

    case "physicochemicalAgent":
      return true;

    case "sanitaryAgent":
      return true;

    /*   "observations", "has_riesgo", "no_aplica", */
    case "surroundingRisks":
      if ((item.observations && item.observations.trim() !== "") || item.no_aplica || item.has_riesgo) return true;
      return false;

    /*   "observations", "has_riesgo", "no_aplica", */
    case "damageEvaluation":
      if (item.riskLevel !== undefined && item.riskLevel !== null) {
        if (typeof item.riskLevel === "string") {
          return item.riskLevel.trim() !== "";
        }
        return true;
      }
      return strictRiskLevel ? false : Object.keys(item).some((k) => k !== "element" && !!item[k]);

    default:
      // fallback general
      if (strictRiskLevel) return false;
      return Object.keys(item).some((k) => k !== "element" && !!item[k]);
  }
}


export function calculateProgressTaskListado(task, sectionKey, strictRiskLevel = false) {

  if (!task || typeof task !== "object") {
    return { totalSubkeys: 0, totalItems: 0, completados: 0, percent: 0 };
  }

  // Si la sección completa está marcada como done
  if (task.isDone === true) {
    const totalItems = Object.values(task)
      .filter((v) => Array.isArray(v))
      .reduce((acc, arr) => acc + arr.length, 0);
    return { total: totalItems, completados: totalItems, percent: 100, subkeyPercents: [] };
  }

  const subkeyPercents = [];
  let totalItems = 0;
  let totalCompleted = 0;

  for (const key in task) {
    const items = task[key];

    if (!Array.isArray(items)) {
      subkeyPercents.push(0);
      continue;
    }

    const subTotal = items.length;


    const subCompleted = items.reduce(
      (acc, item) => acc + (isItemComplete(item, sectionKey, strictRiskLevel) ? 1 : 0),
      0
    );

    const subPercent = subTotal === 0 ? 0 : (subCompleted / subTotal) * 100;

    subkeyPercents.push(subPercent);
    totalItems += subTotal;
    totalCompleted += subCompleted;
  }

  const percent = totalItems === 0 ? 0 : (totalCompleted / totalItems) * 100;

  return {
    total: totalItems,          // total de items reales dentro de todos los arrays
    completados: totalCompleted,
    percent,                    // porcentaje de la sección según promedio de subclaves
    subkeyPercents,             // detalle por subclave si necesitas mostrarlo
  };
}

