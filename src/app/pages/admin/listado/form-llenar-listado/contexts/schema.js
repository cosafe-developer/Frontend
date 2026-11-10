// Import Dependencies
import * as Yup from 'yup'
import { hasUploadValue } from 'helpers/listadoData'
import { CALENDAR_ACTIVITIES } from '../utils/calendarActivities'

// Archivo obligatorio: sólo cuenta un File, dataURL o URL real. `{}` (File
// serializado guardado por el bug), "" y placeholders NO cumplen.
const requiredUpload = (message) =>
  Yup.mixed().nullable().test('archivo-requerido', message, (value) => hasUploadValue(value))

export const infoEmpresaSchema = Yup.object().shape({
  logoUrl: requiredUpload('El logotipo es obligatorio'),
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
  city: Yup.string()
    .trim()
    .required('La ciudad es obligatoria'),
  state: Yup.string()
    .trim()
    .required('El estado es obligatorio'),

})

export const informacionDireccionSchema = Yup.object().shape({
  taxCertificateUrl: requiredUpload("La constancia fiscal es obligatoria"),

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
  legalRepresentativeIneUrl: requiredUpload("El INE del representante legal es obligatorio"),
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

  levels: Yup.string().trim().nullable(),
  buildingAge: Yup.string().trim().nullable(),

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
  propertyBoundariesImageNorth: requiredUpload("La imagen de referencia Norte es obligatoria"),
  propertyBoundariesImageSouth: requiredUpload("La imagen de referencia Sur es obligatoria"),
  propertyBoundariesImageEast: requiredUpload("La imagen de referencia Este es obligatoria"),
  propertyBoundariesImageWest: requiredUpload("La imagen de referencia Oeste es obligatoria"),
});

export const informacionRiesgoSchema = Yup.object().shape({
  materialsInventoryApplies: Yup.boolean().nullable(),
  // El inventario ya no es un archivo: se captura en ResourceInventorySection
  // (studyData.resourceInventory). Antes este "required" sólo se cumplía con
  // el placeholder falso de mybucket; ya no hay campo de archivo en la UI.
  materialsInventoryUrl: Yup.mixed().nullable(),

  companyDescription: Yup.string()
    .trim()
    .required("La descripción de la empresa es obligatoria"),

  internalRiskType: Yup.string()
    .trim()
    .oneOf(["ordinario", "alto", "critico"], "Tipo de riesgo inválido")
    .required("El tipo de riesgo interno es obligatorio"),

  surroundingRiskType: Yup.string()
    .trim()
    .oneOf(["ordinario", "alto", "critico"], "Tipo de riesgo inválido")
    .required("El tipo de riesgo por entorno es obligatorio"),

  antecedentsRaw: Yup.string()
    .trim()
    .required("Los antecedentes son obligatorios"),

  // Calendario: una o más fechas, cada una con su tipo de actividad
  preventionCalendarEvents: Yup.array()
    .of(
      Yup.object({
        date: Yup.string().trim().required("Elige la fecha"),
        activity: Yup.string()
          .oneOf(CALENDAR_ACTIVITIES.map((a) => a.id), "Elige el tipo de actividad")
          .required("Elige el tipo de actividad"),
      }),
    )
    .min(1, "Agrega al menos una fecha al calendario de prevención"),

  internalGeneralRisks: Yup.mixed().nullable(),
});

export const estudioSchema = Yup.object().shape({});