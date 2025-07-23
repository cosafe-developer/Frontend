import { fetchWithCookies } from "helpers/fetch";



async function updateEmpresa(id, body) {
  try {
    const endpoint = `empresa/${id}`;
    const resp = await fetchWithCookies(endpoint, null, "PUT");

    const data = await resp.json();

    return data;
  } catch (error) {
    console.error("Error al obtener empresa:", error);
    return null;
  }
}

export default updateEmpresa;
