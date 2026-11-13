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
import { LabelHelp } from "components/shared/HelpTip";
import { HELP } from "./helpers/helpTexts";
import { ChangeHistory } from "./components/ChangeHistory";
import { changeLogFromResponse } from "helpers/changeLog";
import { useBreakpointsContext } from "app/contexts/breakpoint/context";

const ListadoCompleto = () => {

  const [listado, setListado] = useState(null);
  const [empresa, setEmpresa] = useState(null);
  const [estado, setEstado] = useState(serverStatesFetching.fetching);
  const [approving, setApproving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const { smAndUp } = useBreakpointsContext();
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
      calculateProgressGeneralListado(studyData);


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

  // Tras aprobar/reabrir: vuelve a leer sólo el historial (sin pantalla de carga)
  const refreshChangeLog = useCallback(async () => {
    try {
      const response = await getListadoById({ requestBody: { listado_id } });
      const changeLog = changeLogFromResponse(response);
      if (changeLog) setListado((prev) => (prev ? { ...prev, changeLog } : prev));
    } catch (err) {
      console.warn("No se pudo actualizar el historial de cambios:", err);
    }
  }, [listado_id]);

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
        <h2 className="text-xl text-white sm:text-2xl">Listado Detalle</h2>

        <div className="mt-6 flex flex-col gap-6 lg:mt-8 lg:flex-row lg:gap-8">

          <div className="w-full min-w-0">
            <Card className="flex flex-col p-4 pt-6 sm:p-5 sm:pt-10">
              <div className="text-lg font-semibold sm:px-3">
                <div className="flex items-center gap-4 sm:gap-10">
                  <Avatar
                    size={smAndUp ? 30 : 16}
                    name={empresa?.tradeName}
                    classNames={{
                      display: "mask is-squircle rounded-none text-2xl",
                    }}
                  />
                  <div className="flex min-w-0 flex-col space-y-1">
                    <p className="break-words font-normal text-lg text-white sm:text-xl">{empresa?.tradeName}</p>
                    <p className="font-light text-primary-400">{listado?.studyId?.studyName}</p>
                    {/*  <p className="font-light text-green-400">• Completado 08.03.25</p> */}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap justify-end gap-3 pt-4 sm:px-3">
                <Button
                  disabled={downloading}
                  onClick={async () => {
                    setDownloading(true);
                    try {
                      await downloadDocument(listado?._id, empresa?.tradeName);
                    } catch (err) {
                      showToast({ message: err.message || "Error al generar documento", type: "error" });
                    } finally {
                      setDownloading(false);
                    }
                  }}
                  color="info"
                  className="h-10 whitespace-nowrap text-base font-light max-sm:flex-1"
                  title={HELP.detail.download}
                >
                  <ArrowDownTrayIcon className="size-5 mr-1.5" />
                  {downloading ? "Generando..." : "Descargar PIPC"}
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
                      refreshChangeLog();
                    } catch (err) {
                      showToast({ message: err.message || "Error al aprobar", type: "error" });
                    } finally {
                      setApproving(false);
                    }
                  }}
                  color="success"
                  className="h-10 whitespace-nowrap text-base font-light max-sm:flex-1"
                  title={listado?.isApproved ? HELP.detail.approved : HELP.detail.approve}
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
                        refreshChangeLog();
                      } catch (err) {
                        showToast({ message: err.message || "Error al reabrir", type: "error" });
                      } finally {
                        setBusy(false);
                      }
                    }}
                    color="warning"
                    className="h-10 whitespace-nowrap text-base font-light max-sm:flex-1"
                    title={HELP.detail.reopen}
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
                      className="h-10 whitespace-nowrap text-base font-light max-sm:flex-1"
                      title={HELP.detail.confirmDelete}
                    >
                      Confirmar eliminación
                    </Button>
                    <Button
                      type="button"
                      disabled={busy}
                      onClick={() => setConfirmDelete(false)}
                      className="h-10 whitespace-nowrap text-base font-light max-sm:flex-1"
                      title={HELP.detail.cancelDelete}
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
                    className="h-10 whitespace-nowrap text-base font-light max-sm:flex-1"
                    title={HELP.detail.delete}
                  >
                    Eliminar
                  </Button>
                )}
              </div>
            </Card>

            <div className="mt-6">
              <ChangeHistory listado={listado} />
            </div>
          </div>


          <div className="w-full lg:w-[35%] lg:shrink-0">
            <h1 className="mb-6 text-lg text-white lg:mb-[2rem]">
              <LabelHelp label="Total de procesos completados" help={HELP.detail.progress} />
            </h1>
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