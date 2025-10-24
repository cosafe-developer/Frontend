import { fetchWithCookies } from "helpers/fetch";

/**
 * Registra una empresa usando sesiones/cookies.
 * @param {Object} data - Datos de la empresa
 * @returns {Promise<any>}
 */
const createListado = async ({ requestBody }) => {
  try {
    const resp = await fetchWithCookies("create/listrequirements", requestBody, "POST");
    const result = await resp.json();

    return result;
  } catch (error) {
    console.error("Error al registrar empresa:", error);
    throw error;
  }
};

export default createListado;
