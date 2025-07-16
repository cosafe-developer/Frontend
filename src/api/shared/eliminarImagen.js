import axios from "axios";

const UPLOAD_API_URL = import.meta.env.VITE_UPLOAD_API_URL;

const eliminarImagenSpaces = async (filePath) => {
  await axios.delete(`${UPLOAD_API_URL}/api/v1/delete-file`, {
    params: { filePath },
    withCredentials: true,
  });
};

export default eliminarImagenSpaces;


