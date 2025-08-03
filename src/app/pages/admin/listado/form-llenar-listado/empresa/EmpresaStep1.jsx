// Import Dependencies
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// Local Imports
import { Button, Input } from "components/ui";
import { useLlenarListadoFormContext } from "../LlenarListadoFormContext";
import { generalSchema } from "../schema";
// import { useNavigate } from "react-router";

import { Upload } from "components/ui";
import { CloudArrowUpIcon } from "@heroicons/react/24/solid";
import { useRef, useState } from "react";
import { FileItemSquare } from "components/shared/form/FileItemSquare";

// ----------------------------------------------------------------------

const EmpresaStep1 = ({
  // setCurrentStep,
  // currentEmpresaStep,
  // currentEStudioStep,
  // setCurrentEStudioStep,
  setCurrentEmpresaStep
}) => {
  const llenarListadoFormCtx = useLlenarListadoFormContext();
  // const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const uploadRef = useRef();

  const handleRemove = (e) => {
    e.stopPropagation();
    uploadRef.current.value = "";
    setFile(null);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(generalSchema),
    defaultValues: llenarListadoFormCtx.state.formData.general,
  });

  const onSubmit = (data) => {
    llenarListadoFormCtx.dispatch({
      type: "SET_FORM_DATA",
      payload: {
        general: {
          logotipo: file,
          nombre: data.nombre,
          rfc: data.rfc,
          email: data.email,
          domicilio: data.domicilio,
          domicilio_fisico: data.domicilio_fisico,
        }
      },
    });
    setCurrentEmpresaStep(1);
    // llenarListadoFormCtx.dispatch({
    //   type: "SET_STEP_STATUS",
    //   payload: { general: { isDone: true } },
    // });
    // setCurrentStep(1);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
      className="flex grow flex-col"
    >
      <div className="grow space-y-4">
        <div className="flex flex-col gap-y-1.5">
          <label
            className="input-label"
          >
            <span className="input-label">Logotipo Oficial</span>
            <span className="ml-2 text-error">*</span>
          </label>
          <Upload
            onChange={setFile}
            ref={uploadRef}
            accept="image/*"
          >
            {({ ...props }) =>
              file ? (
                <FileItemSquare
                  handleRemove={handleRemove}
                  file={file}
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
      <div className="mt-4 flex justify-end space-x-3 ">
        <Button type="submit" className="min-w-[7rem]" color="primary">
          Siguiente
        </Button>
      </div>
    </form>
  );
}

export default EmpresaStep1;