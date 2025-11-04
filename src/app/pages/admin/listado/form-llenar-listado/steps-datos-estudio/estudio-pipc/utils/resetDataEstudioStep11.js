export function resetDataEstudioStep11({ listado, nonStructuralRisksCtx }) {
  const nonStructuralRisks = listado?.studyData?.nonStructuralRisks ?? {};

  const mergeSection = (key) => {
    const ctxData = nonStructuralRisksCtx?.[key];
    const listData = nonStructuralRisks?.[key];

    // preferimos el del contexto si ya tiene valores, si no, backend, si no, array vacío
    return (Array.isArray(ctxData) && ctxData.length > 0)
      ? ctxData
      : (Array.isArray(listData) ? listData : []);
  };

  return {
    fallingObjects: mergeSection("fallingObjects"),
    slidingObjects: mergeSection("slidingObjects"),
    overturningObjects: mergeSection("overturningObjects"),
    flammableObjects: mergeSection("flammableObjects"),
    evacuationBlockingObjects: mergeSection("evacuationBlockingObjects"),
  };
}
