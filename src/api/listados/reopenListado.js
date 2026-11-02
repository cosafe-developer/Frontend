import { fetchWithCookies } from "helpers/fetch";

/**
 * Reabre un listado aprobado (solo el admin creador). Vuelve a isApproved=false y status='pendiente'.
 * @param {string} listadoId
 * @returns {Promise<any>}
 */
const reopenListado = async (listadoId) => {
  const resp = await fetchWithCookies(`reopen/listrequirements/${listadoId}`, {}, "PATCH");
  const result = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    throw new Error(result?.message || "No se pudo reabrir el listado");
  }
  return result;
};

export default reopenListado;
