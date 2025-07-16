import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkEmpresaSession } from '../api/empresa/login';
import LoadingScreen from "../components/ui/LoadingScreen";


const EmpresaProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifySession = async () => {
      try {
        const session = await checkEmpresaSession();
        if (!session || session.role !== 'empresa') {
          navigate('/empresa/login');
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error al verificar la sesión de la empresa:', error);
        navigate('/empresa/login');
      }
    };

    verifySession();
  }, [navigate]);

if (loading) return <LoadingScreen />;

  return children;
};

export default EmpresaProtectedRoute;
