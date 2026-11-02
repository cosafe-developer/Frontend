import { normalizeUploadValue } from "helpers/listadoData";

// Primer archivo válido (contexto > BD). `{}`, "" o placeholders => null, para
// que la validación pida volver a subirlo.
const pickUpload = (...values) => {
  for (const value of values) {
    const normalized = normalizeUploadValue(value);
    if (normalized !== null) return normalized;
  }
  return null;
};

export function resetDataEmpresaStep2({ listado, addressInfoCtx }) {
  const addressInfo = listado?.addressInfo;
  const dbBoundaries = addressInfo?.propertyBoundaries ?? {};
  // El contexto guarda las colindancias ANIDADAS (propertyBoundaries.north...),
  // igual que la BD. Leer claves planas del contexto perdía las ediciones.
  const ctxBoundaries = addressInfoCtx?.propertyBoundaries ?? {};

  const boundaryText = (dir) =>
    ctxBoundaries?.[dir]?.observations ?? dbBoundaries?.[dir]?.observations ?? "";
  const boundaryImage = (dir) =>
    pickUpload(ctxBoundaries?.[dir]?.imageUrl, dbBoundaries?.[dir]?.imageUrl);

  return {
    taxCertificateUrl: pickUpload(addressInfoCtx?.taxCertificateUrl, addressInfo?.taxCertificateUrl),

    activities: addressInfoCtx?.activities ?? addressInfo?.activities ?? "",
    businessTurn: addressInfoCtx?.businessTurn ?? addressInfo?.businessTurn ?? "",
    propertyResponsibleName: addressInfoCtx?.propertyResponsibleName ?? addressInfo?.propertyResponsibleName ?? "",
    propertyResponsiblePosition: addressInfoCtx?.propertyResponsiblePosition ?? addressInfo?.propertyResponsiblePosition ?? "",
    legalRepresentativeName: addressInfoCtx?.legalRepresentativeName ?? addressInfo?.legalRepresentativeName ?? "",
    legalRepresentativePosition: addressInfoCtx?.legalRepresentativePosition ?? addressInfo?.legalRepresentativePosition ?? "",

    // Firma opcional: URL guardada o dataURL aún no subido; si no hay, null
    legalRepresentativeSignatureUrl: pickUpload(
      addressInfoCtx?.legalRepresentativeSignatureUrl,
      addressInfo?.legalRepresentativeSignatureUrl,
    ),

    legalRepresentativeIneUrl: pickUpload(
      addressInfoCtx?.legalRepresentativeIneUrl,
      addressInfo?.legalRepresentativeIneUrl,
    ),

    landAreaM2: addressInfoCtx?.landAreaM2 ?? addressInfo?.landAreaM2 ?? 0,
    builtAreaM2: addressInfoCtx?.builtAreaM2 ?? addressInfo?.builtAreaM2 ?? 0,
    fixedPopulation: addressInfoCtx?.fixedPopulation ?? addressInfo?.fixedPopulation ?? 0,
    floatingPopulation: addressInfoCtx?.floatingPopulation ?? addressInfo?.floatingPopulation ?? 0,

    levels: addressInfoCtx?.levels ?? addressInfo?.levels ?? "",
    buildingAge: addressInfoCtx?.buildingAge ?? addressInfo?.buildingAge ?? "",

    propertyBoundariesNorth: boundaryText("north"),
    propertyBoundariesSouth: boundaryText("south"),
    propertyBoundariesEast: boundaryText("east"),
    propertyBoundariesWest: boundaryText("west"),

    propertyBoundariesImageNorth: boundaryImage("north"),
    propertyBoundariesImageSouth: boundaryImage("south"),
    propertyBoundariesImageEast: boundaryImage("east"),
    propertyBoundariesImageWest: boundaryImage("west"),

    internalAreas: addressInfoCtx?.internalAreas?.length > 0 ? addressInfoCtx?.internalAreas : addressInfo?.internalAreas ?? [],
    isDone: addressInfoCtx?.isDone ?? addressInfo?.isDone ?? false,
  };
}
