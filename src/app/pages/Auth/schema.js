import * as Yup from 'yup'

export const schema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .required('Correo obligatorio'),
  password: Yup.string().trim()
    .required('Contraseña obligatoria'),
})