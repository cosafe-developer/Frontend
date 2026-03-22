export function resetDataEstudioStep11({ listado, attachmentsCtx }) {
  const attachments = listado?.studyData?.attachments ?? {};

  const mergeSection = (key) => {
    const ctxData = attachmentsCtx?.[key];
    const listData = attachments?.[key];

    // preferimos el del contexto si ya tiene valores, si no, backend, si no, array vacío
    return (Array.isArray(ctxData) && ctxData.length > 0)
      ? ctxData
      : (Array.isArray(listData) ? listData : []);
  };

  return {
    documents: mergeSection("documents"),
  };
}
