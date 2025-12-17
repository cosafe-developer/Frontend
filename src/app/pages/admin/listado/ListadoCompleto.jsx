import getEmpresaById from "api/empresa/getEmpresaById";
import getListadoById from "api/listados/getListadoById";
import { useToastContext } from "app/contexts/toast-provider/context";
import LoadingErrorComponent from "components/custom-ui/loadings/LoadingError.component";
import { Page } from "components/shared/Page";
import LoadingContent from "components/template/LoadingContent";
import { Avatar, Button, Card } from "components/ui";
import { useCallback, useEffect, useState } from "react";
import { FiCheck } from "react-icons/fi";
import { useParams } from "react-router";
import serverStatesFetching from "types/fetch/serverStatesFetching.type";
import { calculateProgressGeneralListado } from "./helpers/calculateProgressGeneralListado";
import { estudioSteps } from "./form-llenar-listado/steps-datos-estudio/estudio-pipc/EstudioSteps";

const ListadoCompleto = () => {

  const [listado, setListado] = useState(null);
  const [empresa, setEmpresa] = useState(null);
  const [estado, setEstado] = useState(serverStatesFetching.fetching);
  const { showToast } = useToastContext();
  const { listado_id } = useParams();

  const fetchData = useCallback(async () => {
    setEstado(serverStatesFetching.fetching);

    const response = await getListadoById({ requestBody: { listado_id } });
    if (!response?.ok) {
      setEstado(serverStatesFetching.error);
      showToast({ message: "Error al obtener el listado", type: "error" });
      return;
    }

    const listadoData = response?.data;

    const studyData = listadoData?.studyData ?? {};
    const { globalPercent, totalGlobal, completadosGlobal, progressSections } =
      calculateProgressGeneralListado(studyData, true);


    const listadoConProgreso = {
      ...listadoData,
      progressPercentage: Math.round(globalPercent),
      progressSections,
      progressMeta: { totalItems: totalGlobal, completedItems: completadosGlobal },
    };


    if (listadoData?.companyId?._id) {
      const responseEmpresa = await getEmpresaById({ requestBody: { empresa_id: listadoData?.companyId?._id } });
      if (!responseEmpresa?.ok) {
        setEstado(serverStatesFetching.error);
        showToast({ message: "Error al obtener la empresa", type: "error" });
        return;
      }
      setEmpresa(responseEmpresa?.data?.empresa);
    }

    setListado(listadoConProgreso);
    setEstado(serverStatesFetching.success);
  }, [listado_id, showToast]);


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

  const taskScores = Object.entries(listado?.progressSections).map(([key, value]) => {
    const labelObj = estudioSteps.find((estudio) => estudio.key === key);
    return {
      key: key,
      label: labelObj ? labelObj.label : key,
      progress: Math.round(value)
    };
  });

  return (
    <Page title="Listado Detalle">
      <div className="transition-content w-full px-(--margin-x) pt-5 lg:pt-6">
        <h2 className="text-white text-2xl">Listado Detalle</h2>

        <div className="mt-8 flex gap-8">

          <div className="w-full">
            <Card className="flex flex-col p-5 pt-10 ">
              <div className="px-3 text-lg font-semibold">
                <div className="flex items-center space-x-10">
                  <Avatar
                    size={30}
                    name={empresa?.tradeName}
                    classNames={{
                      display: "mask is-squircle rounded-none text-2xl",
                    }}
                  />
                  <div className="flex flex-col space-y-1">
                    <p className="font-normal text-xl text-white">{empresa?.tradeName}</p>
                    <p className="font-light text-primary-400">{listado?.studyId?.studyName}</p>
                    {/*  <p className="font-light text-green-400">• Completado 08.03.25</p> */}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3 px-3 pt-4">
                <Button
                  onClick={close}
                  color="success"
                  className="h-10 text-base font-light"
                >
                  Aprobar
                </Button>

                <Button
                  color="primary"
                  className="h-10 text-base font-light"
                  disabled
                >
                  Descargar Plantilla
                </Button>
              </div>
            </Card>
          </div>


          <div className="w-[35%]">
            <h1 className="text-lg text-white mb-[2rem]">Total de procesos completados</h1>
            <ol className="steps is-vertical" style={{ borderColor: '#2a2c32' }}>
              {taskScores.map((step, index) => (
                <li
                  className="step pb-6 before:bg-gray-200 dark:before:bg-surface-2"
                  key={index}
                >
                  <div
                    style={{
                      border: `2px solid ${step.progress === 100 ? "#3cb030" : "#757575"}`,
                    }}
                    className="step-header rounded-full bg-gray-200 text-gray-800 dark:bg-surface-2 dark:text-white"
                  >
                    {step.progress === 100 ? <FiCheck className="text-green-500" /> : index + 1}
                  </div>
                  <h3 className="text-gray-600 text-[15px] ltr:ml-4 rtl:mr-4 dark:text-dark-100">
                    {step?.label}: <span className="text-blue-400">{step?.progress} %</span>
                  </h3>
                </li>
              ))}
            </ol>
          </div>

        </div>
      </div>
    </Page>
  );
}

export default ListadoCompleto;