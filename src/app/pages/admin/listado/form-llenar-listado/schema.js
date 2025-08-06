// Import Dependencies
import * as Yup from 'yup'

// Local Imports
// import { isDeltaNotEmpty } from 'utils/quillUtils';

// ----------------------------------------------------------------------

// const FILE_SIZE = 5 * 1024 * 1024; // 5MB Máximo
// const PDF_SUPPORTED_FORMATS = ["application/pdf"];
// const IMAGE_SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png", "image/webp"];
// const INE_SUPPORTED_FORMATS = ["application/pdf", "image/jpg", "image/jpeg", "image/png", "image/webp"];

export const infoEmpresaSchema = Yup.object().shape({
  // logotipo: Yup.mixed()
  //   .nullable()
  //   .required('El logotipo es obligatorio')
  //   .test(
  //     'fileSize',
  //     'El tamaño máximo es de 4MB',
  //     (value) => value && value.size <= 4 * 1024 * 1024 // 4MB
  //   )
  //   .test(
  //     'fileType',
  //     'Solo se permiten imágenes',
  //     (value) => value && ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(value.type)
  //   ),
  // nombre: Yup.string()
  //   .trim()
  //   .required('Este campo es obligatorio'),
  // rfc: Yup.string()
  //   .trim()
  //   .required('Este campo es obligatorio'),
  // email: Yup.string()
  //   .trim()
  //   .required('Este campo es obligatorio'),
  // domicilio: Yup.string()
  //   .trim()
  //   .required('Este campo es obligatorio'),
  // domicilio_fisico: Yup.string()
  //   .trim()
  //   .required('Este campo es obligatorio'),
})

export const informacionDireccionSchema = Yup.object().shape({
  // constancia_fiscal: Yup.mixed()
  //   .nullable()
  //   .required("La constancia es obligatoria")
  //   .test(
  //     "fileFormat",
  //     "Solo se permite formato PDF",
  //     (value) => value && PDF_SUPPORTED_FORMATS.includes(value.type)
  //   )
  //   .test(
  //     "fileSize",
  //     "El tamaño máximo es de 5MB",
  //     (value) => value && value.size <= FILE_SIZE
  //   ),
  // actividades_empresa: Yup.string().trim().required("Este campo es obligatorio"),
  // giro_empresarial: Yup.string().trim().required("Este campo es obligatorio"),
  // responsable_inmueble: Yup.string().trim().required("Este campo es obligatorio"),
  // cargo_responsable_inmueble: Yup.string().trim().required("Este campo es obligatorio"),
  // nombre_representante: Yup.string().trim().required("Este campo es obligatorio"),
  // cargo_representante: Yup.string().trim().required("Este campo es obligatorio"),
  // firma_representante: Yup.mixed()
  //   .nullable()
  //   .required("La firma es obligatoria")
  //   .test(
  //     "fileFormat",
  //     "Solo se permiten imágenes (jpg, png, webp)",
  //     (value) => value && IMAGE_SUPPORTED_FORMATS.includes(value.type)
  //   )
  //   .test(
  //     "fileSize",
  //     "El tamaño máximo es de 5MB",
  //     (value) => value && value.size <= FILE_SIZE
  //   ),
  // ine_representante: Yup.mixed()
  //   .nullable()
  //   .required("El INE es obligatorio")
  //   .test(
  //     "fileFormat",
  //     "Solo se permite PDF o imágenes (jpg, png, webp)",
  //     (value) => value && INE_SUPPORTED_FORMATS.includes(value.type)
  //   )
  //   .test(
  //     "fileSize",
  //     "El tamaño máximo es de 5MB",
  //     (value) => value && value.size <= FILE_SIZE
  //   ),
  // domicilio_fisico: Yup.string().trim().required("Este campo es obligatorio"),
  // domicilio_notificaciones: Yup.string().trim().required("Este campo es obligatorio"),
  // superficie_terreno: Yup.string().trim().required("Este campo es obligatorio"),
  // poblacion_fija: Yup.string().trim().required("Este campo es obligatorio"),
  // colindancias_inmueble: Yup.string().trim().required("Este campo es obligatorio"),
  // areas_inmueble: Yup.string().trim().required("Este campo es obligatorio"),
});

export const informacionRiesgoSchema = Yup.object().shape({
  // inventario_recursos: Yup.mixed()
  //   .nullable()
  //   .required("El inventario es obligatorio")
  //   .test(
  //     "fileFormat",
  //     "Solo se permite formato PDF",
  //     (value) => value && PDF_SUPPORTED_FORMATS.includes(value.type)
  //   )
  //   .test(
  //     "fileSize",
  //     "El tamaño máximo es de 5MB",
  //     (value) => value && value.size <= FILE_SIZE
  //   ),
  // descripcion_empresa: Yup.string().trim().required("Este campo es obligatorio"),
  // tipo_riesgo_interno: Yup.string().trim().required("Este campo es obligatorio"),
  // antecedentes: Yup.string().trim().required("Este campo es obligatorio"),
  // riesgos_generales_internos: Yup.string().trim().required("Este campo es obligatorio"),
});

export const estudioSchema = Yup.object().shape({});