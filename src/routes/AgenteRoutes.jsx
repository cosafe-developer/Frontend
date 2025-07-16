import { Routes, Route } from 'react-router-dom';
import AgentLogin from '../pages/auth/AgenteLogin';
import AgenteLayout from '../layouts/AgenteLayout';
import AgentProtectedRoute from '../middleware/AgenteProtectedRoute';
import AgenteListados from '../pages/agente/Listados';

const AgenteRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<AgentLogin />} />
      <Route
        path=""
        element={
          <AgentProtectedRoute>
            <AgenteLayout />
          </AgentProtectedRoute>
        }
      >
        <Route index element={<AgenteListados />} />
        {/* Más rutas de agente aquí */}
      </Route>
    </Routes>
  );
};

export default AgenteRoutes;
