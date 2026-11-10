import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// Local Imports
import { Button, Input } from "components/ui";
import { useLlenarListadoFormContext } from "../contexts/LlenarListadoFormContext";
import { infoEmpresaSchema } from "../contexts/schema";

import { useEffect } from "react";
import { CoverImageUpload } from "components/custom-ui/dropzone/CoverImageUpload";
import { normalizeUploadValue } from "helpers/listadoData";
import { uploadListadoFile } from "helpers/updateImageUpload";
import { LabelHelp } from "components/shared/HelpTip";
import { HELP } from "../../helpers/helpTexts";
import { LastChangeNotice } from "../../components/LastChangeNotice";

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
        // `{}`/""/placeholder no cuentan como logo: se hereda el de la empresa
        logoUrl:
          normalizeUploadValue(companyInfoCtx?.logoUrl) ??
          normalizeUploadValue(listado?.companyInfo?.logoUrl) ??
          normalizeUploadValue(empresa?.logoUrl),
        phone: companyInfoCtx?.phone ?? listado?.companyInfo?.phone ?? empresa?.phone ?? "",
        rfc: companyInfoCtx?.rfc ?? empresa?.rfc,
        city: companyInfoCtx?.city ?? listado?.companyInfo?.city ?? '',
        state: companyInfoCtx?.state ?? listado?.companyInfo?.state ?? '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [empresa, reset, listado]);

  const onSubmit = (data) => {
    llenarListadoFormCtx.dispatch({
      type: "MERGE_STEP_STATUS",
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
        <LastChangeNotice listado={listado} section="companyInfo" />
        <div className="flex flex-col gap-y-1.5">
          <span className="input-label">
            <LabelHelp label="Logotipo Oficial" help={HELP.companyInfo.logo} required />
          </span>

          <Controller
            name="logoUrl"
            control={control}
            render={({ field }) => (
              <CoverImageUpload
                label="Logotipo"
                classNames={{ box: "mt-1.5" }}
                error={errors?.logoUrl?.message}
                {...field}
                upload={(file) =>
                  uploadListadoFile(file, { listadoId: listado?._id, fileName: "logo" })
                }
                onChange={(url) => {
                  field.onChange(url);
                  llenarListadoFormCtx.dispatch({
                    type: "MERGE_STEP_STATUS",
                    payload: { companyInfo: { logoUrl: url ?? "" } },
                  });
                }}
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
              label={<LabelHelp label="Nombre Comercial, Denominación o Razón Social" help={HELP.companyInfo.businessName} />}
              required
              placeholder="Escribir Nombre Comercial de la Empresa..."
              error={errors?.businessName?.message}
              onChange={(e) => {
                field.onChange(e);
                llenarListadoFormCtx.dispatch({
                  type: "MERGE_STEP_STATUS",
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
              label={<LabelHelp label="RFC" help={HELP.companyInfo.rfc} />}
              required
              placeholder="RFC de la empresa..."
              error={errors?.rfc?.message}
              onChange={(e) => {
                field.onChange(e);
                llenarListadoFormCtx.dispatch({
                  type: "MERGE_STEP_STATUS",
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
                label={<LabelHelp label="Email" help={HELP.companyInfo.email} />}
                type="email"
                required
                placeholder="Escribir Email..."
                error={errors?.email?.message}
                onChange={(e) => {
                  field.onChange(e);
                  llenarListadoFormCtx.dispatch({
                    type: "MERGE_STEP_STATUS",
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
                label={<LabelHelp label="Teléfono" help={HELP.companyInfo.phone} />}
                placeholder="Escribir Teléfono"
                error={errors?.phone?.message}
                onChange={(e) => {
                  field.onChange(e);
                  llenarListadoFormCtx.dispatch({
                    type: "MERGE_STEP_STATUS",
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
              label={<LabelHelp label="Domicilio Fisico" help={HELP.companyInfo.address} />}
              required
              placeholder="Ingresar Domicilio..."
              error={errors?.address?.message}
              onChange={(e) => {
                field.onChange(e);
                llenarListadoFormCtx.dispatch({
                  type: "MERGE_STEP_STATUS",
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

        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label={<LabelHelp label="Ciudad" help={HELP.companyInfo.city} />}
                required
                placeholder="Ej: Monterrey"
                error={errors?.city?.message}
                onChange={(e) => {
                  field.onChange(e);
                  llenarListadoFormCtx.dispatch({
                    type: "MERGE_STEP_STATUS",
                    payload: {
                      companyInfo: { city: e.target.value },
                    },
                  });
                }}
              />
            )}
          />
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label={<LabelHelp label="Estado" help={HELP.companyInfo.state} />}
                required
                placeholder="Ej: Nuevo León"
                error={errors?.state?.message}
                onChange={(e) => {
                  field.onChange(e);
                  llenarListadoFormCtx.dispatch({
                    type: "MERGE_STEP_STATUS",
                    payload: {
                      companyInfo: { state: e.target.value },
                    },
                  });
                }}
              />
            )}
          />
        </div>

      </div>
      <div className="mt-4 flex justify-end space-x-3 pb-4">
        <Button type="submit" className="min-w-[7rem]" color="primary" title={HELP.companyInfo.next}>
          Siguiente
        </Button>
      </div>
    </form>
  );
};

export default EmpresaStep1;