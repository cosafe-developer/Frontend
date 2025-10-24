import { fetchWithCookies } from "helpers/fetch";

/**
 * Registra un agente usando sesiones/cookies (sin token explícito).
 * @param {Object} data - Datos del agente
 * @returns {Promise<any>}
 */
const getEmpresasWithPaginationById = async ({ requestBody }) => {
  try {
    const { paginacion, user_id } = requestBody;

    const params = new URLSearchParams({
      adminId: user_id,
      agente_filters: "paginacion",
      page: paginacion.page,
      limit: paginacion.limit,
    });

    const url = `empresas?${params.toString()}`;

    const resp = await fetchWithCookies(url, {}, "GET");
    const result = await resp.json();

    return result;
  } catch (error) {
    console.error("Error al registrar agente:", error);
    throw error;
  }
};

export default getEmpresasWithPaginationById;
