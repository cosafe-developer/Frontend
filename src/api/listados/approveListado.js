import { fetchWithCookies } from "helpers/fetch";

/**
 * Aprueba un listado (solo el admin creador). Marca isApproved=true y status='completado'.
 * @param {string} listadoId
 * @returns {Promise<any>}
 */
const approveListado = async (listadoId) => {
  const resp = await fetchWithCookies(`approve/listrequirements/${listadoId}`, {}, "PATCH");
  const result = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    throw new Error(result?.message || "No se pudo aprobar el listado");
  }
  return result;
};

export default approveListado;
