import axios from "axios";

const UPLOAD_API_URL = import.meta.env.VITE_UPLOAD_API_URL;

const subirImagenSpaces = async (file, folder) => {
  if (!folder) {
    throw new Error("Debes indicar el folder al subir la imagen");
  }

  const fileName = file.name;
  const fileType = file.type;

  // 1. Solicitar la URL firmada
  const { data } = await axios.get(`${UPLOAD_API_URL}/api/v1/upload-url`, {
    params: {
      fileName,
      fileType,
      folder,
    },
    withCredentials: true,
  });

  const { signedUrl, publicUrl } = data;

  // 2. Subir el archivo directamente a Spaces
  const upload = await axios.put(signedUrl, file, {
    headers: {
      "Content-Type": fileType,
      "x-amz-acl": "public-read",
    },
  });

  if (upload.status !== 200) {
    throw new Error("Error al subir imagen");
  }

  return publicUrl;
};

export default subirImagenSpaces;
