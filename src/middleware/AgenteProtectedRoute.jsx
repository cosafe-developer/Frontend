import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAgenteSession } from '../api/agente/login';
import LoadingScreen from "../components/ui/LoadingScreen";


const AgenteProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifySession = async () => {
      try {
        const session = await checkAgenteSession();
        if (!session || session.role !== 'agente') {
          navigate('/agente/login');
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error al verificar la sesión del agente:', error);
        navigate('/agente/login');
      }
    };

    verifySession();
  }, [navigate]);

if (loading) return <LoadingScreen />;

  return children;
};

export default AgenteProtectedRoute;
