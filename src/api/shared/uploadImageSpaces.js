import { fetchWithCookies } from "helpers/fetch";
import axios from "axios";

const uploadImageSpaces = async (file, folder) => {
  if (!folder) {
    throw new Error("Debes indicar el folder al subir la imagen");
  }

  const fileName = file.name;
  const fileType = file.type;

  const params = new URLSearchParams({ fileName, fileType, folder });
  const endpoint = `upload-url?${params.toString()}`;

  const response = await fetchWithCookies(endpoint, null, "GET");
  if (!response.ok) {
    throw new Error("Error al obtener URL firmada");
  }

  const { signedUrl, publicUrl } = await response.json();

  const upload = await axios.put(signedUrl, file, {
    headers: {
      "Content-Type": fileType,
      "x-amz-acl": "public-read",
    },
  });


  if (!upload.ok) {
    throw new Error("Error al subir imagen");
  }

  return publicUrl;
};

export default uploadImageSpaces;
