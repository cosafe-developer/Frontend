import { Page } from "components/shared/Page";
import EmpresasHeader from "./header/EmpresasHeader";
import EmpresasTabla from "./table";
import LoadingErrorComponent from "components/custom-ui/loadings/LoadingError.component";
import serverStatesFetching from "types/fetch/serverStatesFetching.type";
import LoadingContent from "components/template/LoadingContent";
import { useCallback, useEffect, useState } from "react";
import getEmpresasWithPaginationById from "api/empresa/getEmpresasWithPaginationById";
import { getCookies } from "utils/getCookies";

export default function Empresas() {
  const [empresas, setEmpresas] = useState(null);
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
        paginacion: {
          page: page,
          limit: limit
        },
        user_id: userId
      };


      const response = await getEmpresasWithPaginationById({ requestBody: payload });
      if (response?.ok === true) {
        let nuevos = response?.data?.empresas ?? [];
        const info = response?.data?.paginacion ?? {};

        setEmpresas((prev) => (append ? [...prev, ...nuevos] : nuevos));
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

  console.log(empresas);
  return (
    <Page title="Empresas">
      <div className="flex-1 p-6  min-w-0">
        <EmpresasHeader />
        <EmpresasTabla empresas={empresas} />
      </div>
    </Page>
  );
}
