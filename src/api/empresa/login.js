import axios from 'axios';

const EMPRESA_LOGIN_URL = import.meta.env.VITE_EMPRESA_LOGIN_URL;
const EMPRESA_SESSION_URL = import.meta.env.VITE_EMPRESA_SESSION_URL;

const ApiLoginEmpresa = async (email, password) => {
  try {
    const response = await axios.post(
      EMPRESA_LOGIN_URL,
      { email, password },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw { mensaje: error.message || 'Error en login empresa' };
  }
};

const checkEmpresaSession = async () => {
  try {
    const response = await axios.get(EMPRESA_SESSION_URL, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error al verificar sesión empresa:', error);
    return null;
  }
};

export { ApiLoginEmpresa, checkEmpresaSession };
