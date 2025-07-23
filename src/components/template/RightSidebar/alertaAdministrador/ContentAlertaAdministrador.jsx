// Import Dependencies
import PropTypes from "prop-types";
import { XMarkIcon } from "@heroicons/react/24/outline";

// Local Imports
import { Button } from "components/ui";


export function ContentAlertaAdministrador({ close }) {

  return (
    <div >
      <div className="flex items-center justify-between bg-[#15161a] px-4  py-3">
        <h2 className="font-normal text-xl px-4 text-white">Alerta de Administrador</h2>
        <Button onClick={close} variant="flat" isIcon className="size-10 rounded-full">
          <XMarkIcon className="size-8" />
        </Button>
      </div>

      <div className="mt-5 px-4">
        <h2 className="text-2xl">El listado de Oxxo debe ser llenado para el 15 de marzo</h2>
        <p className="mt-8 text-lg">!OJO! Tienes algunas tareas en tu listado que estan por vencer o ya pasaron de su fecha limite</p>
      </div>
    </div>
  );
}

ContentAlertaAdministrador.propTypes = {
  close: PropTypes.func,
};
