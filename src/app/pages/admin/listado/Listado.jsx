import { useState, useEffect } from "react";
import { Page } from "components/shared/Page";
import ListadoCards from "components/listado/ListadoCards";
import ListadoTabla from "./table";
import ListadoHeader from "components/listado/ListadoHeader";
import LoadingContent from "components/template/LoadingContent";
import { Navigate } from "react-router";

// import OrdersDatatableV2 from "./orders-datatable-2";

const dataMock = {
  header: {
    titulo: "Listado de Requerimientos",
    textoBoton: "Nuevo Listado",
  },
  stats: {
    listados_activos: 7,
    agentes_asignados: 14,
    empresas_listados_activos: 5,
    empresas_listados_pendientes: 2,
  }
}

const Listado = () => {
  const endPointListado = "/admin/get/listado/";
  const [isFetching, setIsFetching] = useState(true);
  const [data, setData] = useState(null);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      /*  console.log(endpoint); */
      // SIMULACIÓN DE FETCH
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setData(dataMock);
      setIsFetching(false);
    };

    if (isFetching) {
      fetchData({ endpoint: endPointListado });
    }
  }, [isFetching]);

  if (isFetching) {
    return <LoadingContent />
  }

  if (redirect) {
    return <Navigate to="/admin/listado/crear" replace />;
  }

  return (
    <Page title="Listado de Requerimientos">
      <div className="transition-content w-full px-(--margin-x) pt-5 lg:pt-6">
        <div className="transition-content grid grid-cols-1 grid-rows-[auto_auto_1fr] py-4">
          <ListadoHeader
            titulo={data?.header?.titulo}
            textoBoton={data?.header?.textoBoton}
            onClick={() => setRedirect(true)}
          />
          <ListadoCards stats={data?.stats} />
        </div>
        <ListadoTabla />
      </div>
    </Page>
  );
}

export default Listado;