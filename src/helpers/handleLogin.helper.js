import Cookies from "universal-cookie";
import { safeSetItem } from "utils/safeStorage";

const handleLogin = (data) => {
  const cookies = new Cookies();

  cookies.set("user_id", data.id || "",);

  const userInfo = {
    id: data?.id,
    nombre: data?.nombre,
    status: data?.status,
    rol: data?.role
  };

  safeSetItem("userInfo", JSON.stringify(userInfo));

};

export { handleLogin as default };