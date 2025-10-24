import { useForm, Controller } from "react-hook-form";
import { Page } from "components/shared/Page";
import { Card, Button, Input } from "components/ui";
import { Listbox } from "components/shared/form/Listbox";
import { DatePicker } from "components/shared/form/Datepicker";
import { useToastContext } from "app/contexts/toast-provider/context";
import { useState } from "react";
import { UnderReview } from "./UnderReview";
import { Dropzone } from "./upload/DropZoneAgentes";
import { useNavigate } from "react-router";

import serverStatesFetching from "types/fetch/serverStatesFetching.type";
import createAgente from "api/agente/createAgente";
import LoadingComponent from "components/custom-ui/loadings/Loading.component";
import LoadingErrorComponent from "components/custom-ui/loadings/LoadingError.component";
import { UserIcon } from "@heroicons/react/20/solid";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { PhoneDialCode } from "./components/PhoneDialCode";
import getFirmaUploadImage from "api/upload/getFirmaUploadImage.service";


const generos = [
  { id: "male", label: "Masculino" },
  { id: "female", label: "Femenino" },
  { id: "other", label: "Otro" }
];

const CrearAgente = () => {
  const { showToast } = useToastContext();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isFinished, setIsFinished] = useState(null);
  const [estado, setEstado] = useState(null);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      nombres: "",
      apellidos: "",
      genero: "",
      fechaEntrada: "",
      email: "",
      telefono: "",
      cargo: "",
      password: "",
      confirmPassword: "",
      empresa: "",
      estudio: "",
    },
  });


  const onSubmit = async (data) => {
    try {
      setEstado(serverStatesFetching.fetching);

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
        firstName: data.nombres,
        lastName: data.apellidos,
        gender: data.genero,
        startDate: data.fechaEntrada?.[0]
          ? new Date(data.fechaEntrada[0]).toISOString().split("T")[0]
          : null,
        email: data.email,
        phone: phoneNumber,
        position: data.cargo,
        password: data.password,
      };


      const agente = await createAgente({ requestBody: payload });

      if (!agente?.ok) {
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
    <Page title="Crear Nuevo Agente">
      {isFinished ? (
        <div className="col-span-12 place-self-center">
          <UnderReview />
        </div>
      ) : (
        <div className="transition-content w-full px-(--margin-x) pt-5 lg:pt-6">
          <h1 className="text-white text-2xl">Crear Agente</h1>

          <div className="mt-8 flex gap-8 mb-[4rem]">
            <div className="w-full">
              <Card className="flex flex-col p-5 space-y-6">
                <div>
                  <h2 className="text-xl text-white">Información de Agente</h2>
                  <p className="mt-2 text-[16px]">Por favor proporcione la información personal para crear su perfil</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <Dropzone files={uploadedFiles} setFiles={setUploadedFiles} />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Controller
                      name="nombres"
                      control={control}
                      rules={{ required: "Nombre(s) requerido" }}
                      render={({ field }) => (
                        <Input
                          prefix={<UserIcon className="size-5" />}
                          placeholder="Hernan"
                          label="Nombre(s) *"
                          error={errors?.nombres?.message}
                          {...field}
                        />
                      )}
                    />

                    <Controller
                      name="apellidos"
                      control={control}
                      rules={{ required: "Apellido(s) requerido" }}
                      render={({ field }) => (
                        <Input
                          prefix={<UserIcon className="size-5" />}
                          placeholder="Trejo Gonzales"
                          label="Apellido(s) *"
                          error={errors?.apellidos?.message}
                          {...field}
                        />
                      )}
                    />

                    <Controller
                      name="genero"
                      control={control}
                      rules={{ required: "Seleccione un género" }}
                      render={({ field }) => (
                        <Listbox
                          label="Género *"
                          placeholder="Seleccione género..."
                          data={generos}
                          displayField="label"
                          value={generos.find((g) => g.id === field.value) || null}
                          onChange={(val) => field.onChange(val?.id)}
                          error={errors?.genero?.message}
                        />
                      )}
                    />

                    <Controller
                      name="fechaEntrada"
                      control={control}
                      rules={{ required: "Fecha de entrada a la empresa" }}
                      render={({ field }) => (
                        <div>
                          <h2 className="mb-2">Fecha de Entrada a la empresa *</h2>
                          <DatePicker
                            {...field}
                            placeholder="Eligir Fecha..."
                            error={errors?.fechaEntrada?.message}
                          />
                        </div>
                      )}
                    />

                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <Input
                          prefix={<EnvelopeIcon className="size-5" />}
                          type="email"
                          placeholder="htrejo@cosafe.com"
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

                  {/*  <Controller
                    name="cargo"
                    control={control}
                    rules={{ required: "Cargo requerido" }}
                    render={({ field }) => (
                      <Input
                        placeholder="Agente PIPC"
                        label="Cargo *"
                        error={errors?.cargo?.message}
                        {...field}
                      />
                    )}
                  /> */}

                  <Controller
                    name="password"
                    control={control}
                    rules={{ required: "Contraseña requerida" }}
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

export default CrearAgente;