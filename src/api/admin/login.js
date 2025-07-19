import axios from 'axios';

const ADMIN_LOGIN_URL = import.meta.env.VITE_ADMIN_LOGIN_URL;
const ADMIN_SESSION_URL = import.meta.env.VITE_ADMIN_SESSION_URL;

const ApiLoginAdmin = async (email, password) => {
  try {
    const response = await axios.post(
      ADMIN_LOGIN_URL,
      { email, password },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw { mensaje: error.message || 'Error en login' };
  }
};

const checkAdminSession = async () => {
  try {
    const response = await axios.get(ADMIN_SESSION_URL, {
      withCredentials: true, // para enviar cookie y validar sesión
    });
    return response.data;
  } catch (error) {
    console.error('Error al verificar sesión:', error);
    return null; // si falla o no hay sesión activa
  }
};

export { ApiLoginAdmin, checkAdminSession };
