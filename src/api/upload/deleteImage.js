import { fetchWithCookies } from "helpers/fetch";

/**
 * Elimina una imagen del almacenamiento (DigitalOcean Spaces).
 * @param {Object} params
 * @param {string} params.pathName - Ruta completa del archivo (por ejemplo: "profile/1751913130910-logo.png")
 * @returns {Promise<Object>} - Resultado de la operación
 */
const deleteImage = async ({ pathName }) => {
  try {
    const url = `delete-file?filePath=${pathName}`;

    const resp = await fetchWithCookies(url, {}, "DELETE");

    const result = await resp.json();

    return result;
  } catch (error) {
    console.error("Error eliminando imagen:", error);
    throw error;
  }
};

export default deleteImage;
