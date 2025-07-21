import { fetchWithToken } from "helpers/fetch";
/* import handleLogin from "helpers/handleLogin.helper";
 */
/**
 * Realiza el login por email usando el helper personalizado.
 * @param {{ requestBody: { email: string, password: string } }} param0
 */
const logoutSession = async () => {
  try {
    const resp = await fetchWithToken("logout", null, "POST");
    const body = await resp.json();

    return body;
  } catch (error) {
    console.error("Error al verificar sesión:", error);
    return null;
  }
};

export default logoutSession;
