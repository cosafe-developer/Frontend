import { useState, useEffect } from "react";
import { Page } from "components/shared/Page";
import { useCallback } from "react";
import { calculateProgressGeneralListado } from "./helpers/calculateProgressGeneralListado";

/* import ListadoCards from "app/pages/admin/listado/header/ListadoCards"; */
import ListadoHeader from "app/pages/admin/listado/header/ListadoHeader";
import LoadingContent from "components/template/LoadingContent";
import ListadoTabla from "./table";
import serverStatesFetching from "types/fetch/serverStatesFetching.type";
import LoadingErrorComponent from "components/custom-ui/loadings/LoadingError.component";
import getListados from "api/listados/getListados";

const Listado = () => {
  const [listados, setListados] = useState(null);
  const [estado, setEstado] = useState(serverStatesFetching.fetching);

  const fetchData = useCallback(async () => {
    setEstado(serverStatesFetching.fetching);
    const response = await getListados();

    if (response?.ok === true) {
      let listadosData = response?.data?.listados ?? [];

      const listadosConProgreso = listadosData.map((listado) => {
        const studyData = listado?.studyData ?? {};

        const { globalPercent, totalGlobal, completadosGlobal, progressSections } =
          calculateProgressGeneralListado(studyData, true);

        return {
          ...listado,
          progressPercentage: Math.round(globalPercent),
          progressSections,
          progressMeta: { totalItems: totalGlobal, completedItems: completadosGlobal },
        };
      });

      setListados(listadosConProgreso);
      setEstado(serverStatesFetching.success);
    } else {
      setEstado(serverStatesFetching.error);
    }
  }, []);

  useEffect(() => {
    fetchData();
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
    <Page title="Listado de Requerimientos">
      <div className="flex-1 p-6  min-w-0">
        <div className="px-10">
          <ListadoHeader
            onClick={() => window.open("/admin/listado/crear", "_blank")}
          />
          {/*   <ListadoCards stats={data?.stats} /> */}

        </div>

        <ListadoTabla listados={listados} />
      </div>
    </Page>
  );
}

export default Listado;