// Import Dependencies
import { Navigate, useLocation, useOutlet } from "react-router";

// Local Imports
import { useAuthContext } from "app/contexts/auth/context";
import { GHOST_ENTRY_PATH, REDIRECT_URL_KEY } from "../constants/app.constant";

// ----------------------------------------------------------------------

export default function AuthGuard() {
  const outlet = useOutlet();
  const { isAuthenticated } = useAuthContext();

  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to={`${GHOST_ENTRY_PATH}?${REDIRECT_URL_KEY}=${location.pathname}`}
        replace
      />
    );
  }

  // Todos los roles usan las mismas rutas /admin/* por ahora.
  // Cuando se creen rutas específicas para agente/empresa, agregar aquí.
  const allowedPrefixes = ["/admin", "/configuracion"];
  const isAllowedPath = allowedPrefixes.some((p) =>
    location.pathname.startsWith(p)
  );

  if (!isAllowedPath) {
    return <Navigate to="/admin/listado" replace />;
  }

  return <>{outlet}</>;
}
