import axios from "axios";

const EMPRESA_EDITAR = import.meta.env.VITE_EMPRESA_EDITAR;

const editarempresa = async (id, body) => {
  const { data } = await axios.put(
    `${EMPRESA_EDITAR}/${id}`,
    body,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
  return data;
};

export default editarempresa;
