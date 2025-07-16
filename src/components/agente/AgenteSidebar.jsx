import { NavLink } from "react-router-dom";
import DashboardIcon from "../../assets/dashboard";
import SettingsIcon from "../../assets/SettingsIcon";

const AgenteSidebar = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <aside
      className={`fixed md:static inset-y-0 left-0 z-50 flex h-screen bg-[#0E0F11] text-white transition-transform duration-300 ease-in-out border-r border-[#1f2028] ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      {/* Columna izquierda: íconos */}
      <div className="w-16 flex flex-col items-center pt-8 py-4 border-r border-[#1f2028]">
        <div className="flex flex-col items-center gap-6 w-full">
          <img
            src="/images/Logo.png"
            alt="Logo"
            className="mx-auto w-8 h-8 mb-2"
          />
          <NavLink
            to="/agent/listados"
            className="w-10 h-10 flex items-center justify-center rounded-md bg-blue-400/20 text-blue-400"
          >
            <DashboardIcon className="w-6 h-6" />
          </NavLink>
        </div>

        <div className="flex-1" />

        {/* Íconos inferiores */}
        <div className="flex flex-col items-center gap-4">
          <button className="w-9 h-9 flex items-center justify-center bg-[#1c1f2e] rounded-full hover:bg-[#2a2d3f]">
            <div className="w-9 h-9 flex items-center justify-center rounded-full">
              <SettingsIcon className="w-6 h-6" />
            </div>
          </button>
          <div className="w-9 h-9 flex items-center justify-center bg-[#2a2d3f] rounded-full text-xs font-semibold">
            AG
          </div>
        </div>
      </div>

      {/* Columna derecha: textos */}
      <div className="w-56 pt-8 bg-[#0E0F11]">
        <h2 className="text-lg text-white px-6 mb-6">Secciones</h2>
        <nav className="flex flex-col space-y-1">
          <NavLink
            to="/agent/listados"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md text-sm ${
                isActive ? "text-blue-400" : "text-gray-300 hover:text-blue-400"
              }`
            }
          >
            Listado de Requerimientos
          </NavLink>
          <NavLink
            to="/agent/perfil"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md text-sm ${
                isActive ? "text-blue-400" : "text-gray-300 hover:text-blue-400"
              }`
            }
          >
            Perfil
          </NavLink>
        </nav>
      </div>

      {/* Botón para cerrar en móvil */}
      <button
        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#2a2d3f] flex items-center justify-center md:hidden"
        onClick={toggleSidebar}
      >
        ✕
      </button>
    </aside>
  );
};

export default AgenteSidebar;
