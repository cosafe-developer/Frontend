import { useForm, Controller } from "react-hook-form";
import { Page } from "components/shared/Page";
import { Card, Button, Badge/* , Circlebar */ } from "components/ui";
import { Listbox } from "components/shared/form/Listbox";
import { FiFilePlus } from "react-icons/fi";
import { DatePicker } from "components/shared/form/Datepicker";
import { IoPersonOutline } from "react-icons/io5";
import { useRightSidebarContext } from "app/contexts/sidebar-right/context";
import { HeaderAsignarAgente } from "components/template/RightSidebar/asignarAgente/HeaderAsignarAgente";
import { useCallback, useEffect, useState } from "react";
/* import { getColorProgress } from "helpers/getColorProgress.helper"; */
import serverStatesFetching from "types/fetch/serverStatesFetching.type";
import LoadingContent from "components/template/LoadingContent";
import LoadingErrorComponent from "components/custom-ui/loadings/LoadingError.component";
import getEmpresasWithoutPagination from "api/empresa/getEmpresasWithoutPagination";
import getAgentesWithoutPagination from "api/agente/getAgentesWithoutPagination";
import { getCookies } from "utils/getCookies";
import getListEstudios from "api/estudios/getListEstudios";
import { useToastContext } from "app/contexts/toast-provider/context";
import createListado from "api/listados/createListado";
import { useNavigate } from "react-router";




