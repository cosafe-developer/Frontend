import { useForm, Controller } from "react-hook-form";
import { Page } from "components/shared/Page";
import { Card, Button, Input } from "components/ui";
import { useState } from "react";

import { Dropzone } from "./upload/DropZoneEmpresa";
import { useNavigate } from "react-router";



const CrearEmpresa = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      nombreEmpresa: "",
      rfc: "",
      email: "",
      telefono: "",
      contraseña: "",
      confirmarContraseña: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Formulario enviado:", data);
  };

  return (
    <Page title="Crear Nueva Empresa">
      <div className="transition-content w-full px-(--margin-x) pt-5 lg:pt-6">
        <h1 className="text-white text-2xl">Crear Empresa</h1>

        <div className="mt-8 flex gap-8 mb-[4rem]">
          <div className="w-full">
            <Card className="flex flex-col p-5 space-y-6">
              <div>
                <h2 className="text-xl text-white">Datos Generales</h2>
                <p className="mt-2 text-[16px]">
                  Por favor proporcione la información de la empresa para crear su perfil
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Dropzone files={uploadedFiles} setFiles={setUploadedFiles} />

                <Controller
                  name="nombreEmpresa"
                  control={control}
                  rules={{ required: "Nombre Empresa Requerido" }}
                  render={({ field }) => (
                    <Input
                      placeholder="Escribir Nombre Comercial de la Empresa..."
                      label="Nombre Comercial, Denominación o Razón Social *"
                      error={errors?.nombreEmpresa?.message}
                      {...field}
                    />
                  )}
                />

                <Controller
                  name="rfc"
                  control={control}
                  rules={{ required: "Nombre Empresa Requerido" }}
                  render={({ field }) => (
                    <Input
                      placeholder="Escribir Nombre Comercial de la Empresa..."
                      label="Nombre Comercial, Denominación o Razón Social *"
                      error={errors?.rfc?.message}
                      {...field}
                    />
                  )}
                />


                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="email"
                        placeholder="htrejo@cosafe.com"
                        label="Email"
                        error={errors?.email?.message}
                        {...field}
                      />
                    )}
                  />

                  <Controller
                    name="numeric"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="Escribir Teléfono..."
                        label="Teléfono"
                        error={errors?.telefono?.message}
                        {...field}
                      />
                    )}
                  />
                </div>


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
    </Page>
  );
};

export default CrearEmpresa;