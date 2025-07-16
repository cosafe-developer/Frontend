import React, { useState, useEffect } from 'react';
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';
import { ApiLoginAdmin, checkAdminSession } from '../../api/admin/login';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Verifica si ya hay una sesión activa
  useEffect(() => {
    const verifySession = async () => {
      const session = await checkAdminSession();
      if (session && session.role === 'admin') {
        navigate('/admin');
      }
    };

    verifySession();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await ApiLoginAdmin(email, password);
      console.log('Login exitoso:', data);
      navigate('/admin');
    } catch (err) {
      setError(err.mensaje || 'Error en login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0E0F11] flex flex-col items-center justify-center px-4 space-y-6">
      <div className="text-center">
        <img src="/images/Logo.png" alt="Logo" className="mx-auto w-16 h-16 mb-2" />
        <h2 className="text-white text-2xl font-semibold">Bienvenido</h2>
        <p className="text-gray-400 text-sm">Inicia sesión para continuar</p>
      </div>

      <div className="bg-[#0E0F11] border border-gray-700 p-6 rounded-lg w-full max-w-sm">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-white mb-1">Correo Electrónico</label>
            <div className="flex items-center border border-gray-600 rounded-md px-3 py-2">
              <HiOutlineMail className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="email"
                placeholder="Correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent w-full text-white outline-none placeholder-gray-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-white mb-1">Contraseña</label>
            <div className="flex items-center border border-gray-600 rounded-md px-3 py-2">
              <HiOutlineLockClosed className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent w-full text-white outline-none placeholder-gray-500"
                required
              />
            </div>
          </div>

          <div className="flex items-center text-sm text-white">
            <input id="remember" type="checkbox" className="mr-2 accent-blue-600" />
            <label htmlFor="remember">Recordarme</label>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition text-sm disabled:opacity-50"
          >
            {loading ? 'Cargando...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </main>
  );
};

export default AdminLogin;

