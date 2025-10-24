import { fetchWithCookies } from "helpers/fetch";

/**
 * Registra una empresa usando sesiones/cookies.
 * @param {Object} data - Datos de la empresa
 * @returns {Promise<any>}
 */
const createEstudio = async ({ requestBody }) => {
  try {
    const resp = await fetchWithCookies("empresa/register", requestBody, "POST");
    const result = await resp.json();

    return result;
  } catch (error) {
    console.error("Error al registrar empresa:", error);
    throw error;
  }
};

export default createEstudio;
