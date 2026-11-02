// Import Dependencies
import { Navigate, useOutlet } from "react-router";

// Local Imports
import { useAuthContext } from "app/contexts/auth/context";
import { HOME_PATH, REDIRECT_URL_KEY } from "constants/app.constant";

// ----------------------------------------------------------------------


export default function GhostGuard() {
  const outlet = useOutlet();
  const { isAuthenticated } = useAuthContext();

  // get() devuelve null si no hay ?redirect=; solo aceptar rutas internas
  // ("/x", no "//dominio") para evitar "/null" y open-redirects.
  const url = new URLSearchParams(window.location.search).get(REDIRECT_URL_KEY);

  if (isAuthenticated) {
    if (url && url.startsWith("/") && !url.startsWith("//")) {
      return <Navigate to={url} />;
    }
    return <Navigate to={HOME_PATH} />;
  }

  return <>{outlet}</>;
}
