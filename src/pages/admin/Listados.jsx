// src/pages/admin/Dashboard.jsx

import { 
  HiPlus, 

} from "react-icons/hi";

import StatsCards from "../../components/admin/List/StatsCards";
import EmpresasTable from "../../components/admin/Tables/EmpresaTables";

const AdminListados = () => {

 
  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Listados de Requerimientos</h1>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm">
          <HiPlus className="w-4 h-4" />
          Nuevo Listado
        </button>
      </div>
      <StatsCards />
      <EmpresasTable />
      
    </div>
  );
};

export default AdminListados;