const CrearListado = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      empresa: "",
      estudio: "",
      fechaInicio: null,
      fechaEntrega: null,
    }
  });

  const navigate = useNavigate();
  const [empresas, setEmpresas] = useState([]);
  const [agentes, setAgentes] = useState([]);
  const [estudios, setEstudios] = useState([]);
  const [agentesAsignados, setAgentesAsignados] = useState([]);
  const [estado, setEstado] = useState(serverStatesFetching.fetching);
  const { showToast } = useToastContext();
  const { openSidebar } = useRightSidebarContext();

  const fetchData = useCallback(
    async () => {
      setEstado(serverStatesFetching.fetching);
      const userId = getCookies("user_id");

      const responseEmpresas = await getEmpresasWithoutPagination({ requestBody: { user_id: userId } });
      const responseAgentes = await getAgentesWithoutPagination({ requestBody: { user_id: userId } });
      const responseEstudios = await getListEstudios();

      if (responseEmpresas?.ok === true && responseAgentes?.ok === true && responseEstudios?.ok === true) {
        let empresas = responseEmpresas?.data?.empresas ?? [];
        let agentes = responseAgentes?.data?.agentes ?? [];
        let estudios = responseEstudios?.data ?? [];

        setAgentes(agentes);
        setEmpresas(empresas)
        setEstudios(estudios);
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


  const onSubmit = async (data) => {
    try {
      setEstado(serverStatesFetching.fetching);
      const agentesIds = agentesAsignados.map(a => a._id);

      const payload = {
        companyId: data.empresa || null,
        studyId: data.estudio || null,
        startDate: Array.isArray(data.fechaInicio) && data.fechaInicio.length > 0
          ? new Date(data.fechaInicio[0]).toISOString().split("T")[0]
          : null,
        endDate: Array.isArray(data.fechaEntrega) && data.fechaEntrega.length > 0
          ? new Date(data.fechaEntrega[0]).toISOString().split("T")[0]
          : null,
        agents: agentesIds ?? [],
        priority: "baja",
        progressPercentage: 0,
        status: "pendiente",
      };


      // ejemplo de envío
      const response = await createListado({ requestBody: payload });
      if (response?.ok) {
        setEstado(serverStatesFetching.success);
        showToast({
          message: "Proyecto creado correctamente",
          type: "success",
        });
        navigate("/admin/listado");
      } else {
        setEstado(serverStatesFetching.error);
        showToast({
          message: "Error al crear el proyecto",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error al enviar:", error);
      showToast({
        message: "Error en la comunicación con el servidor",
        type: "error",
      });
    }
  };



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
      <div className="transition-content w-full px-(--margin-x) pt-5 lg:pt-6">
        <div className="flex items-center space-x-2">
          <FiFilePlus size={26} />
          <h1 className="text-white text-2xl">Nuevo Listado de Requerimientos</h1>
        </div>

        <div className="mt-8 flex gap-8">
          <div className="w-full">
            <Card className="flex flex-col p-5 space-y-6">
              <h2 className="text-xl">General</h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Controller
                  name="empresa"
                  control={control}
                  rules={{ required: "Asigna una empresa" }}
                  render={({ field }) => (
                    <Listbox
                      label="Empresa"
                      placeholder="Asigna una empresa..."
                      data={empresas}
                      displayField="tradeName"
                      value={empresas.find((e) => e._id === field.value) || null}
                      onChange={(val) => field.onChange(val?._id)}
                      error={errors?.empresa?.message}
                    />
                  )}
                />

                <Controller
                  name="estudio"
                  control={control}
                  rules={{ required: "Asigna un estudio" }}
                  render={({ field }) => (
                    <Listbox
                      label="Estudio"
                      placeholder="Asigna un estudio..."
                      data={estudios}
                      displayField="studyName"
                      value={estudios.find((e) => e._id === field.value) || null}
                      onChange={(val) => field.onChange(val?._id)}
                      error={errors?.estudio?.message}
                    />
                  )}
                />

                <Controller
                  name="fechaInicio"
                  control={control}
                  rules={{ required: "Selecciona la fecha de inicio" }}
                  render={({ field }) => (
                    <div>
                      <h2 className="mb-2">Fecha de Inicio</h2>
                      <DatePicker
                        {...field}
                        placeholder="Seleccionar Fecha de Inicio..."
                        error={errors?.fechaInicio?.message}
                      />
                    </div>
                  )}
                />

                <Controller
                  name="fechaEntrega"
                  control={control}
                  rules={{ required: "Selecciona la fecha de entrega" }}
                  render={({ field }) => (
                    <div>
                      <h2 className="mb-2">Fecha de Entrega</h2>
                      <DatePicker
                        {...field}
                        placeholder="Seleccionar Fecha de Entrega..."
                        error={errors?.fechaEntrega?.message}
                      />
                    </div>
                  )}
                />

                <div>
                  <h2 className="mb-4">Asignar Agentes</h2>
                  <div className="flex items-center gap-4 flex-wrap">
                    <Button
                      onClick={() => {
                        openSidebar({
                          header: HeaderAsignarAgente,
                          data: {
                            agentes,
                            setAgentesAsignados,
                            agentesAsignados
                          },
                        });
                      }}
                      variant="outlined"
                      className="flex items-center gap-1 font-light min-w-[120px] justify-center"
                    >
                      <IoPersonOutline size={16} />
                      Nuevo
                    </Button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {agentesAsignados.map((agente) => (
                        <div key={agente?._id} className="flex items-center">
                          <Badge
                            className="rounded-full capitalize px-4 text-sm py-3 border border-gray-500/60 w-full flex justify-between items-center"
                            color="success"
                            variant="soft"
                          >
                            {`${agente?.firstName}  ${agente?.lastName ?? ""}`}
                            <button
                              onClick={() =>
                                setAgentesAsignados((prev) =>
                                  prev.filter((a) => a._id !== agente._id)
                                )
                              }
                              className="text-xs text-red-400 hover:text-red-600 hover:cursor-pointer pl-2"
                            >
                              ✕
                            </button>
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>


                <div className="flex justify-end space-x-5">
                  <Button type="submit">
                    Cancelar
                  </Button>

                  <Button
                    type="submit"
                    color="primary"
                  >
                    Guardar
                  </Button>
                </div>
              </form>
            </Card>

            {/*    <Card className="flex flex-col p-5 space-y-6 mt-10 mb-[3rem]">
              <div className="flex items-center space-x-2">
                <Circlebar
                  size={13}
                  strokeWidth={9}
                  value={100}
                  color={getColorProgress(100)}
                >
                  <div className="text-tiny-plus font-semibold text-gray-800 dark:text-dark-100">
                    {100}%
                  </div>
                </Circlebar>
                <div className="space-y-1">
                  <h2 className="text-white">Oxxo</h2>
                  <p>Datos Generales | <span className="font-light text-green-400">• Completado 08.03.25</span></p>
                </div>

              </div>

            </Card> */}
          </div>
        </div>
      </div>
    </Page>
  );
};

export default CrearListado;