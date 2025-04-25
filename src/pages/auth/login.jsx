import React from 'react';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const Login = () => {
  return (
    <main className="min-h-screen bg-[#0E0F11] flex flex-col items-center justify-center px-4 space-y-6">
      {/* Logo y título FUERA del cuadro */}
      <div className="text-center">
        <img src="https://i.ibb.co/ymZD4KZQ/Component-1.png" alt="Logo" className="mx-auto w-16 h-16 mb-2" />
        <h2 className="text-white text-2xl font-semibold">Bienvenido</h2>
        <p className="text-gray-400 text-sm">Inicia sesión para continuar</p>
      </div>

      {/* Tarjeta del formulario */}
      <div className="bg-[#0E0F11] border border-gray-700 p-6 rounded-lg w-full max-w-sm">
        <form className="space-y-4">
          {/* Correo electrónico */}
          <div>
            <label className="block text-sm text-white mb-1">Correo Electrónico</label>
            <div className="flex items-center border border-gray-600 rounded-md px-3 py-2">
              <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="email"
                placeholder="Correo"
                className="bg-transparent w-full text-white outline-none placeholder-gray-500"
              />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm text-white mb-1">Contraseña</label>
            <div className="flex items-center border border-gray-600 rounded-md px-3 py-2">
              <LockClosedIcon className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="password"
                placeholder="Contraseña"
                className="bg-transparent w-full text-white outline-none placeholder-gray-500"
              />
            </div>
          </div>

          {/* Recordarme */}
          <div className="flex items-center text-sm text-white">
            <input id="remember" type="checkbox" className="mr-2 accent-blue-600" />
            <label htmlFor="remember">Recordarme</label>
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition text-sm"
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </main>
  );
};

export default Login;
