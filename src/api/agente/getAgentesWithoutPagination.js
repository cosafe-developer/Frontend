import { fetchWithCookies } from "helpers/fetch";

/**
 * Obtiene las agentes sin paginación.
 *
 * @param {Object} requestBody - Datos con user_id
 * @returns {Promise<any>}
 */
const getAgentesWithoutPagination = async ({ requestBody }) => {
  try {
    const { user_id } = requestBody;

    const params = new URLSearchParams({
      adminId: user_id,
      empresa_filters: "all",
    });

    const url = `agentes?${params.toString()}`;

    const resp = await fetchWithCookies(url, {}, "GET");
    const result = await resp.json();

    return result;
  } catch (error) {
    console.error("Error al obtener agentes:", error);
    throw error;
  }
};

export default getAgentesWithoutPagination;