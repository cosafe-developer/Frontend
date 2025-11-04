import { fetchWithCookies } from "helpers/fetch";

/**
 * Obtiene la firma pre-firmada para subir una imagen a DigitalOcean Spaces.
 * @param {Object} params
 * @param {string} params.fileName - Nombre del archivo
 * @param {string} params.fileType - Tipo MIME del archivo
 * @param {string} params.folder - Carpeta en el storage
 * @returns {Promise<{ uploadUrl: string, publicUrl: string }>}
 */
const getFirmaUploadImage = async ({ fileName, fileType, folder }) => {
  try {
    const resp = await fetchWithCookies(
      `upload-url?fileName=${encodeURIComponent(fileName)}&fileType=${encodeURIComponent(fileType)}&folder=${encodeURIComponent(folder)}`,
      {},
      "GET"
    );

    const result = await resp.json();

    return result;
  } catch (error) {
    console.error("Error obteniendo la firma para upload:", error);
    throw error;
  }
};

export default getFirmaUploadImage;
