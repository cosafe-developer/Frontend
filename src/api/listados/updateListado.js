import { fetchWithCookies } from "helpers/fetch";
import { changeLogFromResponse } from "helpers/changeLog";
import { publishChangeLog } from "helpers/listadoChangeLogStore";

/**
 * Actualiza (merge) un listado: POST update/listrequirements/:id.
 * La respuesta trae el listado actualizado en `data`; si incluye `changeLog`
 * se publica para los recuadros "Último cambio" del formulario.
 * @param {{ requestBody: Object }} params - requestBody con listado_id
 * @returns {Promise<any>}
 */
const updateListado = async ({ requestBody }) => {
  try {
    const resp = await fetchWithCookies(`update/listrequirements/${requestBody?.listado_id}`, requestBody, "POST");
    const result = await resp.json();

    const changeLog = changeLogFromResponse(result);
    if (changeLog) publishChangeLog(requestBody?.listado_id, changeLog);

    return result;
  } catch (error) {
    console.error("Error al actualizar el listado:", error);
    throw error;
  }
};

export default updateListado;
