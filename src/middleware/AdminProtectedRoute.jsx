import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAdminSession } from '../api/admin/login';
import LoadingScreen from "../components/ui/LoadingScreen";


const AdminProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifySession = async () => {
      try {
        const session = await checkAdminSession();
        if (!session || session.role !== 'admin') {
          navigate('/admin/login');
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error al verificar la sesión del admin:', error);
        navigate('/admin/login');
      }
    };

    verifySession();
  }, [navigate]);

if (loading) return <LoadingScreen />;

  return children;
};

export default AdminProtectedRoute;
