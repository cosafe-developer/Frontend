// Import Dependencies
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

// Fallback inline que no depende de lazy loading ni red
function InlineFallback() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      fontFamily: "system-ui, -apple-system, sans-serif",
      background: "#1a1b1e",
      color: "#fff",
      padding: "2rem",
      textAlign: "center",
    }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
        Algo salió mal
      </h1>
      <p style={{ color: "#999", marginBottom: "2rem", maxWidth: "400px" }}>
        No se pudo cargar la aplicación. Verifica tu conexión a internet e intenta de nuevo.
      </p>
      <button
        onClick={() => { window.location.href = "/login"; }}
        style={{
          padding: "0.75rem 2rem",
          background: "#3b82f6",
          color: "#fff",
          border: "none",
          borderRadius: "0.5rem",
          fontSize: "1rem",
          cursor: "pointer",
        }}
      >
        Ir al inicio
      </button>
    </div>
  );
}

function RootErrorBoundary() {
  const error = useRouteError();
  console.error("RootErrorBoundary:", error);

  if (isRouteErrorResponse(error)) {
    const status = app[error.status] ? error.status : 404;
    try {
      const Component = Loadable(app[status]);
      return <Component />;
    } catch {
      return <InlineFallback />;
    }
  }

  return <InlineFallback />;
}

export default RootErrorBoundary;
