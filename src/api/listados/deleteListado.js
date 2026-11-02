import { fetchWithCookies } from "helpers/fetch";

/**
 * Elimina un listado y sus referencias en la empresa y los agentes (solo el admin creador).
 * @param {string} listadoId
 * @returns {Promise<any>}
 */
const deleteListado = async (listadoId) => {
  const resp = await fetchWithCookies(`delete/listrequirements/${listadoId}`, null, "DELETE");
  const result = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    throw new Error(result?.message || "No se pudo eliminar el listado");
  }
  return result;
};

export default deleteListado;
