import { useForm, Controller } from "react-hook-form";
import { Page } from "components/shared/Page";
import { Card, Button, Input } from "components/ui";
import { useCallback, useEffect, useState } from "react";
import { Dropzone } from "./upload/DropZoneEmpresa";
import { useToastContext } from "app/contexts/toast-provider/context";
import { useNavigate, useParams } from "react-router";

import serverStatesFetching from "types/fetch/serverStatesFetching.type";
import LoadingComponent from "components/custom-ui/loadings/Loading.component";
import LoadingErrorComponent from "components/custom-ui/loadings/LoadingError.component";
import getEmpresaById from "api/empresa/getEmpresaById";
import updateEmpresa from "api/empresa/updateEmpresa";


const EditarEmpresa = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [empresa, setEmpresa] = useState(null);
  const [estado, setEstado] = useState(serverStatesFetching.fetching);
  const { showToast } = useToastContext();
  const { empresa_id } = useParams();
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setEstado(serverStatesFetching.fetching);

    const payload = {
      empresa_id: empresa_id
    };

    const response = await getEmpresaById({ requestBody: payload });

    if (!response?.ok) {
      setEstado(serverStatesFetching.error);
      return;
    }

    const empresaData = response?.data?.empresa ?? null;
    setEmpresa(empresaData);
    setEstado(serverStatesFetching.success);
  }, [empresa_id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    /*   watch, */
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
    if (!empresa) return;

    setEstado(serverStatesFetching.fetching);

    try {
      const cambios = {};

      // === Mapeo del formulario → backend ===
      const mapping = {
        nombre_empresa: "tradeName",
        rfc: "rfc",
        email: "email",
        telefono: "phone",
        password: "password",
      };

      Object.entries(mapping).forEach(([formKey, apiKey]) => {
        const originalValue = empresa[apiKey] ?? "";
        const currentValue = data[formKey] ?? "";

        if (originalValue !== currentValue) {
          cambios[apiKey] = currentValue;
        }
      });


      if (Object.keys(cambios).length === 0) {
        console.log("No hay cambios para actualizar.");
        setEstado(serverStatesFetching.success);
        return;
      }

      const payload = {
        empresa_id: empresa_id,
        ...cambios,
      };

      const response = await updateEmpresa({ requestBody: payload });
      if (response.ok) {
        setEmpresa((prev) => ({ ...prev, ...cambios }));
        setEstado(serverStatesFetching.success);
        showToast({
          message: "Empresa actualizada correctamente",
          type: "success",
        });
      } else {
        setEstado(serverStatesFetching.error);
        showToast({
          message: "Error al actualizar la empresa",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error al actualizar empresa:", error);
      setEstado(serverStatesFetching.error);
      showToast({
        message: "Error en la comunicación con el servidor",
        type: "error",
      });
    }
  };


  useEffect(() => {
    if (empresa) {
      reset({
        nombre_empresa: empresa.tradeName,
        rfc: empresa.rfc,
        email: empresa.email,
        telefono: empresa.phone,
        password: empresa.password
      });

      setEstado(serverStatesFetching.success);
    }
  }, [empresa, reset]);


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


                  {/*  <Controller
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
      </div>
    </Page>
  );
};

export default EditarEmpresa;