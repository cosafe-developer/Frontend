// Import Dependencies
import { Navigate } from "react-router";

// Local Imports
import { AppLayout } from "app/layouts/AppLayout";
import { DynamicLayout } from "app/layouts/DynamicLayout";
import AuthGuard from "middleware/AuthGuard";

// ----------------------------------------------------------------------

const protectedRoutes = {
  id: "protected",
  Component: AuthGuard,
  children: [
    // The dynamic layout supports both the main layout and the sideblock.
    {
      Component: DynamicLayout,
      children: [
        {
          index: true,
          element: <Navigate to="/admin" />,
        },
        {
          path: "admin",
          children: [
            {
              index: true,
              element: <Navigate to="/admin/listado" />,
            },
            {
              path: "listado",
              lazy: async () => ({
                Component: (await import("app/pages/admin/listado/Listado")).default,
              }),
            },
            {
              path: "listado/completo",
              lazy: async () => ({
                Component: (await import("app/pages/admin/listado/ListadoCompleto")).default,
              }),
            },
            {
              path: "listado/crear",
              lazy: async () => ({
                Component: (await import("app/pages/admin/listado/CrearListado")).default,
              }),
            },
            {
              path: "listado/llenar",
              lazy: async () => ({
                Component: (await import("app/pages/admin/listado/LlenarListado")).default,
              }),
            },
            {
              path: "agentes",
              lazy: async () => ({
                Component: (await import("app/pages/admin/agentes/Agentes")).default,
              }),
            },
            {
              path: "agentes/crear",
              lazy: async () => ({
                Component: (await import("app/pages/admin/agentes/CrearAgente")).default,
              }),
            },
            {
              path: "agentes/editar",
              lazy: async () => ({
                Component: (await import("app/pages/admin/agentes/EditarAgente")).default,
              }),
            },
            {
              path: "empresas",
              lazy: async () => ({
                Component: (await import("app/pages/admin/empresas/Empresas")).default,
              }),
            },
            {
              path: "empresas/crear",
              lazy: async () => ({
                Component: (await import("app/pages/admin/empresas/CrearEmpresa")).default,
              }),
            },
            {
              path: "empresas/editar",
              lazy: async () => ({
                Component: (await import("app/pages/admin/empresas/EditarEmpresa")).default,
              }),
            },
          ],
        },
      ],
    },
    // The app layout supports only the main layout. Avoid using it for other layouts.
    {
      Component: AppLayout,
      children: [
        {
          path: "configuracion",
          lazy: async () => ({
            Component: (await import("app/pages/settings/Layout")).default,
          }),
          children: [
            {
              index: true,
              element: <Navigate to="/configuracion/general" />,
            },
            {
              path: "general",
              lazy: async () => ({
                Component: (await import("app/pages/settings/sections/General"))
                  .default,
              }),
            },
            {
              path: "apariencia",
              lazy: async () => ({
                Component: (
                  await import("app/pages/settings/sections/Appearance")
                ).default,
              }),
            },
          ],
        },
      ],
    },
  ],
};

export { protectedRoutes };
