import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// Local Imports
import { DatePicker } from "components/shared/form/Datepicker";
import { Button, Input, Upload } from "components/ui";
import { useLlenarListadoFormContext } from "../LlenarListadoFormContext";
import { informacionRiesgoSchema } from "../schema";
import { CloudArrowUpIcon } from "@heroicons/react/24/solid";
import { FileItemSquare } from "components/shared/form/FileItemSquare";

const EmpresaStep2 = ({ setCurrentEmpresaStep }) => {
  const llenarListadoFormCtx = useLlenarListadoFormContext();

  // control del formulario
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(informacionRiesgoSchema),
    defaultValues: llenarListadoFormCtx.state.formData.informacion_de_riesgo,
  });

  const onSubmit = (data) => {
    llenarListadoFormCtx.dispatch({
      type: "SET_FORM_DATA",
      payload: {
        informacion_de_riesgo: data,
      },
    });
    llenarListadoFormCtx.dispatch({
      type: "SET_STEP_STATUS",
      payload: {
        datos_generales: { isDone: true },
        informacion_de_riesgo: { isDone: true },
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
      className="flex grow flex-col"
    >
      <div className="grow space-y-8">
        <div className="flex flex-col gap-y-1.5">
          <label className="input-label">
            <span>Inventario de Recursos Materiales (Ubicación y Condición)</span>
            <span className="ml-2 text-error">*</span>
          </label>
          <Controller
            name="inventario_recursos"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Upload
                onChange={onChange}
                accept="application/pdf"
              >
                {({ ...props }) =>
                  value ? (
                    <FileItemSquare
                      handleRemove={() => onChange(null)}
                      file={value}
                      {...props}
                    />
                  ) : (
                    <Button
                      unstyled
                      className="size-20 shrink-0 space-x-2 rounded-lg border-2 border-current p-0 text-gray-300 hover:text-primary-600 dark:text-dark-450 dark:hover:text-primary-500 "
                      {...props}
                    >
                      <CloudArrowUpIcon className="size-12 stroke-2" />
                    </Button>
                  )
                }
              </Upload>
            )}
          />
          {errors.constancia_fiscal && (
            <span className="input-text-error mt-1 text-xs text-error dark:text-error-lighter">{errors.constancia_fiscal.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              {...register("descripcion_empresa")}
              label="Descripción de la Empresa"
              error={errors?.descripcion_empresa?.message}
              required
              placeholder="Escribir Descripción de la Empresa..."
            />
            <Input
              {...register("tipo_riesgo_interno")}
              label="Tipo de riesgo Interno / Por Entorno (Ordinario / Alto)"
              error={errors?.tipo_riesgo_interno?.message}
              required
              placeholder="Escribir Tipo de Riesgo..."
            />
          </div>
          <Input
            {...register("antecedentes")}
            label="Antecedentes"
            error={errors?.antecedentes?.message}
            required
            placeholder="Escribir Antecedentes..."
          />
        </div>

        {/* falta agregarlo a yulp */}
        <div className="flex flex-col gap-y-2">
          <label className="input-label">
            <span>Calendario de fechas destinadas al subprograma de prevención de riesgos</span>
            <span className="ml-2 text-error">*</span>
          </label>
          <DatePicker
            options={{
              mode: "range",
              dateFormat: "Y-m-d",
            }}
            placeholder="Seleccionar rango de fechas..."
          />
        </div>

        <div>
          <Input
            {...register("riesgos_generales_internos")}
            label="Riesgos Generales Internos"
            error={errors?.riesgos_generales_internos?.message}
            required
            placeholder="Escribir los Riesgos Generales Internos..."
          />
        </div>

      </div>
      <div className="mt-4 flex justify-end space-x-3 pb-4">
        <Button type="submit" className="min-w-[7rem]" onClick={() => {
          setCurrentEmpresaStep(1);
          llenarListadoFormCtx.dispatch({
            type: "SET_STEP_STATUS",
            payload: {
              informacion_de_la_direccion: { isDone: false },
              informacion_de_riesgo: { isDone: false },
            },
          });
        }}>
          Atrás
        </Button>
        <Button type="submit" className="min-w-[7rem]" color="primary">
          Guardar
        </Button>
      </div>
    </form>
  );
};

export default EmpresaStep2;