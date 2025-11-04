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
    .nullable()
    .required("La firma del representante legal es obligatoria"),
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

  propertyBoundaries: Yup.string()
    .required("Las colindancias del inmueble son obligatorias"),
});

export const informacionRiesgoSchema = Yup.object().shape({
  materialsInventoryUrl: Yup.mixed()
    .nullable()
    .required("El inventario de materiales es obligatorio"),

  companyDescription: Yup.string()
    .trim()
    .required("La descripción de la empresa es obligatoria"),

  riskType: Yup.string()
    .trim()
    .required("El tipo de riesgo es obligatorio"),

  antecedents: Yup.string()
    .trim()
    .required("Los antecedentes son obligatorios"),

  internalGeneralRisks: Yup.string()
    .trim()
    .required("Los riesgos generales internos son obligatorios"),
});

export const estudioSchema = Yup.object().shape({});