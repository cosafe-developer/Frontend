import { Routes, Route } from 'react-router-dom';
import AdminLogin from '../pages/auth/AdminLogin';
import AdminListados from '../pages/admin/Listados'; 
import AdminLayout from '../layouts/AdminLayout';
import AdminProtectedRoute from '../middleware/AdminProtectedRoute';
import CrearEmpresaPage from '../pages/admin/CRUD/CrearEmpresa';
import EditarEmpresaPage from '../pages/admin/CRUD/EditarEmpresa';
import CrearAgentesPage from '../pages/admin/CRUD/CrearAgente';

import Empresas from '../pages/admin/Empresa';

function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route
        path=""
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        <Route index element={<AdminListados />} />
        <Route path="crear-empresa" element={<CrearEmpresaPage />} />
        <Route path="editar-empresa/:empresaId" element={<EditarEmpresaPage />} />
        <Route path="empresas" element={<Empresas />} />

        <Route path="crear-agente" element={<CrearAgentesPage />} />

      </Route>
    </Routes>
  );
}

export default AdminRoutes;
