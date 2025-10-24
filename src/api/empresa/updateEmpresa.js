import { fetchWithCookies } from "helpers/fetch";

/**
 * Registra un agente usando sesiones/cookies (sin token explícito).
 * @param {Object} data - Datos del agente
 * @returns {Promise<any>}
 */
const updateEmpresa = async ({ requestBody }) => {
  try {
    const resp = await fetchWithCookies(`empresa/${requestBody?.empresa_id}`, requestBody, "PUT");
    const result = await resp.json();

    return result;
  } catch (error) {
    console.error("Error al registrar agente:", error);
    throw error;
  }
};

export default updateEmpresa;
