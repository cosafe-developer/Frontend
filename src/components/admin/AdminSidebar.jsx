import { NavLink } from "react-router-dom";
import DashboardIcon from "../../assets/dashboard";
import SettingsIcon from "../../assets/SettingsIcon";

const AdminSidebar = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <>
      {/* Overlay solo visible en móvil cuando está abierto */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 flex h-screen w-[18rem] bg-[#0E0F11] text-white transition-transform duration-300 ease-in-out border-r border-[#1f2028] 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Columna de íconos */}
        <div className="w-20 flex flex-col justify-between items-center py-8 border-r border-[#1f2028]">
          {/* Parte superior: logo + navegación */}
          <div className="flex flex-col items-center">
            <img src="/images/Logo.png" alt="Logo" className="w-8 h-8 mb-6" />
            <NavLink
              to="/admin/dashboard"
              end
              className="w-10 h-10 flex items-center justify-center rounded-md bg-blue-400/20 text-blue-400 mb-4"
            >
              <DashboardIcon className="w-6 h-6" />
            </NavLink>
          </div>

          {/* Parte inferior: engrane + letra A */}
          <div className="flex flex-col items-center">
            <button className="w-9 h-9 flex items-center justify-center bg-[#1c1f2e] rounded-full hover:bg-[#2a2d3f] mb-4">
              <SettingsIcon className="w-6 h-6" />
            </button>
            <div className="w-9 h-9 flex items-center justify-center bg-[#2a2d3f] rounded-full text-xs font-semibold">
              A
            </div>
          </div>
        </div>

        {/* Columna de texto */}
        <div className="flex-1 pt-8 px-6 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-6">Secciones</h2>
          <nav className="flex flex-col space-y-2">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `block px-2 py-2 rounded-md text-sm ${
                  isActive ? "text-blue-400 font-medium" : "text-gray-300 hover:text-blue-400"
                }`
              }
            >
              Lista Requerimientos
            </NavLink>
            <NavLink
              to="/admin/agentes"
              className={({ isActive }) =>
                `block px-2 py-2 rounded-md text-sm ${
                  isActive ? "text-blue-400 font-medium" : "text-gray-300 hover:text-blue-400"
                }`
              }
            >
              Agentes
            </NavLink>
            <NavLink
              to="/admin/empresas"
              className={({ isActive }) =>
                `block px-2 py-2 rounded-md text-sm ${
                  isActive ? "text-blue-400 font-medium" : "text-gray-300 hover:text-blue-400"
                }`
              }
            >
              Empresas
            </NavLink>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
