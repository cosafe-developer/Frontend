export function resetDataEmpresaStep2({ listado, addressInfoCtx }) {
  const addressInfo = listado?.addressInfo;

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
    propertyBoundaries: addressInfoCtx?.propertyBoundaries ?? addressInfo?.propertyBoundaries ?? "",
    internalAreas: addressInfoCtx?.internalAreas?.length > 0 ? addressInfoCtx?.internalAreas : addressInfo?.internalAreas,
    isDone: addressInfoCtx?.isDone ?? addressInfo?.isDone ?? false,
  };
}
