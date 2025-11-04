export function resetDataEmpresaStep3({ listado, riskInfoCtx }) {
  const riskInfo = listado?.riskInfo;

  return {
    materialsInventoryUrl:
      riskInfoCtx?.materialsInventoryUrl ??
      (riskInfo?.materialsInventoryUrl?.length > 0
        ? riskInfo?.materialsInventoryUrl
        : "https://mybucket.digitaloceanspaces.com/inventario.pdf"),

    companyDescription: riskInfoCtx?.companyDescription ?? riskInfo?.companyDescription ?? "",
    riskType: riskInfoCtx?.riskType ?? riskInfo?.riskType ?? "ordinario",
    antecedents: riskInfoCtx?.antecedents ?? riskInfo?.antecedents ?? "",
    preventionCalendarDate: riskInfoCtx?.preventionCalendarDate ?? riskInfo?.preventionCalendarDate ?? null,
    internalGeneralRisks: riskInfoCtx?.internalGeneralRisks ?? riskInfo?.internalGeneralRisks ?? "",
  };
}
