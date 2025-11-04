export function resetDataEstudioStep3({ listado, serviceInstallationsCtx }) {
  const serviceInstallations = listado?.studyData?.serviceInstallations ?? {};

  const mergeSection = (key) => {
    const ctxData = serviceInstallationsCtx?.[key];
    const listData = serviceInstallations?.[key];

    // preferimos el del contexto si ya tiene valores, si no, backend, si no, array vacío
    return (Array.isArray(ctxData) && ctxData.length > 0)
      ? ctxData
      : (Array.isArray(listData) ? listData : []);
  };

  return {
    hydraulicInstallation: mergeSection("hydraulicInstallation"),
    gasInstallation: mergeSection("gasInstallation"),
    electricalInstallation: mergeSection("electricalInstallation"),
    airConditioningInstallation: mergeSection("airConditioningInstallation"),
    externalRisks: mergeSection("externalRisks"),
  };
}
