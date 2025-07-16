import { Link } from "react-router-dom";
import { HiPlus } from "react-icons/hi";
import EmpresasTable from "../../components/admin/Tables/EmpresaTables";


const Empresas = () => {
  return (
    <div className="w-full">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-semibold text-[#E6E7EB]">Empresas</h1>

        <Link
          to="/admin/crear-empresa"
          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3 py-1.5 rounded-md transition"
        >
          <HiPlus className="w-4 h-4" />
          Nueva Empresa
        </Link>
      </div>

    
  <EmpresasTable />


    </div>
  );
};

export default Empresas;
