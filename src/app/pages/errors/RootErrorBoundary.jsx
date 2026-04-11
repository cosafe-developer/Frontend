// Import Depndencies
import { isRouteErrorResponse, useRouteError } from "react-router";
import { lazy } from "react";

// Local Imports
import { Loadable } from "components/shared/Loadable";

// ----------------------------------------------------------------------

const app = {
  401: lazy(() => import("./401")),
  404: lazy(() => import("./404")),
  429: lazy(() => import("./429")),
  500: lazy(() => import("./500")),
};

function RootErrorBoundary() {
  const error = useRouteError();
  console.error(error);

  if (isRouteErrorResponse(error)) {
    const status = app[error.status] ? error.status : 404;
    const Component = Loadable(app[status]);
    return <Component />;
  }

  // Para errores no-HTTP (chunks fallidos, lazy imports rotos, etc.)
  // mostramos la página 404 como fallback amigable en vez de "Ha ocurrido un error"
  const FallbackComponent = Loadable(app[500]);
  return <FallbackComponent />;
}

export default RootErrorBoundary;
