import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// Local Imports
import { Button, Input, Upload } from "components/ui";
import { useLlenarListadoFormContext } from "../LlenarListadoFormContext";
import { informacionDireccionSchema } from "../schema";
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
    resolver: yupResolver(informacionDireccionSchema),
    defaultValues: llenarListadoFormCtx.state.formData.informacion_de_la_direccion,
  });

  const onSubmit = (data) => {
    llenarListadoFormCtx.dispatch({
      type: "SET_FORM_DATA",
      payload: {
        informacion_de_la_direccion: data,
      },
    });
    llenarListadoFormCtx.dispatch({
      type: "SET_STEP_STATUS",
      payload: { informacion_de_la_direccion: { isDone: true } },
    });
    setCurrentEmpresaStep(2);
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
            <span>Constancia Situación Fiscal</span>
            <span className="ml-2 text-error">*</span>
          </label>
          <Controller
            name="constancia_fiscal"
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

        <div>
          <h4 className="text-lg font-medium text-gray-800 dark:text-dark-100">
            Datos de la Empresa
          </h4>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Input
              {...register("actividades_empresa")}
              label="Actividades de la Empresa"
              error={errors?.actividades_empresa?.message}
              required
              placeholder="Escribir Actividades de la Empresa..."
            />
            <Input
              {...register("giro_empresarial")}
              label="Giro Empresarial"
              error={errors?.giro_empresarial?.message}
              required
              placeholder="Escribir Giro Empresarial..."
            />
            <Input
              {...register("responsable_inmueble")}
              label="Nombre del Responsable del Inmueble"
              error={errors?.responsable_inmueble?.message}
              required
              placeholder="Escribir Responsable del Inmnueble..."
            />
            <Input
              {...register("cargo_responsable_inmueble")}
              label="Cargo del Responsable del Inmueble"
              error={errors?.cargo_responsable_inmueble?.message}
              required
              placeholder="Escribir Cargo del Responsable..."
            />
          </div>
        </div>

        <div>
          <h4 className="text-lg font-medium text-gray-800 dark:text-dark-100">
            Datos del Representante Legal
          </h4>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Input
              {...register("nombre_representante")}
              label="Nombe del Representante Legal"
              error={errors?.nombre_representante?.message}
              required
              placeholder="Escribir al Represante del Inmueble..."
            />
            <Input
              {...register("cargo_responsable_inmueble")}
              label="Cargo del Representante Legal"
              error={errors?.cargo_responsable_inmueble?.message}
              required
              placeholder="Escribir el cargo del Represante..."
            />
            <div className="flex flex-col gap-y-1.5">
              <label className="input-label">
                <span>Firma del Representante Legal</span>
                <span className="ml-2 text-error">*</span>
              </label>
              <Controller
                name="firma_representante"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Upload
                    onChange={onChange}
                    accept="image/jpg, image/jpeg, image/png, image/webp"
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
                          className="w-full size-32 shrink-0 flex flex-col space-x-2 rounded-lg border-dashed border-2 border-current p-0 text-gray-300 hover:text-primary-600 dark:text-dark-450 dark:hover:text-primary-500 "
                          {...props}
                        >
                          <CloudArrowUpIcon className="size-12 stroke-2" />
                          <span className="pointer-events-none mt-0 text-gray-600 dark:text-dark-200">
                            <span className="text-primary-600 dark:text-primary-400">
                              Subir
                            </span>
                            <span> o </span>
                            <span className="text-primary-600 dark:text-primary-400">
                              Dibujar
                            </span>
                            <span> firma</span>
                          </span>
                        </Button>
                      )
                    }
                  </Upload>
                )}
              />
              {errors.firma_representante && (
                <span className="input-text-error mt-1 text-xs text-error dark:text-error-lighter">{errors.firma_representante.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-y-1.5">
              <label className="input-label">
                <span>INE del Representante Legal</span>
                <span className="ml-2 text-error">*</span>
              </label>
              <Controller
                name="ine_representante"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Upload
                    onChange={onChange}
                    accept="application/pdf, image/jpg, image/jpeg, image/png, image/webp"
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
                          className="w-full size-32 shrink-0 flex flex-col space-x-2 rounded-lg border-dashed border-2 border-current p-0 text-gray-300 hover:text-primary-600 dark:text-dark-450 dark:hover:text-primary-500 "
                          {...props}
                        >
                          <CloudArrowUpIcon className="size-12 stroke-2" />
                          <span className="pointer-events-none mt-0 text-gray-600 dark:text-dark-200">
                            <span className="text-primary-600 dark:text-primary-400">
                              Subir
                            </span>
                            <span> INE</span>
                          </span>
                        </Button>
                      )
                    }
                  </Upload>
                )}
              />
              {errors.ine_representante && (
                <span className="input-text-error mt-1 text-xs text-error dark:text-error-lighter">{errors.ine_representante.message}</span>
              )}
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-medium text-gray-800 dark:text-dark-100">
            Datos del Domicilio
          </h4>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Input
              {...register("domicilio_fisico")}
              label="Domicilio Físico"
              error={errors?.domicilio_fisico?.message}
              required
              placeholder="Escribir Domicilio Físico..."
            />
            <Input
              {...register("domicilio_notificaciones")}
              label="Domicilio para Oir y Recibir Notificaciones"
              error={errors?.domicilio_notificaciones?.message}
              required
              placeholder="Escribir Domicilio de Notificaciones..."
            />
            <Input
              {...register("superficie_terreno")}
              label="Superficie del Terreno y Superficie Construida"
              error={errors?.superficie_terreno?.message}
              required
              placeholder="Escribir Superficie en m2..."
            />
            <Input
              {...register("poblacion_fija")}
              label="Población Fija / Flotante"
              error={errors?.poblacion_fija?.message}
              required
              placeholder="Escribir Población..."
            />
            <Input
              {...register("colindancias_inmueble")}
              label="Colindancias del Inmueble"
              error={errors?.colindancias_inmueble?.message}
              required
              placeholder="Escribir Colindancias..."
            />
            <Input
              {...register("areas_inmueble")}
              label="Áreas que se encuentran dentro del Inmueble"
              error={errors?.areas_inmueble?.message}
              required
              placeholder="Escribir Áreas..."
            />
          </div>
        </div>

      </div>
      <div className="mt-4 flex justify-end space-x-3 pb-4">
        <Button type="submit" className="min-w-[7rem]" onClick={() => {
          setCurrentEmpresaStep(0);
          llenarListadoFormCtx.dispatch({
            type: "SET_STEP_STATUS",
            payload: { informacion_empresa: { isDone: false } },
          });
        }}>
          Atrás
        </Button>
        <Button type="submit" className="min-w-[7rem]" color="primary">
          Siguiente
        </Button>
      </div>
    </form>
  );
};

export default EmpresaStep2;