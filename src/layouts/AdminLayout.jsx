import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/admin/AdminNavbar";
import Sidebar from "../components/admin/AdminSidebar";
import { HiMenu } from "react-icons/hi";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="bg-[#0E0F11] text-white flex min-h-screen overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden md:block w-[18rem] border-r border-[#1f2028]">
        <Sidebar isSidebarOpen={true} toggleSidebar={toggleSidebar} />
      </aside>

      {/* Sidebar móvil */}
      {isSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={toggleSidebar}
          />
          <aside className="fixed z-50 w-[18rem] h-full bg-[#0E0F11] border-r border-[#1f2028] md:hidden">
            <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          </aside>
        </>
      )}

      {/* Contenedor principal */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Navbar */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-[#0E0F11] border-b border-[#2a2d3f]">
          <button className="md:hidden text-gray-300" onClick={toggleSidebar}>
            <HiMenu className="w-6 h-6" />
          </button>
          <Navbar />
        </header>

        {/* Contenido principal */}
        <main  className="h-[90vh] overflow-y-scroll p-8">

          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
