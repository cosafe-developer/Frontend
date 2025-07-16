import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner'; 
import AdminRoutes from './routes/AdminRoutes';
import AgenteRoutes from './routes/AgenteRoutes';
import EmpresaRoutes from './routes/EmpresaRoutes';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/agente/*" element={<AgenteRoutes />} />
        <Route path="/empresa/*" element={<EmpresaRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
