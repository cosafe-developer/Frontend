import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Page } from "components/shared/Page";
import { calculateProgressGeneralListado } from "./helpers/calculateProgressGeneralListado";

/* import ListadoCards from "app/pages/admin/listado/header/ListadoCards"; */
import ListadoHeader from "app/pages/admin/listado/header/ListadoHeader";
import LoadingContent from "components/template/LoadingContent";
import ListadoTabla from "./table";
import serverStatesFetching from "types/fetch/serverStatesFetching.type";
import LoadingErrorComponent from "components/custom-ui/loadings/LoadingError.component";
import getListados from "api/listados/getListados";

const Listado = () => {
  const navigate = useNavigate();
  const [listados, setListados] = useState(null);
  const [estado, setEstado] = useState(serverStatesFetching.fetching);

  const fetchData = useCallback(async () => {
    setEstado(serverStatesFetching.fetching);
    const response = await getListados();

    if (response?.ok === true) {
      let listadosData = response?.data?.listados ?? [];

      const listadosConProgreso = listadosData.map((listado) => {
        // Mismo cálculo que se guarda en progressPercentage al guardar cada
        // paso; si el listado no trae studyData se usa el valor guardado.
        const studyData = listado?.studyData;
        const { globalPercent, totalGlobal, completadosGlobal, progressSections } =
          calculateProgressGeneralListado(studyData ?? {});
        const stored = Number(listado?.progressPercentage);

        return {
          ...listado,
          progressPercentage: studyData
            ? Math.round(globalPercent)
            : Number.isFinite(stored) ? Math.round(stored) : 0,
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
      <div className="flex-1 min-w-0 py-6 px-(--margin-x) lg:px-16">
        <div>
          <ListadoHeader
            onClick={() => navigate("/admin/listado/crear")}
          />
          {/*   <ListadoCards stats={data?.stats} /> */}

        </div>

        <ListadoTabla listados={listados} />
      </div>
    </Page>
  );
}

export default Listado;