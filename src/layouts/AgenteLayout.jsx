// layouts/AgentLayout.jsx
import { useState } from "react";
import AgentNavbar from "../components/agente/AgenteNavbar";
import AgentSidebar from "../components/agente/AgenteSidebar";
import { Outlet } from "react-router-dom";
import { HiMenu } from "react-icons/hi";

const AgenteLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen flex bg-[#0E0F11] text-white">
      {/* Sidebar agente */}
      <AgentSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Overlay para cerrar sidebar en móvil */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        <div className="h-16 flex items-center justify-between px-6 bg-[#0E0F11] border-b border-[#2a2d3f] text-white">
          <button className="md:hidden text-gray-300" onClick={toggleSidebar}>
            <HiMenu className="w-6 h-6" />
          </button>
          <AgentNavbar />
        </div>

        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AgenteLayout;
