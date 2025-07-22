import { fetchWithToken } from "helpers/fetch";
/* import handleLogin from "helpers/handleLogin.helper";
 */
/**
 * Realiza el login por email usando el helper personalizado.
 * @param {{ requestBody: { email: string, password: string } }} param0
 */
const emailLogin = async ({ requestBody }) => {
  try {
    const resp = await fetchWithToken("admin/login", requestBody, "POST");
    const body = await resp.json();

    /* if (body?.mensaje === "Login exitoso") {
      const data = body?.response?.data;
      if (data?.token) {
        handleLogin(data.token, data);
      }
    } */

    return body;
  } catch (error) {
    console.error("Login error:", error);
  }
};

export default emailLogin;
