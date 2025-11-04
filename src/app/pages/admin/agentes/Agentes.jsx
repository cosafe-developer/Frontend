import { Page } from "components/shared/Page";
import AgentesHeader from "./header/AgentesHeader";
import AgenteTabla from "./table";
import { useCallback, useEffect, useState } from "react";
import { getCookies } from "utils/getCookies";

import serverStatesFetching from "types/fetch/serverStatesFetching.type";
import getAgentesWithPaginationById from "api/agente/getAgentesWithPaginationById";
import LoadingErrorComponent from "components/custom-ui/loadings/LoadingError.component";
import LoadingContent from "components/template/LoadingContent";
import { cargosAgentes } from "types/global/global";

export default function Agentes() {
  const [agentes, setAgentes] = useState(null);
  const [estado, setEstado] = useState(serverStatesFetching.fetching);

  const [paginacion, setPaginacion] = useState({
    page: 1,
    limit: 30,
    total: 0,
    totalPages: 0,
  });

  const fetchData = useCallback(
    async (page = 1, limit = paginacion.limit, append = false) => {
      setEstado(serverStatesFetching.fetching);

      const userId = getCookies("user_id");
      const payload = {
        paginacion: { page, limit },
        user_id: userId,
      };

      const response = await getAgentesWithPaginationById({ requestBody: payload });
      if (response?.ok === true) {
        let nuevos = response?.data?.agentes ?? [];

        nuevos = nuevos.map((agente) => {
          const cargo = cargosAgentes.find((c) => c.id === agente.position);
          return {
            ...agente,
            positionLabel: cargo ? cargo.label : agente.position,
          };
        });

        const info = response?.data?.paginacion ?? {};
        setAgentes((prev) => (append ? [...prev, ...nuevos] : nuevos));
        setPaginacion(info);
        setEstado(serverStatesFetching.success);
      } else {
        setEstado(serverStatesFetching.error);
      }
    },
    [paginacion.limit]
  );

  useEffect(() => {
    fetchData(1, 30);
  }, [fetchData]);


  if (estado === serverStatesFetching.fetching) {
    return (
      <>
        <LoadingContent />
      </>
    );
  }

  if (estado === serverStatesFetching.error) {
    return <LoadingErrorComponent />;
  }

  return (
    <Page title="Agentes">
      <div className="flex-1 p-6  min-w-0">
        <AgentesHeader />
        <AgenteTabla agentes={agentes} />
      </div>
    </Page>
  );
}
