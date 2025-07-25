// Import Dependencies
import PropTypes from "prop-types";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";

// Local Imports
import { Button, Input } from "components/ui";
import { useFuse } from "hooks";
import { ContentAsignarAgente } from "./ContentAsignarAgente";
import { useRightSidebarContext } from "app/contexts/sidebar-right/context";

// ----------------------------------------------------------------------

const agentesData = [
  { name: "Carlos Alberto Mendoza López" },
  { name: "Lucía Ramírez Gómez" },
  { name: "José Fernández Martínez Ortega" },
  { name: "Andrea Torres" },
  { name: "Pedro Luis Sánchez Rivera" },
  { name: "Valeria Morales Jiménez" },
  { name: "Luis García López Ramírez" },
  { name: "Fernanda López Díaz" },
  { name: "Javier Castro Hernández" },
  { name: "Sofía Herrera Martínez González" },
  { name: "Carlos Alberto Mendoza López" },
  { name: "Lucía Ramírez Gómez" },
  { name: "José Fernández Martínez Ortega" },
  { name: "Andrea Torres" },
  { name: "Pedro Luis Sánchez Rivera" },
  { name: "Valeria Morales Jiménez" },
  { name: "Luis García López Ramírez" },
  { name: "Fernanda López Díaz" },
  { name: "Javier Castro Hernández" },
  { name: "Sofía Herrera Martínez González" },
];

export function HeaderAsignarAgente({ close }) {
  const searchRef = useRef(null);
  const { data } = useRightSidebarContext();
  const { agentesAsignados, setAgentesAsignados } = data || {};

  const { /* result,  */query, setQuery } = useFuse(agentesData, {
    keys: ["name"],
    threshold: 0.2,
    matchAllOnEmptyQuery: true,
  });

  useEffect(() => {
    invariant(searchRef.current, "searchRef is not assigned");
    searchRef.current.focus();
  }, []);

  return (
    <div className="px-4 py-2">
      <div className="flex items-center justify-end">
        <Button
          onClick={close}
          variant="flat"
          isIcon
          className="size-10 rounded-full"
        >
          <XMarkIcon className="size-8" />
        </Button>
      </div>

      <div className="px-3 text-lg font-semibold w-full">
        <h2 className="text-white font-normal text-xl">Asignar agente</h2>
        <p className="mt-2 text-base font-light">Listado de Agentes</p>

        <div className="items-center mt-14 w-full font-normal">
          <Input
            ref={searchRef}
            placeholder="Buscar agente"
            value={query}
            data-search-item
            onChange={(event) => setQuery(event.target.value)}
            classNames={{ root: "flex-1" }}
            prefix={<MagnifyingGlassIcon className="size-5" />}
          />
        </div>
      </div>

      <div className="text-lg mt-10">
        <ContentAsignarAgente
          close={close}
          data={agentesData}
          agentesAsignados={agentesAsignados}
          setAgentesAsignados={setAgentesAsignados}
        />
      </div>
    </div>
  );
}

HeaderAsignarAgente.propTypes = {
  close: PropTypes.func,
};
