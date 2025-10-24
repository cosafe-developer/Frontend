import { Button } from "components/ui";
import { PlusIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router";

const EmpresasHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between space-x-4  px-10" >
      <div className="min-w-0">
        <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
          Empresas
        </h2>
      </div>
      <Button
        onClick={() => navigate(`/admin/empresas/crear`)}
        color="primary"
        className="h-8 space-x-1.5 rounded-md px-3 text-xs "
      >
        <PlusIcon className="size-5" />
        <span>Nuevo Empresa</span>
      </Button>
    </div >
  )
}

export default EmpresasHeader;