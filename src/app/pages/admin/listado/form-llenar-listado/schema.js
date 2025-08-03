// Import Dependencies
import * as Yup from 'yup'

// Local Imports
// import { isDeltaNotEmpty } from 'utils/quillUtils';

// ----------------------------------------------------------------------

export const generalSchema = Yup.object().shape({
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

export const descriptionSchema = Yup.object().shape({

});

export const estudioSchema = Yup.object().shape({

});

export const imageSchema = Yup.object().shape({
  // cover: Yup.mixed().nullable()
  //   .required("You need to provide a file")
  //   .test("fileSize", "Max file size should be 4MB", value => value && value.size <= 4194304),
  // gallery: Yup.array().of(Yup.mixed().nullable()).max(10),
})