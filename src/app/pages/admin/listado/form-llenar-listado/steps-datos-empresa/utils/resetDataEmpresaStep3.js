export function resetDataEmpresaStep3({ listado, riskInfoCtx }) {
  const riskInfo = listado?.riskInfo;

  return {
    materialsInventoryUrl:
      riskInfoCtx?.materialsInventoryUrl ??
      (riskInfo?.materialsInventoryUrl?.length > 0
        ? riskInfo?.materialsInventoryUrl
        : "https://mybucket.digitaloceanspaces.com/inventario.pdf"),

    companyDescription: riskInfoCtx?.companyDescription ?? riskInfo?.companyDescription ?? "",

    internalRiskType:
      riskInfoCtx?.internalRiskType ??
      riskInfo?.internalRiskType ??
      riskInfo?.riskType ?? // legacy fallback
      "ordinario",

    surroundingRiskType:
      riskInfoCtx?.surroundingRiskType ??
      riskInfo?.surroundingRiskType ??
      riskInfo?.riskType ?? // legacy fallback
      "ordinario",

    antecedentsRaw:
      riskInfoCtx?.antecedentsRaw ??
      riskInfo?.antecedentsRaw ??
      riskInfo?.antecedents ?? // legacy
      "",

    preventionCalendarDate: riskInfoCtx?.preventionCalendarDate ?? riskInfo?.preventionCalendarDate ?? null,
    internalGeneralRisks: riskInfoCtx?.internalGeneralRisks ?? riskInfo?.internalGeneralRisks ?? "",
  };
}
