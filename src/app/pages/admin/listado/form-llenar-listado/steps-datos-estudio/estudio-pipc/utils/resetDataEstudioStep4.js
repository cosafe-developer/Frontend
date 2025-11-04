export function resetDataEstudioStep4({ listado, socioOrganizationalAgentCtx }) {
  const socioOrganizationalAgent = listado?.studyData?.socioOrganizationalAgent ?? {};

  const mergeSection = (key) => {
    const ctxData = socioOrganizationalAgentCtx?.[key];
    const listData = socioOrganizationalAgent?.[key];

    // preferimos el del contexto si ya tiene valores, si no, backend, si no, array vacío
    return (Array.isArray(ctxData) && ctxData.length > 0)
      ? ctxData
      : (Array.isArray(listData) ? listData : []);
  };

  return {
    majorAccidents: mergeSection("majorAccidents"),
    criminalActs: mergeSection("criminalActs"),
    socialDisturbances: mergeSection("socialDisturbances"),
  };
}
