import { fetchWithCookies } from "helpers/fetch";



async function getEmpresaById(id) {
  try {
    const endpoint = `empresa/${id}`;
    const resp = await fetchWithCookies(endpoint);

    const data = await resp.json();

    return data;
  } catch (error) {
    console.error("Error al obtener empresa:", error);
    return null;
  }
}

export default getEmpresaById;
