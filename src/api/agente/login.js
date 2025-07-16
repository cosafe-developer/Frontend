import axios from 'axios';

const AGENTE_LOGIN_URL = import.meta.env.VITE_AGENTE_LOGIN_URL;
const AGENTE_SESSION_URL = import.meta.env.VITE_AGENTE_SESSION_URL;

const ApiLoginAgente = async (email, password) => {
  try {
    const response = await axios.post(
      AGENTE_LOGIN_URL,
      { email, password },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw { mensaje: error.message || 'Error en login agente' };
  }
};

const checkAgenteSession = async () => {
  try {
    const response = await axios.get(AGENTE_SESSION_URL, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error al verificar sesión agente:', error);
    return null;
  }
};

export { ApiLoginAgente, checkAgenteSession };
