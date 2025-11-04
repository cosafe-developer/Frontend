export function resetDataEstudioStep6({ listado, physicochemicalAgentCtx }) {
  const physicochemicalAgent = listado?.studyData?.physicochemicalAgent ?? {};

  const mergeSection = (key) => {
    const ctxData = physicochemicalAgentCtx?.[key];
    const listData = physicochemicalAgent?.[key];

    // preferimos el del contexto si ya tiene valores, si no, backend, si no, array vacío
    return (Array.isArray(ctxData) && ctxData.length > 0)
      ? ctxData
      : (Array.isArray(listData) ? listData : []);
  };

  return {
    fireAgent: mergeSection("fireAgent"),
    chemicalSpill: mergeSection("chemicalSpill"),
    explosionAgent: mergeSection("explosionAgent"),
    contamination: mergeSection("contamination"),
    flooding: mergeSection("flooding"),
  };
}
