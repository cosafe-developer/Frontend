// Import Dependencies
import * as Yup from 'yup'

export const infoEmpresaSchema = Yup.object().shape({
  logoUrl: Yup.mixed()
    .nullable()
    .required('El logotipo es obligatorio'),
  businessName: Yup.string()
    .trim()
    .required('Este campo es obligatorio'),
  rfc: Yup.string()
    .trim()
    .required('Este campo es obligatorio'),
  email: Yup.string()
    .trim()
    .required('Este campo es obligatorio'),
  address: Yup.string()
    .trim()
    .required('Este campo es obligatorio'),

})

export const informacionDireccionSchema = Yup.object().shape({
  taxCertificateUrl: Yup.mixed()
    .nullable()
    .required("La constancia fiscal es obligatoria"),

  activities: Yup.string().trim().required("Las actividades son obligatorias"),

  businessTurn: Yup.string().trim().required("El giro empresarial es obligatorio"),

  propertyResponsibleName: Yup.string()
    .trim()
    .required("El nombre del responsable del inmueble es obligatorio"),

  propertyResponsiblePosition: Yup.string()
    .trim()
    .required("El cargo del responsable del inmueble es obligatorio"),

  legalRepresentativeName: Yup.string()
    .trim()
    .required("El nombre del representante legal es obligatorio"),

  legalRepresentativePosition: Yup.string()
    .trim()
    .required("El cargo del representante legal es obligatorio"),

  legalRepresentativeSignatureUrl: Yup.mixed()
    .nullable(),
  legalRepresentativeIneUrl: Yup.mixed()
    .nullable()
    .required("El INE del representante legal es obligatorio"),
  landAreaM2: Yup.number()
    .typeError("La superficie del terreno debe ser numérica")
    .required("La superficie del terreno es obligatoria"),

  builtAreaM2: Yup.number()
    .typeError("El área construida debe ser numérica")
    .required("El área construida es obligatoria"),

  fixedPopulation: Yup.number()
    .typeError("La población fija debe ser numérica")
    .required("La población fija es obligatoria"),

  floatingPopulation: Yup.number()
    .typeError("La población flotante debe ser numérica")
    .required("La población flotante es obligatoria"),

  propertyBoundariesNorth: Yup.string()
    .trim()
    .required("La colindancia Norte es obligatoria"),
  propertyBoundariesSouth: Yup.string()
    .trim()
    .required("La colindancia Sur es obligatoria"),
  propertyBoundariesEast: Yup.string()
    .trim()
    .required("La colindancia Este es obligatoria"),
  propertyBoundariesWest: Yup.string()
    .trim()
    .required("La colindancia Oeste es obligatoria"),
  propertyBoundariesImageNorth: Yup.mixed()
    .nullable()
    .required("La imagen de referencia Norte es obligatoria"),
  propertyBoundariesImageSouth: Yup.mixed()
    .nullable()
    .required("La imagen de referencia Sur es obligatoria"),
  propertyBoundariesImageEast: Yup.mixed()
    .nullable()
    .required("La imagen de referencia Este es obligatoria"),
  propertyBoundariesImageWest: Yup.mixed()
    .nullable()
    .required("La imagen de referencia Oeste es obligatoria"),
});

export const informacionRiesgoSchema = Yup.object().shape({
  materialsInventoryApplies: Yup.boolean().nullable(),
  materialsInventoryUrl: Yup.mixed()
    .nullable()
    .when('materialsInventoryApplies', {
      is: (val) => val === true,
      then: (schema) => schema.required("El inventario de materiales es obligatorio cuando aplica"),
      otherwise: (schema) => schema.nullable(),
    }),

  companyDescription: Yup.string()
    .trim()
    .required("La descripción de la empresa es obligatoria"),

  riskType: Yup.string()
    .trim()
    .required("El tipo de riesgo es obligatorio"),

  antecedents: Yup.string()
    .trim()
    .required("Los antecedentes son obligatorios"),

  internalGeneralRisks: Yup.mixed().nullable(),
});

export const estudioSchema = Yup.object().shape({});