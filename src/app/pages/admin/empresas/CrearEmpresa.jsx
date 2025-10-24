import { useForm, Controller } from "react-hook-form";
import { Page } from "components/shared/Page";
import { Card, Button, Input } from "components/ui";
import { useState } from "react";
import { Dropzone } from "./upload/DropZoneEmpresa";
import { useNavigate } from "react-router";
import LoadingComponent from "components/custom-ui/loadings/Loading.component";
import serverStatesFetching from "types/fetch/serverStatesFetching.type";
import LoadingErrorComponent from "components/custom-ui/loadings/LoadingError.component";
import { useToastContext } from "app/contexts/toast-provider/context";
import getFirmaUploadImage from "api/upload/getFirmaUploadImage.service";
import createEstudio from "api/empresa/createEmpresa";
import { UnderReview } from "./UnderReview";
import { getCookies } from "utils/getCookies";
import { PhoneDialCode } from "./components/PhoneDialCode";



const CrearEmpresa = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const navigate = useNavigate();
  const { showToast } = useToastContext();
  const [isFinished, setIsFinished] = useState(null);
  const [estado, setEstado] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      nombre_empresa: "",
      rfc: "",
      email: "",
      telefono: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setEstado(serverStatesFetching.fetching);
      const userId = getCookies("user_id");

      const phoneNumber = (data.numeric?.dialCode || "") + (data.numeric?.number || "");
      const file = uploadedFiles[0];
      const firmaResp = await getFirmaUploadImage({
        fileName: file.name,
        fileType: file.type,
        folder: "profile",
      });


      const uploadUrl = firmaResp.uploadUrl;

      await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      const publicUrl = firmaResp.publicUrl;

      const payload = {
        logoUrl: publicUrl,
        tradeName: data.nombre_empresa,
        rfc: data.rfc,
        adminId: userId,
        email: data.email,
        phone: phoneNumber,
        password: data.password,
      };

      const empresa = await createEstudio({ requestBody: payload });

      if (!empresa?.ok) {
        setEstado(serverStatesFetching.error);
        showToast({
          message: "Error al crear el agente",
          type: "error",
        });
      } else {
        setEstado(serverStatesFetching.success);
        setIsFinished(true);
      }
    } catch (error) {
      setEstado(serverStatesFetching.error);
      showToast({
        message: "Error al crear el agente",
        type: "error",
      });
      console.error("Error creando agente:", error);
    }
  };

  if (estado === serverStatesFetching.fetching) {
    return (
      <>
        <LoadingComponent />
      </>
    );
  }

  if (estado === serverStatesFetching.error) {
    return <LoadingErrorComponent />;
  }

  return (
    <Page title="Crear Nueva Empresa">
      {isFinished ? (
        <div className="col-span-12 place-self-center">
          <UnderReview />
        </div>
      ) : (

        <div className="transition-content w-full px-(--margin-x) pt-5 lg:pt-6">
          <h1 className="text-white text-2xl">Crear Nueva Empresa</h1>

          <div className="mt-8 flex gap-8 mb-[4rem]">
            <div className="w-full">
              <Card className="flex flex-col p-5 space-y-6">
                <div>
                  <h2 className="text-xl text-white">Datos Generales</h2>
                  <p className="mt-2 text-[16px]">Por favor proporcione la información de la empresa para crear su perfil</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <Dropzone files={uploadedFiles} setFiles={setUploadedFiles} />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Controller
                      name="nombre_empresa"
                      control={control}
                      rules={{ required: "Empresa Requerida (*)" }}
                      render={({ field }) => (
                        <Input
                          placeholder="Escribir Nombre Comercial de la Empresa... "
                          label="Nombre Comercial, Denomicación o Razón Social *"
                          error={errors?.nombre_empresa?.message}
                          {...field}
                        />
                      )}
                    />

                    <Controller
                      name="rfc"
                      control={control}
                      rules={{ required: "RFC requerido" }}
                      render={({ field }) => (
                        <Input
                          placeholder="RFC de la empresa"
                          label="RFC *"
                          error={errors?.apellidos?.message}
                          {...field}
                        />
                      )}
                    />

                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="email"
                          placeholder="Escribir email"
                          label="Email"
                          {...field}
                        />
                      )}
                    />

                    <Controller
                      name="numeric"
                      control={control}
                      rules={{ required: "El teléfono es obligatorio" }}
                      render={({ field, fieldState }) => (
                        <div className="flex gap-2 mt-[1.6rem] h-[3rem]">
                          <PhoneDialCode
                            value={field.value?.dialCode || ""}
                            onChange={(dialCode) => field.onChange({ ...field.value, dialCode })}
                            error={Boolean(fieldState.error)}
                            className="h-full"
                          />
                          <Input
                            type="tel"
                            inputMode="numeric"
                            classNames={{
                              root: "flex-1 h-full",
                              input: "h-full hover:z-1 focus:z-1 ltr:rounded-l-none rtl:rounded-r-none",
                            }}
                            placeholder="Escribir Teléfono..."
                            {...field}
                            value={field.value?.number || ""}
                            onChange={(e) =>
                              field.onChange({ ...field.value, number: e.target.value })
                            }
                            error={Boolean(fieldState.error)}
                          />
                        </div>
                      )}
                    />
                  </div>


                  <Controller
                    name="password"
                    control={control}
                    rules={{ required: "Contraseña requerida (*)" }}
                    render={({ field }) => (
                      <Input
                        label="Contraseña *"
                        placeholder="htrejos245CV"
                        type="password"
                        error={errors?.password?.message}
                        {...field}
                      />
                    )}
                  />

                  <Controller
                    name="confirmPassword"
                    control={control}
                    rules={{
                      required: "Confirme su contraseña",
                      validate: (value) =>
                        value === watch("password") || "Las contraseñas no coinciden",
                    }}
                    render={({ field }) => (
                      <Input
                        placeholder="htrejos245CV"
                        label="Confirmar Contraseña *"
                        type="password"
                        error={errors?.confirmPassword?.message}
                        {...field}
                      />
                    )}
                  />


                  <p className="text-warning text-sm italic">* Campos obligatorios</p>

                  <div className="flex justify-end space-x-5">
                    <Button
                      onClick={() => navigate(`/admin/agentes`)}
                      type="button">
                      Cancelar
                    </Button>
                    <Button type="submit" color="primary">Guardar</Button>
                  </div>
                </form>
              </Card>

            </div>
          </div>
        </div>
      )}
    </Page>
  );
};

export default CrearEmpresa;