export function resetDataEstudioStep9({ listado, securityMeasuresCtx }) {
  const securityMeasures = listado?.studyData?.securityMeasures ?? {};

  const mergeSection = (key) => {
    const ctxData = securityMeasuresCtx?.[key];
    const listData = securityMeasures?.[key];

    // preferimos el del contexto si ya tiene valores, si no, backend, si no, array vacío
    return (Array.isArray(ctxData) && ctxData.length > 0)
      ? ctxData
      : (Array.isArray(listData) ? listData : []);
  };

  return {
    alarmSystem: mergeSection("alarmSystem"),
  };
}
