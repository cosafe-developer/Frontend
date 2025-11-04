import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// Local Imports
import { Button, Input } from "components/ui";
import { useLlenarListadoFormContext } from "../contexts/LlenarListadoFormContext";
import { infoEmpresaSchema } from "../contexts/schema";

import { useEffect } from "react";
import { CoverImageUpload } from "components/custom-ui/dropzone/CoverImageUpload";

const EmpresaStep1 = ({
  setCurrentEmpresaStep,
  listado,
  empresa
}) => {
  const llenarListadoFormCtx = useLlenarListadoFormContext();
  const companyInfoCtx = llenarListadoFormCtx?.state?.stepStatus?.companyInfo;

  // control del formulario
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(infoEmpresaSchema),
    defaultValues: companyInfoCtx,
  });

  useEffect(() => {
    if (empresa && listado) {
      reset({
        address: companyInfoCtx?.address ?? listado?.companyInfo?.address,
        businessName: companyInfoCtx?.businessName ?? empresa?.tradeName,
        email: companyInfoCtx?.email ?? empresa?.email,
        logoUrl: companyInfoCtx?.logoUrl ?? empresa?.logoUrl,
        phone: companyInfoCtx?.phone ?? empresa?.phone,
        rfc: companyInfoCtx?.rfc ?? empresa?.rfc,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [empresa, reset, listado]);

  const onSubmit = (data) => {
    llenarListadoFormCtx.dispatch({
      type: "SET_STEP_STATUS",
      payload: {
        companyInfo: {
          ...data,
          isDone: true
        },
      },
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
            name="logoUrl"
            control={control}
            render={({ field }) => (
              <CoverImageUpload
                label=""
                classNames={{ box: "mt-1.5" }}
                error={errors?.logoUrl?.message}
                {...field}
              />
            )}
          />
        </div>
        {/* Nombre */}
        <Controller
          name="businessName"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Nombre Comercial, Denominación o Razón Social"
              required
              placeholder="Escribir Nombre Comercial de la Empresa..."
              error={errors?.businessName?.message}
              onChange={(e) => {
                field.onChange(e);
                llenarListadoFormCtx.dispatch({
                  type: "SET_STEP_STATUS",
                  payload: {
                    companyInfo: {
                      businessName: e.target.value,
                    },
                  },
                });
              }}

            />
          )}
        />

        {/* RFC */}
        <Controller
          name="rfc"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="RFC"
              required
              placeholder="RFC de la empresa..."
              error={errors?.rfc?.message}
              onChange={(e) => {
                field.onChange(e);
                llenarListadoFormCtx.dispatch({
                  type: "SET_STEP_STATUS",
                  payload: {
                    companyInfo: {
                      rfc: e.target.value,
                    },
                  },
                });
              }}
            />
          )}
        />

        {/* Email y Teléfono */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Email"
                type="email"
                required
                placeholder="Escribir Email..."
                error={errors?.email?.message}
                onChange={(e) => {
                  field.onChange(e);
                  llenarListadoFormCtx.dispatch({
                    type: "SET_STEP_STATUS",
                    payload: {
                      companyInfo: {
                        email: e.target.value,
                      },
                    },
                  });
                }}

              />
            )}
          />
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Teléfono"
                placeholder="Escribir Teléfono"
                error={errors?.phone?.message}
                onChange={(e) => {
                  field.onChange(e);
                  llenarListadoFormCtx.dispatch({
                    type: "SET_STEP_STATUS",
                    payload: {
                      companyInfo: {
                        phone: e.target.value,
                      },
                    },
                  });
                }}

              />
            )}
          />
        </div>

        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Domicilio Fisico"
              required
              placeholder="Ingresar Domicilio..."
              error={errors?.address?.message}
              onChange={(e) => {
                field.onChange(e);
                llenarListadoFormCtx.dispatch({
                  type: "SET_STEP_STATUS",
                  payload: {
                    companyInfo: {
                      address: e.target.value,
                    },
                  },
                });
              }}

            />
          )}
        />

        {/* Domicilio para oír notificaciones */}
        {/* <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Domicilio para Oir y Recibir Notificaciones"
              required
              placeholder="Ingresar Domicilio..."
              error={errors?.address?.message}
              onChange={(e) => {
                field.onChange(e);
                llenarListadoFormCtx.dispatch({
                  type: "SET_FORM_DATA",
                  payload: {
                    companyInfo: {
                      ...llenarListadoFormCtx?.state?.formData?.companyInfo,
                      address: e.target.value,
                    },
                  },
                });
              }}

            />
          )}
        /> */}



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