// Import Dependencies
import PropTypes from "prop-types";
import { XMarkIcon } from "@heroicons/react/24/outline";

// Local Imports
import { Avatar, Badge, Button } from "components/ui";

// ----------------------------------------------------------------------

export function HeaderAdministrarAgente({ close }) {

  return (
    <div className="px-4 py-2">
      <div className="flex items-center justify-end ">
        <Button
          onClick={close}
          variant="flat"
          isIcon
          className="size-10 rounded-full"
        >
          <XMarkIcon className="size-8" />
        </Button>
      </div>

      <div className="flex justify-between items-start mt-10">
        <div className="px-3 text-lg font-semibold ">
          <div className="flex space-x-3">
            <h2>Creado por: </h2>
            <Badge
              className="rounded-full capitalize px-4 text-sm py-2"
              color="success"
              variant="soft"
            >
              Administrador
            </Badge>
          </div>

          <div >
            <div className="flex items-center space-x-5 mt-16">
              <Avatar
                size={18}
                classNames={{
                  display: "mask is-squircle rounded-none text-2xl",
                }}
              >
                HT
              </Avatar>

              <div className="flex flex-col space-y-1 ">
                <p className="font-normal text-xl text-white">Hernán Trejo Gonzales</p>

                <p className="font-light ">Agente de estudio PIPC</p>
              </div>
            </div>
          </div>

        </div>

        <div className="px-3 text-lg font-semibold flex flex-col items-end text-right">
          <div>
            <h2>Fecha de Inicio:</h2>
            <div className="mt-1">
              <p className="font-normal text-lg">01 Mar 2025</p>
              <p className="font-light text-base text-[#7d808d]">04:09 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

HeaderAdministrarAgente.propTypes = {
  close: PropTypes.func,
};
