import { Button } from "components/ui";
import { PlusIcon } from "@heroicons/react/20/solid";

const ListadoHeader = ({
  titulo = "Titulo",
  textoBoton = "Texto Botón",
  onClick = () => alert("ingresa tu onClick Function"),
}) => {
  return (
    <div className="flex items-center justify-between space-x-4" >
      <div className="min-w-0">
        <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
          {titulo}
        </h2>
      </div>
      <Button
        color="primary"
        onClick={onClick}
        className="h-8 space-x-1.5 rounded-md px-3 text-xs "
      >
        <PlusIcon className="size-5" />
        <span>{textoBoton}</span>
      </Button>
    </div >
  )
}

export default ListadoHeader;