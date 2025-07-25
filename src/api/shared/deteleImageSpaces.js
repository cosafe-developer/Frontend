import { fetchWithCookies } from "helpers/fetch";


const deleteImage = async (filePath) => {
  const endpoint = `delete-file?filePath=${encodeURIComponent(filePath)}`;

  const resp = await fetchWithCookies(endpoint, null, "DELETE");

  if (!resp.ok) {
    throw new Error("Error al eliminar imagen");
  }

  return await resp.json();
};

export default deleteImage;

