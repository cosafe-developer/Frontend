import axios from 'axios';

const EMPRESA_CREAR = import.meta.env.VITE_EMPRESA_CREAR;

const registrarEmpresa = async (data) => {
  const res = await axios.post(EMPRESA_CREAR, data, {
    withCredentials: true,
  });
  return res.data;
};

export default registrarEmpresa;
