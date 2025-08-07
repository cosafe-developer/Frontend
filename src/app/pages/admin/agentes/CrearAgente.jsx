import { useForm, Controller } from "react-hook-form";
import { Page } from "components/shared/Page";
import { Card, Button, Input } from "components/ui";
import { Listbox } from "components/shared/form/Listbox";
import { DatePicker } from "components/shared/form/Datepicker";

import { useState } from "react";

import { Dropzone } from "./upload/DropZoneAgentes";
import { useNavigate } from "react-router";

const empresas = [
  { id: "1", label: "Empresa A" },
  { id: "2", label: "Empresa B" },
];

const estudios = [
  { id: "1", label: "Estudio X" },
  { id: "2", label: "Estudio Y" },
];

const generos = [
  { id: "masculino", label: "Masculino" },
  { id: "femenino", label: "Femenino" },
  { id: "otro", label: "Otro" },
];

const CrearAgente = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
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
      fechaEntrada: null,
      email: "",
      telefono: "",
      cargo: "",
      contraseña: "",
      confirmarContraseña: "",
      empresa: "",
      estudio: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Formulario enviado:", data);
  };

  return (
    <Page title="Crear Nuevo Agente">
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
                    name="numeric"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
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
                    <Input
                      placeholder="Agente PIPC"
                      label="Cargo *"
                      error={errors?.cargo?.message}
                      {...field}
                    />
                  )}
                />

                <Controller
                  name="password"
                  control={control}
                  rules={{ required: "Contraseña requerida" }}
                  render={({ field }) => (
                    <Input
                      label="Contraseña *"
                      placeholder="htrejos245CV"
                      type="password"
                      error={errors?.contraseña?.message}
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
                      error={errors?.confirmarContraseña?.message}
                      {...field}
                    />
                  )}
                />

                {/* Empresa y Estudio */}
                <Controller
                  name="empresa"
                  control={control}
                  rules={{ required: "Asigna una empresa" }}
                  render={({ field }) => (
                    <Listbox
                      label="Empresa *"
                      placeholder="Asigna una empresa..."
                      data={empresas}
                      displayField="label"
                      value={empresas.find((e) => e.id === field.value) || null}
                      onChange={(val) => field.onChange(val?.id)}
                      error={errors?.empresa?.message}
                    />
                  )}
                />

                <Controller
                  name="estudio"
                  control={control}
                  rules={{ required: "Asigna un estudio" }}
                  render={({ field }) => (
                    <Listbox
                      label="Estudio *"
                      placeholder="Asigna un estudio..."
                      data={estudios}
                      displayField="label"
                      value={estudios.find((e) => e.id === field.value) || null}
                      onChange={(val) => field.onChange(val?.id)}
                      error={errors?.estudio?.message}
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

export default CrearAgente;