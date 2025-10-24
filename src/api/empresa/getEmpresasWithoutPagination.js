import { fetchWithCookies } from "helpers/fetch";

/**
 * Obtiene las empresas sin paginación.
 * Ejemplo de endpoint:
 * https://cosafe-m9uqr.ondigitalocean.app/api/v1/empresas?adminId=687ba0467242fa0da3ed642a&empresa_filters=all
 *
 * @param {Object} requestBody - Datos con user_id
 * @returns {Promise<any>}
 */
const getEmpresasWithoutPagination = async ({ requestBody }) => {
  try {
    const { user_id } = requestBody;

    const params = new URLSearchParams({
      adminId: user_id,
      empresa_filters: "all",
    });

    const url = `empresas?${params.toString()}`;

    const resp = await fetchWithCookies(url, {}, "GET");
    const result = await resp.json();

    return result;
  } catch (error) {
    console.error("Error al obtener empresas:", error);
    throw error;
  }
};

export default getEmpresasWithoutPagination;