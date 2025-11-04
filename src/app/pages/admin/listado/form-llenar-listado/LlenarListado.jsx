import { Page } from "components/shared/Page";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router";
import { useToastContext } from "app/contexts/toast-provider/context";

import LlenarListadoForm from "./components/LlenarListadoForm";
import serverStatesFetching from "types/fetch/serverStatesFetching.type";
import getListadoById from "api/listados/getListadoById";
import LoadingContent from "components/template/LoadingContent";
import LoadingErrorComponent from "components/custom-ui/loadings/LoadingError.component";
import getEmpresaById from "api/empresa/getEmpresaById";


const LlenarListado = () => {
  const [listado, setListado] = useState(null);
  const [empresa, setEmpresa] = useState(null);
  const [estado, setEstado] = useState(serverStatesFetching.fetching);
  const { showToast } = useToastContext();
  const { listado_id } = useParams();

  const fetchData = useCallback(
    async () => {
      setEstado(serverStatesFetching.fetching);

      const response = await getListadoById({ requestBody: { listado_id } });
      if (!response?.ok) {
        setEstado(serverStatesFetching.error);
        showToast({ message: "Error al obtener el listado", type: "error" });
        return;
      }

      const listadoData = response?.data;

      if (listadoData?.companyId?._id) {
        const responseEmpresa = await getEmpresaById({ requestBody: { empresa_id: listadoData?.companyId?._id } });

        if (!responseEmpresa?.ok) {
          setEstado(serverStatesFetching.error);
          showToast({ message: "Error al obtener la empresa", type: "error" });
          return;
        }

        setEmpresa(responseEmpresa?.data?.empresa);
      }

      setListado(listadoData);
      setEstado(serverStatesFetching.success);
    },
    [listado_id, showToast]
  );

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
    <Page title="Llenar Listado">
      <LlenarListadoForm
        listado={listado}
        empresa={empresa}
      />
    </Page>
  );
}

export default LlenarListado;