import { useForm, Controller } from "react-hook-form";
import { Page } from "components/shared/Page";
import { Card, Button, Badge } from "components/ui";
import { Listbox } from "components/shared/form/Listbox";
import { FiFilePlus } from "react-icons/fi";
import { DatePicker } from "components/shared/form/Datepicker";
import { IoPersonOutline } from "react-icons/io5";
import { useRightSidebarContext } from "app/contexts/sidebar-right/context";
import { HeaderAsignarAgente } from "components/template/RightSidebar/asignarAgente/HeaderAsignarAgente";
import { useState } from "react";


const empresas = [
  { id: "1", label: "Empresa A" },
  { id: "2", label: "Empresa B" },
];

const estudios = [
  { id: "1", label: "Estudio X" },
  { id: "2", label: "Estudio Y" },
];

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


  const { openSidebar } = useRightSidebarContext();
  const [agentesAsignados, setAgentesAsignados] = useState([]);

  const onSubmit = (data) => {
    console.log("Formulario enviado:", data);
  };


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
                      displayField="label"
                      value={empresas.find((e) => e.id === field.value) || null}
                      onChange={(val) => field.onChange(val?.id)}
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
                      displayField="label"
                      value={estudios.find((e) => e.id === field.value) || null}
                      onChange={(val) => field.onChange(val?.id)}
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
                  <Button
                    onClick={() => {
                      openSidebar({
                        header: HeaderAsignarAgente,
                        data: {
                          agentesAsignados,
                          setAgentesAsignados,
                        },
                      });
                    }}
                    variant="outlined"
                    className="flex items-center gap-1 font-light"
                  >
                    <IoPersonOutline size={16} />
                    Nuevo
                  </Button>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {agentesAsignados.map((agente) => (
                      <div key={agente.name} className="flex items-center gap-1">
                        <Badge
                          className="rounded-full capitalize px-4 text-sm py-2"
                          color="success"
                          variant="soft"
                        >
                          {agente.name}
                        </Badge>
                        <button
                          onClick={() =>
                            setAgentesAsignados((prev) =>
                              prev.filter((a) => a.name !== agente.name)
                            )
                          }
                          className="text-xs text-red-400 hover:text-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                </div>

                <div className="flex justify-end space-x-5">
                  <Button type="submit">
                    Cancelar
                  </Button>

                  <Button
                    type="submit"
                    color="primary"
                    disabled
                  >
                    Guardar
                  </Button>
                </div>


              </form>
            </Card>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default CrearListado;
