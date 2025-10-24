import { fetchWithCookies } from "helpers/fetch";

/**
 * Registra un agente usando sesiones/cookies (sin token explícito).
 * @param {Object} data - Datos del agente
 * @returns {Promise<any>}
 */
const getListados = async () => {
  try {
    const url = `/get/listrequirements`;

    const resp = await fetchWithCookies(url, null, "GET");
    const result = await resp.json();

    return result;
  } catch (error) {
    console.error("Error al registrar agente:", error);
    throw error;
  }
};

export default getListados;
