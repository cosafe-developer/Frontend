import { useForm, Controller } from "react-hook-form";
import { Page } from "components/shared/Page";
import { Card, Button, Input } from "components/ui";
import { Listbox } from "components/shared/form/Listbox";
import { DatePicker } from "components/shared/form/Datepicker";

import { useCallback, useEffect, useState } from "react";
import { cargosAgentes } from "types/global/global";
import { CoverImageUpload } from "components/custom-ui/dropzone/CoverImageUpload";
import { useToastContext } from "app/contexts/toast-provider/context";
import { useNavigate, useParams } from "react-router";

import serverStatesFetching from "types/fetch/serverStatesFetching.type";
import getAgenteById from "api/agente/getAgenteById";
import LoadingComponent from "components/custom-ui/loadings/Loading.component";
import LoadingErrorComponent from "components/custom-ui/loadings/LoadingError.component";
import updateAgente from "api/agente/updateAgente";
import deleteImage from "api/upload/deleteImage";
import getFirmaUploadImage from "api/upload/getFirmaUploadImage.service";


const generos = [
  { id: "male", label: "Masculino" },
  { id: "female", label: "Femenino" },
  { id: "other", label: "Otro" }
];



const EditarAgente = () => {

  const [agente, setAgente] = useState(null);
  const [estado, setEstado] = useState(serverStatesFetching.fetching);
  const { agente_id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToastContext();

  const fetchData = useCallback(async () => {
    setEstado(serverStatesFetching.fetching);

    const payload = {
      agente_id: agente_id
    };

    const response = await getAgenteById({ requestBody: payload });

    if (!response?.ok) {
      setEstado(serverStatesFetching.error);
      return;
    }

    const agenteData = response?.data?.agente ?? null;
    setAgente(agenteData);
    setEstado(serverStatesFetching.success);

  }, [agente_id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      nombres: "",
      apellidos: "",
      genero: "",
      fechaEntrada: null,
      email: "",
      telefono: "",
      cargo: "",
    },
  });

  const onSubmit = async (data) => {
    if (!agente) return;

    setEstado(serverStatesFetching.fetching);

    try {
      let newPhotoUrl = null

      //Deleting Image
      if (data?.foto_url && agente?.logoUrl?.length > 0) {
        const pathName = agente.logoUrl.replace("https://cosafeimg.nyc3.digitaloceanspaces.com/", "");

        const deletingImage = await deleteImage({ pathName: pathName });

        if (deletingImage?.message !== "Archivo eliminado correctamente") {
          setEstado(serverStatesFetching.error);
          showToast({ message: "Error al borrar la imagen", type: "error" });
          return
        }
      }


      if (data?.foto_url) {
        const file = data?.foto_url;
        const firmaResp = await getFirmaUploadImage({
          fileName: file.name,
          fileType: file.type,
          folder: "profile",
        });


        const uploadUrl = firmaResp.signedUrl;

        await fetch(uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
            "x-amz-acl": "public-read",
            "Cache-Control": "public,max-age=31536000,immutable"
          },
          body: file,
        });

        newPhotoUrl = firmaResp.publicUrl;
      }

      const cambios = {};

      if (newPhotoUrl) {
        cambios.logoUrl = newPhotoUrl;
      }

      const mapping = {
        nombres: "firstName",
        apellidos: "lastName",
        genero: "gender",
        fechaEntrada: "startDate",
        email: "email",
        telefono: "phone",
        cargo: "position",
        password: "password",
      };

      Object.entries(mapping).forEach(([formKey, apiKey]) => {
        const originalValue = agente[apiKey] ?? "";
        let currentValue = data[formKey] ?? "";

        if (formKey === "fechaEntrada") {
          const originalDate = originalValue
            ? new Date(originalValue).toISOString().split("T")[0]
            : null;

          let currentDate = null;

          if (Array.isArray(data.fechaEntrada)) {
            currentDate = data.fechaEntrada?.[0]
              ? new Date(data.fechaEntrada[0]).toISOString().split("T")[0]
              : null;
          } else if (data.fechaEntrada) {
            currentDate = new Date(data.fechaEntrada).toISOString().split("T")[0];
          }

          if (originalDate !== currentDate) {
            cambios[apiKey] = currentDate;
          }
          return;
        }

        const valorOriginal =
          formKey === "fechaEntrada" && originalValue
            ? new Date(originalValue).toISOString().split("T")[0]
            : originalValue;

        if (apiKey === "password") {
          if (currentValue && currentValue.trim().length > 0) {
            cambios[apiKey] = currentValue;
          }
          return;
        }

        if (valorOriginal !== currentValue) {
          cambios[apiKey] = currentValue;
        }
      });

      if (Object.keys(cambios).length === 0) {
        showToast({ message: "No hay datos para actualizar", type: "warning", });
        setEstado(serverStatesFetching.success);
        return;
      }

      const payload = {
        agente_id,
        ...cambios,
      };

      const response = await updateAgente({ requestBody: payload });
      if (!response.ok) {
        setEstado(serverStatesFetching.error);
        showToast({ message: "Error al actualizar el agente", type: "error", });
        return;
      }

      setAgente((prev) => ({ ...prev, ...cambios }));
      setEstado(serverStatesFetching.success);
      showToast({ message: "Agente actualizado correctamente", type: "success", });
    } catch (error) {
      console.error("Error al actualizar agente:", error);
      setEstado(serverStatesFetching.error);
      showToast({ message: "Error en la comunicación con el servidor", type: "error", });
    }
  };

  useEffect(() => {
    if (agente) {
      reset({
        nombres: agente.firstName,
        apellidos: agente.lastName,
        genero: agente.gender,
        fechaEntrada: agente.startDate,
        email: agente.email,
        telefono: agente.phone,
        cargo: agente.position
      });

      setEstado(serverStatesFetching.success);
    }
  }, [agente, reset]);


  if (estado === serverStatesFetching.fetching) {
    return <LoadingComponent />;
  }

  if (estado === serverStatesFetching.error) {
    return <LoadingErrorComponent />;
  }


  return (
    <Page title="Editar Agente">
      <div className="transition-content w-full px-(--margin-x) pt-5 lg:pt-6">
        <h1 className="text-white text-2xl">Editar Agente</h1>

        <div className="mt-8 flex gap-8 mb-[4rem]">
          <div className="w-full">
            <Card className="flex flex-col p-5 space-y-6">

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Controller
                  name="foto_url"
                  control={control}
                  render={({ field }) => (
                    <CoverImageUpload
                      label="Foto de Perfil"
                      classNames={{ box: "mt-1.5" }}
                      error={errors?.foto_url?.message}
                      {...field}
                    />
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Controller
                    name="nombres"
                    control={control}
                    rules={{ required: "Nombre(s) requerido" }}
                    render={({ field }) => (
                      <Input
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
                        type="email"
                        placeholder="htrejo@cosafe.com"
                        label="Email"
                        {...field}
                      />
                    )}
                  />

                  <Controller
                    name="telefono"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="tel"
                        inputMode="numeric"
                        placeholder="Escribir Teléfono..."
                        label="Teléfono"
                        {...field}
                      />
                    )}
                  />
                </div>

                <Controller
                  name="cargo"
                  control={control}
                  rules={{ required: "Cargo requerido" }}
                  render={({ field }) => (
                    <Listbox
                      label="Cargo *"
                      placeholder="Agente PIPC"
                      data={cargosAgentes}
                      displayField="label"
                      value={cargosAgentes.find((e) => e.id === field.value) || null}
                      onChange={(val) => field.onChange(val?.id)}
                      error={errors?.cargo?.message}
                    />
                  )}
                />

                {/* <Controller
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
                /> */}

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
    </Page>
  );
};

export default EditarAgente;