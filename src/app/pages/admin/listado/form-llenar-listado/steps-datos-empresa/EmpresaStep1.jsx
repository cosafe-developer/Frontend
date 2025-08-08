import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// Local Imports
import { Button, Input, Upload } from "components/ui";
import { useLlenarListadoFormContext } from "../LlenarListadoFormContext";
import { infoEmpresaSchema } from "../schema";
import { CloudArrowUpIcon } from "@heroicons/react/24/solid";
import { FileItemSquare } from "components/shared/form/FileItemSquare";

const EmpresaStep1 = ({ setCurrentEmpresaStep }) => {
  const llenarListadoFormCtx = useLlenarListadoFormContext();

  // control del formulario
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(infoEmpresaSchema),
    defaultValues: llenarListadoFormCtx.state.formData.informacion_empresa,
  });

  const onSubmit = (data) => {
    llenarListadoFormCtx.dispatch({
      type: "SET_FORM_DATA",
      payload: {
        informacion_empresa: data,
      },
    });
    llenarListadoFormCtx.dispatch({
      type: "SET_STEP_STATUS",
      payload: { informacion_empresa: { isDone: true } },
    });
    setCurrentEmpresaStep(1);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
      className="flex grow flex-col"
    >
      <div className="grow space-y-4">
        <div className="flex flex-col gap-y-1.5">
          <label className="input-label">
            <span>Logotipo Oficial</span>
            <span className="ml-2 text-error">*</span>
          </label>
          <Controller
            name="logotipo"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Upload
                onChange={onChange}
                accept="image/*"
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
          {errors.logotipo && (
            <span className="input-text-error mt-1 text-xs text-error dark:text-error-lighter">{errors.logotipo.message}</span>
          )}
        </div>
        <Input
          {...register("nombre")}
          label="Nombre Comercial, Denominación o Razón Social"
          error={errors?.nombre?.message}
          required
          placeholder="Escribir Nombre Comercial de la Empresa..."
        />
        <Input
          {...register("rfc")}
          label="RFC"
          error={errors?.rfc?.message}
          required
          placeholder="RFC de la empresa..."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            {...register("email")}
            label="Email"
            type="email"
            error={errors?.email?.message}
            required
            placeholder="Escribir Email..."
          />
          <Input
            {...register("telefono")}
            label="Teléfono"
            type="number"
            placeholder="Escribir Teléfono"
          />
        </div>
        <Input
          {...register("domicilio")}
          label="Domicilio para Oir y Recibir Notificaciones"
          error={errors?.domicilio?.message}
          required
          placeholder="Ingresar Domicilio..."
        />
        <Input
          {...register("domicilio_fisico")}
          label="Domicilio Físico"
          error={errors?.domicilio_fisico?.message}
          required
          placeholder="Ingresar Domicilio..."
        />
      </div>
      <div className="mt-4 flex justify-end space-x-3 pb-4">
        <Button type="submit" className="min-w-[7rem]" color="primary">
          Siguiente
        </Button>
      </div>
    </form>
  );
};

export default EmpresaStep1;