import { fetchWithCookies } from "helpers/fetch";
import { checkAdminSession } from "../admin/login";


async function getEmpresas() {
  try {
    const session = await checkAdminSession();

    if (!session || !session.id) {
      console.error("No hay sesión activa o falta el ID de admin.");
      return [];
    }


    const endpoint = `empresas?adminId=${session.id}`;

    const resp = await fetchWithCookies(endpoint);
    const data = await resp.json();

    return data;
  } catch (error) {
    console.error("Error obteniendo empresas:", error);
    return [];
  }
}

export default getEmpresas;

