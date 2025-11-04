export function resetDataEstudioStep7({ listado, sanitaryAgentCtx }) {
  const sanitaryAgent = listado?.studyData?.sanitaryAgent ?? {};

  const mergeSection = (key) => {
    const ctxData = sanitaryAgentCtx?.[key];
    const listData = sanitaryAgent?.[key];

    // preferimos el del contexto si ya tiene valores, si no, backend, si no, array vacío
    return (Array.isArray(ctxData) && ctxData.length > 0)
      ? ctxData
      : (Array.isArray(listData) ? listData : []);
  };

  return {
    epidemic: mergeSection("epidemic"),
    plague: mergeSection("plague")
  };
}
