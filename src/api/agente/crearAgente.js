import axios from "axios";

const AGENTE_CREAR = import.meta.env.VITE_AGENTE_CREAR;

const registrarAgente = async (data) => {
  const res = await axios.post(
    AGENTE_CREAR,
    data,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return res.data;
};

export default registrarAgente;
