export function resetDataEmpresaStep2({ listado, addressInfoCtx }) {
  const addressInfo = listado?.addressInfo;
  const boundaries = addressInfo?.propertyBoundaries ?? {};

  return {
    taxCertificateUrl:
      addressInfoCtx?.taxCertificateUrl ??
      (addressInfo?.taxCertificateUrl?.length > 0
        ? addressInfo?.taxCertificateUrl
        : "https://mybucket.digitaloceanspaces.com/constancia.pdf"),

    activities: addressInfoCtx?.activities ?? addressInfo?.activities ?? "",
    businessTurn: addressInfoCtx?.businessTurn ?? addressInfo?.businessTurn ?? "",
    propertyResponsibleName: addressInfoCtx?.propertyResponsibleName ?? addressInfo?.propertyResponsibleName ?? "",
    propertyResponsiblePosition: addressInfoCtx?.propertyResponsiblePosition ?? addressInfo?.propertyResponsiblePosition ?? "",
    legalRepresentativeName: addressInfoCtx?.legalRepresentativeName ?? addressInfo?.legalRepresentativeName ?? "",
    legalRepresentativePosition: addressInfoCtx?.legalRepresentativePosition ?? addressInfo?.legalRepresentativePosition ?? "",

    legalRepresentativeSignatureUrl:
      addressInfoCtx?.legalRepresentativeSignatureUrl ??
      (addressInfo?.legalRepresentativeSignatureUrl?.length > 0
        ? addressInfo?.legalRepresentativeSignatureUrl
        : "https://mybucket.digitaloceanspaces.com/firma.png"),

    legalRepresentativeIneUrl:
      addressInfoCtx?.legalRepresentativeIneUrl ??
      (addressInfo?.legalRepresentativeIneUrl?.length > 0
        ? addressInfo?.legalRepresentativeIneUrl
        : "https://mybucket.digitaloceanspaces.com/ine.pdf"),

    landAreaM2: addressInfoCtx?.landAreaM2 ?? addressInfo?.landAreaM2 ?? 0,
    builtAreaM2: addressInfoCtx?.builtAreaM2 ?? addressInfo?.builtAreaM2 ?? 0,
    fixedPopulation: addressInfoCtx?.fixedPopulation ?? addressInfo?.fixedPopulation ?? 0,
    floatingPopulation: addressInfoCtx?.floatingPopulation ?? addressInfo?.floatingPopulation ?? 0,

    levels: addressInfoCtx?.levels ?? addressInfo?.levels ?? "",
    buildingAge: addressInfoCtx?.buildingAge ?? addressInfo?.buildingAge ?? "",

    propertyBoundariesNorth: addressInfoCtx?.propertyBoundariesNorth ?? boundaries?.north?.observations ?? "",
    propertyBoundariesSouth: addressInfoCtx?.propertyBoundariesSouth ?? boundaries?.south?.observations ?? "",
    propertyBoundariesEast: addressInfoCtx?.propertyBoundariesEast ?? boundaries?.east?.observations ?? "",
    propertyBoundariesWest: addressInfoCtx?.propertyBoundariesWest ?? boundaries?.west?.observations ?? "",

    propertyBoundariesImageNorth: addressInfoCtx?.propertyBoundariesImageNorth ?? boundaries?.north?.imageUrl ?? "",
    propertyBoundariesImageSouth: addressInfoCtx?.propertyBoundariesImageSouth ?? boundaries?.south?.imageUrl ?? "",
    propertyBoundariesImageEast: addressInfoCtx?.propertyBoundariesImageEast ?? boundaries?.east?.imageUrl ?? "",
    propertyBoundariesImageWest: addressInfoCtx?.propertyBoundariesImageWest ?? boundaries?.west?.imageUrl ?? "",

    internalAreas: addressInfoCtx?.internalAreas?.length > 0 ? addressInfoCtx?.internalAreas : addressInfo?.internalAreas ?? [],
    isDone: addressInfoCtx?.isDone ?? addressInfo?.isDone ?? false,
  };
}
