import { useState, useEffect } from "react";
import { Page } from "components/shared/Page";


/* import ListadoCards from "app/pages/admin/listado/header/ListadoCards"; */
import ListadoHeader from "app/pages/admin/listado/header/ListadoHeader";
import LoadingContent from "components/template/LoadingContent";
import ListadoTabla from "./table";
import serverStatesFetching from "types/fetch/serverStatesFetching.type";
import LoadingErrorComponent from "components/custom-ui/loadings/LoadingError.component";
import getListados from "api/listados/getListados";
import { useCallback } from "react";

const Listado = () => {
  const [listados, setListados] = useState(null);
  const [estado, setEstado] = useState(serverStatesFetching.fetching);

  const fetchData = useCallback(
    async () => {
      setEstado(serverStatesFetching.fetching);


      const response = await getListados();
      if (response?.ok === true) {
        let nuevos = response?.data?.listadoss ?? [];


        setListados(nuevos);
        setEstado(serverStatesFetching.success);
      } else {
        setEstado(serverStatesFetching.error);
      }
    },
    []
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  console.log(listados);


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

        <ListadoTabla />
      </div>
    </Page>
  );
}

export default Listado;