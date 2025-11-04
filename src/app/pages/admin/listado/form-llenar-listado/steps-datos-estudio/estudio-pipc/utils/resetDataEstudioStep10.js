export function resetDataEstudioStep10({ listado, damageEvaluationCtx }) {
  const damageEvaluation = listado?.studyData?.damageEvaluation ?? {};

  const mergeSection = (key) => {
    const ctxData = damageEvaluationCtx?.[key];
    const listData = damageEvaluation?.[key];

    // preferimos el del contexto si ya tiene valores, si no, backend, si no, array vacío
    return (Array.isArray(ctxData) && ctxData.length > 0)
      ? ctxData
      : (Array.isArray(listData) ? listData : []);
  };

  return {
    damageElements: mergeSection("damageElements"),
  };
}
