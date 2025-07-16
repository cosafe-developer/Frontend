// src/components/admin/Navbar.jsx
import { HiViewGrid } from "react-icons/hi";
import NotificationIcon  from "../../assets/NotificationIcon";

const AdminNavbar = () => {
  return (
    <div className="flex-1 flex items-center justify-end p-4">
      <span className="text-sm text-gray-300 mr-4">Bienvenido, Admin</span>
      
      {/* Ícono de apps/configuración */}
      <button className="relative p-2 rounded-full hover:bg-[#1a1d2c] mr-4">
        <HiViewGrid className="w-6 h-6 text-gray-400" />
      </button>
      
      {/* Ícono de notificaciones con indicador */}
      <button className="relative p-2 rounded-full hover:bg-[#1a1d2c]">
      <NotificationIcon className="w-6 h-6 text-gray-500" />
      {/* Indicador de notificación */}
        <span className="absolute top-1 right-1 w-3 h-3 bg-orange-500 rounded-full"></span>
      </button>
    </div>
  );
};

export default AdminNavbar;