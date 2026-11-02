import getEmpresaById from "api/empresa/getEmpresaById";
import getListadoById from "api/listados/getListadoById";
import downloadDocument from "api/listados/downloadDocument";
import approveListado from "api/listados/approveListado";
import reopenListado from "api/listados/reopenListado";
import deleteListado from "api/listados/deleteListado";
import { useToastContext } from "app/contexts/toast-provider/context";
import LoadingErrorComponent from "components/custom-ui/loadings/LoadingError.component";
import { Page } from "components/shared/Page";
import LoadingContent from "components/template/LoadingContent";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { Avatar, Button, Card } from "components/ui";
import { useCallback, useEffect, useState } from "react";
import { FiCheck } from "react-icons/fi";
import { useNavigate, useParams } from "react-router";
import serverStatesFetching from "types/fetch/serverStatesFetching.type";
import { calculateProgressGeneralListado } from "./helpers/calculateProgressGeneralListado";
import { estudioSectionLabel } from "./form-llenar-listado/steps-datos-estudio/estudio-pipc/EstudioSteps";

const ListadoCompleto = () => {

  const [listado, setListado] = useState(null);
  const [empresa, setEmpresa] = useState(null);
  const [estado, setEstado] = useState(serverStatesFetching.fetching);
  const [approving, setApproving] = useState(false);
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { showToast } = useToastContext();
  const { listado_id } = useParams();
  const navigate = useNavigate();

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
    return {
      key: key,
      label: estudioSectionLabel(key),
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
                  onClick={async () => {
                    try {
                      await downloadDocument(listado?._id, empresa?.tradeName);
                    } catch (err) {
                      showToast({ message: err.message || "Error al generar documento", type: "error" });
                    }
                  }}
                  color="info"
                  className="h-10 text-base font-light"
                >
                  <ArrowDownTrayIcon className="size-5 mr-1.5" />
                  Descargar PIPC
                </Button>
                <Button
                  type="button"
                  disabled={listado?.isApproved || approving}
                  onClick={async () => {
                    setApproving(true);
                    try {
                      await approveListado(listado?._id);
                      setListado((prev) => ({ ...prev, isApproved: true, status: "completado" }));
                      showToast({ message: "Listado aprobado", type: "success" });
                    } catch (err) {
                      showToast({ message: err.message || "Error al aprobar", type: "error" });
                    } finally {
                      setApproving(false);
                    }
                  }}
                  color="success"
                  className="h-10 text-base font-light"
                >
                  {listado?.isApproved ? "Aprobado" : "Aprobar"}
                </Button>
                {listado?.isApproved && (
                  <Button
                    type="button"
                    disabled={busy}
                    onClick={async () => {
                      setBusy(true);
                      try {
                        await reopenListado(listado?._id);
                        setListado((prev) => ({ ...prev, isApproved: false, status: "pendiente" }));
                        showToast({ message: "Listado reabierto", type: "success" });
                      } catch (err) {
                        showToast({ message: err.message || "Error al reabrir", type: "error" });
                      } finally {
                        setBusy(false);
                      }
                    }}
                    color="warning"
                    className="h-10 text-base font-light"
                  >
                    Reabrir
                  </Button>
                )}
                {/* Eliminar pide confirmación en la misma pantalla (sin diálogo del navegador) */}
                {confirmDelete ? (
                  <>
                    <Button
                      type="button"
                      disabled={busy}
                      onClick={async () => {
                        setBusy(true);
                        try {
                          await deleteListado(listado?._id);
                          showToast({ message: "Listado eliminado", type: "success" });
                          navigate("/admin/listado");
                        } catch (err) {
                          showToast({ message: err.message || "Error al eliminar", type: "error" });
                          setBusy(false);
                          setConfirmDelete(false);
                        }
                      }}
                      color="error"
                      className="h-10 text-base font-light"
                    >
                      Confirmar eliminación
                    </Button>
                    <Button
                      type="button"
                      disabled={busy}
                      onClick={() => setConfirmDelete(false)}
                      className="h-10 text-base font-light"
                    >
                      No eliminar
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    color="error"
                    variant="outlined"
                    className="h-10 text-base font-light"
                  >
                    Eliminar
                  </Button>
                )}
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