export function resetDataEstudioStep8({ listado, surroundingRisksCtx }) {
  const surroundingRisks = listado?.studyData?.surroundingRisks ?? {};

  const mergeSection = (key) => {
    const ctxData = surroundingRisksCtx?.[key];
    const listData = surroundingRisks?.[key];

    // preferimos el del contexto si ya tiene valores, si no, backend, si no, array vacío
    return (Array.isArray(ctxData) && ctxData.length > 0)
      ? ctxData
      : (Array.isArray(listData) ? listData : []);
  };

  return {
    externalRiskElements: mergeSection("externalRiskElements"),
  };
}
