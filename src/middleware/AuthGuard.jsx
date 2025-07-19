// Import Dependencies
import { Navigate, useLocation, useOutlet } from "react-router";

// Local Imports
import { useAuthContext } from "app/contexts/auth/context";
import { GHOST_ENTRY_PATH, REDIRECT_URL_KEY } from "../constants/app.constant";

// ----------------------------------------------------------------------

export default function AuthGuard() {
  const outlet = useOutlet();
  const { isAuthenticated, role } = useAuthContext();

  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to={`${GHOST_ENTRY_PATH}?${REDIRECT_URL_KEY}=${location.pathname}`}
        replace
      />
    );
  }

  if (role === "admin") {
    if (!location.pathname.startsWith("/admin")) {
      return <Navigate to="/admin/listado" />;
    }
  }

  if (role === "agente") {
    if (!location.pathname.startsWith("/agente")) {
      return <Navigate to="/agente/listado" />;
    }
  }

  if (role === "empresa") {
    if (!location.pathname.startsWith("/empresa")) {
      return <Navigate to="/empresa/listado" />;
    }
  }

  return <>{outlet}</>;
}
