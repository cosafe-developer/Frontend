// src/api/empresas.js
import axios from "axios";
import { checkAdminSession } from "../admin/login";

const EMPRESAS_OBTENER = import.meta.env.VITE_EMPRESAS_OBTENER;

async function obtenerEmpresas() {
  try {
    // 1. Checa sesión del admin
    const session = await checkAdminSession();

    if (!session || !session.id) {
      console.error("No hay sesión activa o falta el ID de admin.");
      return [];
    }

    // 2. Usa el id en la petición
    const { data } = await axios.get(
      `${EMPRESAS_OBTENER}?adminId=${session.id}`,
      { withCredentials: true }
    );

    return data;
  } catch (error) {
    console.error("Error obteniendo empresas:", error);
    return [];
  }
}

export default obtenerEmpresas;
