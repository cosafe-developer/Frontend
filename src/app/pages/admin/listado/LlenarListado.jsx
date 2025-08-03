import { Page } from "components/shared/Page";
import { useState, useEffect } from "react";
import LoadingContent from "components/template/LoadingContent";
import LlenarListadoForm from "./form-llenar-listado";

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

const LlenarListado = () => {
  const endPointListado = "/admin/get/listado/:id";
  const [isFetching, setIsFetching] = useState(true);
  const [data, setData] = useState(null);

  console.log(data);

  useEffect(() => {
    const fetchData = async ({ endpoint }) => {
      console.log(endpoint);
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

  return (
    <Page title="Llenar Listado">
      <LlenarListadoForm />
    </Page>
  );
}

export default LlenarListado;