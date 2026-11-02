import { normalizeUploadValue, toSingleDate } from "helpers/listadoData";

// Listados guardados antes de existir el switch: si ya hay inventario o
// evidencias capturadas, el inventario "aplica".
const hasInventoryData = (studyData) => {
  const items = studyData?.resourceInventory?.items;
  const hasEntries =
    Array.isArray(items) &&
    items.some((it) => (Array.isArray(it?.entries) && it.entries.length > 0) || it?.location || it?.condition);
  const photos = studyData?.evidencePhotos ?? {};
  const hasPhotos = Object.values(photos).some(
    (cat) => Array.isArray(cat?.images) && cat.images.length > 0,
  );
  return hasEntries || hasPhotos;
};

export function resetDataEmpresaStep3({ listado, riskInfoCtx }) {
  const riskInfo = listado?.riskInfo;

  const savedApplies = riskInfoCtx?.materialsInventoryApplies ?? riskInfo?.materialsInventoryApplies;

  return {
    materialsInventoryApplies:
      typeof savedApplies === "boolean" ? savedApplies : hasInventoryData(listado?.studyData),

    // Sin placeholder falso: si no hay archivo real queda null
    materialsInventoryUrl:
      normalizeUploadValue(riskInfoCtx?.materialsInventoryUrl) ??
      normalizeUploadValue(riskInfo?.materialsInventoryUrl),

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

    // Fecha única (los guardados viejos en modo "multiple" eran array: se toma la primera)
    preventionCalendarDate: toSingleDate(
      riskInfoCtx?.preventionCalendarDate ?? riskInfo?.preventionCalendarDate,
    ),
    internalGeneralRisks: riskInfoCtx?.internalGeneralRisks ?? riskInfo?.internalGeneralRisks ?? "",
  };
}
