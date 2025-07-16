import { Routes, Route } from 'react-router-dom';
import EmpresaLogin from '../pages/auth/EmpresaLogin';
import EmpresaLayout from '../layouts/EmpresaLayout';
import EmpresaProtectedRoute from '../middleware/EmpresaProtectedRoute';
import EmpresaListados from '../pages/empresa/Listados'; 

const EmpresaRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<EmpresaLogin />} />
      <Route
        path=""
        element={
          <EmpresaProtectedRoute>
            <EmpresaLayout />
          </EmpresaProtectedRoute>
        }
      >
        <Route index element={<EmpresaListados />} />
        {/* Otras rutas para empresa pueden agregarse aquí */}
      </Route>
    </Routes>
  );
};

export default EmpresaRoutes;
