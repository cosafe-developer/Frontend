import { fetchWithCookies } from "helpers/fetch";
import handleLogin from "helpers/handleLogin.helper";
/* import handleLogin from "helpers/handleLogin.helper";
 */
/**
 * Realiza el login por email usando el helper personalizado.
 * @param {{ requestBody: { email: string, password: string } }} param0
 */
const emailLogin = async ({ requestBody }) => {
  try {

    const resp = await fetchWithCookies("login", requestBody, "POST");
    const body = await resp.json();

    if (body?.ok) {
      const data = body?.data?.usuario;
      handleLogin(data);
    }

    return body;
  } catch (error) {
    console.error("Login error:", error);
  }
};

export default emailLogin;
