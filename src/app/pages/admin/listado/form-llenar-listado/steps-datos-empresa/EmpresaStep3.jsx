import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Spinner } from "components/ui";

// Local Imports
import { DatePicker } from "components/shared/form/Datepicker";
import { FileItemSquare } from "components/shared/form/FileItemSquare";
import { CloudArrowUpIcon } from "@heroicons/react/24/solid";
import { Button, Input, Upload } from "components/ui";
import { informacionRiesgoSchema } from "../schema";
import { useLlenarListadoFormContext } from "../LlenarListadoFormContext";

import { Fragment } from "react";
import { useDisclosure } from "hooks";
import { useState, useEffect } from "react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

const EmpresaStep3 = ({ setCurrentEmpresaStep, setCurrentStep }) => {
  const [isOpen, { open, close }] = useDisclosure(false);
  const [formDataState, setFormDataState] = useState("[waiting]");
  const llenarListadoFormCtx = useLlenarListadoFormContext();

  useEffect(() => {
    const sendData = async () => {
      if (formDataState === "[send-data]") {
        const payload = {
          informacion_empresa: llenarListadoFormCtx.state.formData.informacion_empresa,
          informacion_de_la_direccion: llenarListadoFormCtx.state.formData.informacion_de_la_direccion,
          informacion_de_riesgo: llenarListadoFormCtx.state.formData.informacion_de_riesgo,
        }
        const endPointListado = "/post/listado/:id";
        console.log(endPointListado);
        console.log("payload: ", payload);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setFormDataState("[success]");
      }
    };
    sendData();
  }, [formDataState]);

  // control del formulario
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(informacionRiesgoSchema),
    defaultValues: llenarListadoFormCtx.state.formData.informacion_de_riesgo,
  });

  const onSubmit = async (data) => {
    llenarListadoFormCtx.dispatch({
      type: "SET_FORM_DATA",
      payload: {
        informacion_de_riesgo: data,
      },
    });
    llenarListadoFormCtx.dispatch({
      type: "SET_STEP_STATUS",
      payload: {
        informacion_de_riesgo: { isDone: true },
      },
    });
    open();
    setFormDataState("[send-data]");
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
        className="flex grow flex-col"
      >
        <div className="grow space-y-8">
          <div className="flex flex-col gap-y-1.5">
            <label className="input-label">
              <span>Inventario de Recursos Materiales (Ubicación y Condición)</span>
              <span className="ml-2 text-error">*</span>
            </label>
            <Controller
              name="inventario_recursos"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Upload
                  onChange={onChange}
                  accept="application/pdf"
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
            {errors.constancia_fiscal && (
              <span className="input-text-error mt-1 text-xs text-error dark:text-error-lighter">{errors.constancia_fiscal.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                {...register("descripcion_empresa")}
                label="Descripción de la Empresa"
                error={errors?.descripcion_empresa?.message}
                required
                placeholder="Escribir Descripción de la Empresa..."
              />
              <Input
                {...register("tipo_riesgo_interno")}
                label="Tipo de riesgo Interno / Por Entorno (Ordinario / Alto)"
                error={errors?.tipo_riesgo_interno?.message}
                required
                placeholder="Escribir Tipo de Riesgo..."
              />
            </div>
            <Input
              {...register("antecedentes")}
              label="Antecedentes"
              error={errors?.antecedentes?.message}
              required
              placeholder="Escribir Antecedentes..."
            />
          </div>

          {/* falta agregarlo a yulp */}
          <div className="flex flex-col gap-y-2">
            <label className="input-label">
              <span>Calendario de fechas destinadas al subprograma de prevención de riesgos</span>
              <span className="ml-2 text-error">*</span>
            </label>
            <DatePicker
              options={{
                mode: "range",
                dateFormat: "Y-m-d",
              }}
              placeholder="Seleccionar rango de fechas..."
            />
          </div>

          <div>
            <Input
              {...register("riesgos_generales_internos")}
              label="Riesgos Generales Internos"
              error={errors?.riesgos_generales_internos?.message}
              required
              placeholder="Escribir los Riesgos Generales Internos..."
            />
          </div>

        </div>
        <div className="mt-4 flex justify-end space-x-3 pb-4">
          <Button type="submit" className="min-w-[7rem]" onClick={() => {
            setCurrentEmpresaStep(1);
            llenarListadoFormCtx.dispatch({
              type: "SET_STEP_STATUS",
              payload: {
                informacion_de_la_direccion: { isDone: false },
                informacion_de_riesgo: { isDone: false },
              },
            });
          }}>
            Atrás
          </Button>
          <Button
            type="submit"
            color="primary"
            className="min-w-[7rem]"
          >
            Guardar
          </Button>
        </div>
      </form>

      {/* modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-100 flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
          onClose={close}
        >
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity dark:bg-black/40" />
          </TransitionChild>

          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <DialogPanel className="scrollbar-sm relative flex max-w-md flex-col overflow-y-auto rounded-lg bg-white px-4 py-10 text-center transition-opacity duration-300 dark:bg-dark-700 sm:px-5">
              {
                formDataState === "[send-data]" && (
                  <div>
                    <Spinner color="primary" variant="soft" isElastic className="size-28" />
                    {/* <CheckCircleIcon className="mx-auto inline size-28 shrink-0 text-success" /> */}
                    <div className="mt-4">
                      <DialogTitle
                        as="h3"
                        className="text-2xl text-gray-800 dark:text-dark-100"
                      >
                        Guardando datos de la empresa
                      </DialogTitle>
                    </div>
                  </div>
                )
              }
              {/* success */}
              {
                formDataState === "[success]" && (
                  <div>
                    <CheckCircleIcon className="mx-auto inline size-28 shrink-0 text-success" />
                    <div className="mt-4">
                      <DialogTitle
                        as="h3"
                        className="text-2xl text-gray-800 dark:text-dark-100"
                      >
                        Datos de la empresa guardados
                      </DialogTitle>

                      <Button
                        color="success"
                        className="mt-6"
                        onClick={() => {
                          llenarListadoFormCtx.dispatch({
                            type: "SET_STEP_STATUS",
                            payload: { datos_generales: { isDone: true } }
                          });
                          setCurrentStep(1);
                          close();
                        }}
                      >
                        Continuar
                      </Button>
                    </div>
                  </div>
                )
              }
              {
                formDataState === "[error]" && (
                  <div>
                    <XCircleIcon className="mx-auto inline size-28 shrink-0 text-error" />
                    <div className="mt-4">
                      <DialogTitle
                        as="h3"
                        className="text-2xl text-gray-800 dark:text-dark-100"
                      >
                        Error al intentar guardar los datos
                      </DialogTitle>

                      <Button onClick={close} color="error" className="mt-6">
                        Cerrar
                      </Button>
                    </div>
                  </div>
                )
              }
            </DialogPanel>
          </TransitionChild>
        </Dialog>
      </Transition >
    </>
  );
};

export default EmpresaStep3;