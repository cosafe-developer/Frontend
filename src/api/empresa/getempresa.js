import axios from "axios";

const VITE_EMPRESA_OBTENER = import.meta.env.VITE_EMPRESA_OBTENER;

async function obtenerEmpresa(id) {
  const { data } = await axios.get(
    `${VITE_EMPRESA_OBTENER}/${id}`,
    { withCredentials: true }
  );
  return data;
}

export default obtenerEmpresa;
