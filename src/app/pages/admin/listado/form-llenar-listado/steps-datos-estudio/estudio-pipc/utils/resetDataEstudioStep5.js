export function resetDataEstudioStep5({ listado, geologicalAgentCtx }) {
  const geologicalAgent = listado?.studyData?.geologicalAgent ?? {};

  const mergeSection = (key) => {
    const ctxData = geologicalAgentCtx?.[key];
    const listData = geologicalAgent?.[key];

    // preferimos el del contexto si ya tiene valores, si no, backend, si no, array vacío
    return (Array.isArray(ctxData) && ctxData.length > 0)
      ? ctxData
      : (Array.isArray(listData) ? listData : []);
  };

  return {
    geologicalDisruptions: mergeSection("geologicalDisruptions"),
    seismicEvents: mergeSection("seismicEvents"),
    volcanism: mergeSection("volcanism"),
  };
}
