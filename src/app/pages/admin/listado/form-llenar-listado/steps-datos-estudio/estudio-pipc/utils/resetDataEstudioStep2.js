export function resetDataEstudioStep2({ listado, structuralRisksCtx }) {
  const structuralRisks = listado?.studyData?.structuralRisks ?? {};

  const mergeSection = (key) => {
    const ctxData = structuralRisksCtx?.[key];
    const listData = structuralRisks?.[key];

    // preferimos el del contexto si ya tiene valores, si no, backend, si no, array vacío
    return (Array.isArray(ctxData) && ctxData.length > 0)
      ? ctxData
      : (Array.isArray(listData) ? listData : []);
  };

  return {
    structuralDamage: mergeSection("structuralDamage"),
    nonStructuralElements: mergeSection("nonStructuralElements"),
    finishes: mergeSection("finishes"),
  };
}
