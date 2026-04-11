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

import { Button, Input, Switch, Table, THead, TBody, Th, Tr, Td, Checkbox } from "components/ui";
import { informacionRiesgoSchema } from "../contexts/schema";
import { useLlenarListadoFormContext } from "../contexts/LlenarListadoFormContext";

import { Fragment } from "react";
import { useDisclosure } from "hooks";
import { useState, useEffect } from "react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { resetDataEmpresaStep3 } from "./utils/resetDataEmpresaStep3";
import { CoverImageUpload } from "components/custom-ui/dropzone/CoverImageUpload";
import { filterNullsEmptyObject } from "helpers/filterNullsEmptyObject";
import { filterUnchangedFields } from "helpers/filterUnchangedFields";

import updateListado from "api/listados/updateListado";
import { Listbox } from "components/shared/form/Listbox";
import { replaceImage } from "helpers/updateImageUpload";
import { internalGeneralRisksElements } from "../steps-datos-estudio/estudio-pipc/utils/elementsTask";
import { tiposRiesgosEstudios } from "../utils/types";


const EmpresaStep3 = ({
  setCurrentEmpresaStep,
  setCurrentStep,
  listado,
  empresa
}) => {
  const [isOpen, { open, close }] = useDisclosure(false);
  const [formDataState, setFormDataState] = useState("[waiting]");
  const [errorMessage, setErrorMessage] = useState("");
  const llenarListadoFormCtx = useLlenarListadoFormContext();
  const riskInfoCtx = llenarListadoFormCtx?.state?.stepStatus?.riskInfo;
  const addressInfoCtx = llenarListadoFormCtx?.state?.stepStatus?.addressInfo;
  const companyInfoCtx = llenarListadoFormCtx?.state?.stepStatus?.companyInfo;

  const tiposRiesgos = [
    { id: "ordinario", label: "Ordinario" },
    { id: "alto", label: "Alto" },
    { id: "critico", label: "Critico" },
  ]


  useEffect(() => {
    const sendData = async () => {
      if (formDataState === "[send-data]") {

        const payloadUnchangedFields = {
          companyInfo: filterUnchangedFields(companyInfoCtx, listado.companyInfo),
          addressInfo: filterUnchangedFields(addressInfoCtx, listado.addressInfo),
          riskInfo: filterUnchangedFields(riskInfoCtx, listado.riskInfo),
        };

        const payload = filterNullsEmptyObject(payloadUnchangedFields);

        if (
          payload.companyInfo?.logoUrl ||
          payload.addressInfo?.taxCertificateUrl ||
          payload.addressInfo?.legalRepresentativeSignatureUrl ||
          payload.addressInfo?.legalRepresentativeIneUrl ||
          payload.addressInfo?.propertyBoundariesImageNorth ||
          payload.addressInfo?.propertyBoundariesImageSouth ||
          payload.addressInfo?.propertyBoundariesImageEast ||
          payload.addressInfo?.propertyBoundariesImageWest ||
          payload.riskInfo?.materialsInventoryUrl
        ) {

          // COMPANY → Logo
          if (payload.companyInfo?.logoUrl) {
            payload.companyInfo.logoUrl = await replaceImage({
              previousUrl: listado.companyInfo?.logoUrl,
              newFile: companyInfoCtx.logoUrl,
              folder: "empresa"
            });
          }

          // ADDRESS → Tax Certificate
          if (payload.addressInfo?.taxCertificateUrl) {
            payload.addressInfo.taxCertificateUrl = await replaceImage({
              previousUrl: listado.addressInfo?.taxCertificateUrl,
              newFile: addressInfoCtx.taxCertificateUrl,
              folder: `listado-${listado?._id}`
            });
          }

          // ADDRESS → Firma
          if (payload.addressInfo?.legalRepresentativeSignatureUrl) {
            payload.addressInfo.legalRepresentativeSignatureUrl = await replaceImage({
              previousUrl: listado.addressInfo?.legalRepresentativeSignatureUrl,
              newFile: addressInfoCtx.legalRepresentativeSignatureUrl,
              folder: `listado-${listado?._id}`
            });
          }

          // ADDRESS → INE
          if (payload.addressInfo?.legalRepresentativeIneUrl) {
            payload.addressInfo.legalRepresentativeIneUrl = await replaceImage({
              previousUrl: listado.addressInfo?.legalRepresentativeIneUrl,
              newFile: addressInfoCtx.legalRepresentativeIneUrl,
              folder: `listado-${listado?._id}`
            });
          }

          // ADDRESS → Imagen Colindancia Norte
          if (payload.addressInfo?.propertyBoundariesImageNorth) {
            payload.addressInfo.propertyBoundariesImageNorth = await replaceImage({
              previousUrl: listado.addressInfo?.propertyBoundariesImageNorth,
              newFile: addressInfoCtx.propertyBoundariesImageNorth,
              folder: `listado-${listado?._id}`
            });
          }

          // ADDRESS → Imagen Colindancia Sur
          if (payload.addressInfo?.propertyBoundariesImageSouth) {
            payload.addressInfo.propertyBoundariesImageSouth = await replaceImage({
              previousUrl: listado.addressInfo?.propertyBoundariesImageSouth,
              newFile: addressInfoCtx.propertyBoundariesImageSouth,
              folder: `listado-${listado?._id}`
            });
          }

          // ADDRESS → Imagen Colindancia Este
          if (payload.addressInfo?.propertyBoundariesImageEast) {
            payload.addressInfo.propertyBoundariesImageEast = await replaceImage({
              previousUrl: listado.addressInfo?.propertyBoundariesImageEast,
              newFile: addressInfoCtx.propertyBoundariesImageEast,
              folder: `listado-${listado?._id}`
            });
          }

          // ADDRESS → Imagen Colindancia Oeste
          if (payload.addressInfo?.propertyBoundariesImageWest) {
            payload.addressInfo.propertyBoundariesImageWest = await replaceImage({
              previousUrl: listado.addressInfo?.propertyBoundariesImageWest,
              newFile: addressInfoCtx.propertyBoundariesImageWest,
              folder: `listado-${listado?._id}`
            });
          }

          // RISK → Inventario de materiales
          if (payload.riskInfo?.materialsInventoryUrl) {
            payload.riskInfo.materialsInventoryUrl = await replaceImage({
              previousUrl: listado.riskInfo?.materialsInventoryUrl,
              newFile: riskInfoCtx.materialsInventoryUrl,
              folder: `listado-${listado?._id}`
            });
          }
        }


        // ⬇️ Aquí ya el payload tiene las URLs públicas nuevas
        const listadoUpdated = await updateListado({
          requestBody: { ...payload, listado_id: listado?._id }
        });

        if (!listadoUpdated?.ok) {
          setErrorMessage(listadoUpdated?.message || "Error desconocido al guardar los datos. Verifica los campos e intenta de nuevo.");
          setFormDataState("[error]");
          return;
        }

        setFormDataState("[success]");
      }
    };

    sendData().catch((err) => {
      setErrorMessage(err?.response?.data?.message || err?.message || "Error de conexion. Verifica tu internet e intenta de nuevo.");
      setFormDataState("[error]");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formDataState]);


  // control del formulario
  const {
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(informacionRiesgoSchema),
    defaultValues: riskInfoCtx,
  });

  useEffect(() => {
    if (empresa && listado && riskInfoCtx) {
      reset(resetDataEmpresaStep3({ listado, empresa, riskInfoCtx }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [empresa, reset, listado]);

  const onSubmit = async (data) => {
    llenarListadoFormCtx.dispatch({
      type: "SET_STEP_STATUS",
      payload: {
        riskInfo: {
          ...data,
          isDone: true
        }
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

          {/* 📄 Inventario de recursos materiales */}
          <div className="flex flex-col gap-y-3">
            <div className="flex items-center gap-x-3">
              <label className="input-label">
                <span>Inventario de Recursos Materiales (Ubicación y Condición)</span>
              </label>
              <Controller
                name="materialsInventoryApplies"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center gap-x-2">
                    <span className="text-sm text-gray-400">
                      {field.value ? "Sí aplica" : "No aplica"}
                    </span>
                    <Switch
                      checked={field.value || false}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        field.onChange(checked);
                        llenarListadoFormCtx.dispatch({
                          type: "SET_STEP_STATUS",
                          payload: {
                            riskInfo: {
                              ...riskInfoCtx,
                              materialsInventoryApplies: checked,
                            },
                          },
                        });
                      }}
                    />
                  </div>
                )}
              />
            </div>

            {watch("materialsInventoryApplies") && (
              <Controller
                name="materialsInventoryUrl"
                control={control}
                render={({ field }) => (
                  <CoverImageUpload
                    label=""
                    classNames={{ box: "mt-1.5" }}
                    error={errors?.materialsInventoryUrl?.message}
                    {...field}
                  />
                )}
              />
            )}
          </div>

          {/* 🏢 Datos de empresa y riesgos */}
          <div className="flex flex-col gap-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                name="companyDescription"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Descripción de la Empresa"
                    error={errors?.companyDescription?.message}
                    required
                    placeholder="Escribir Descripción de la Empresa..."
                    onChange={(e) => {
                      field.onChange(e);
                      llenarListadoFormCtx.dispatch({
                        type: "SET_STEP_STATUS",
                        payload: {
                          riskInfo: {
                            ...riskInfoCtx,
                            companyDescription: e.target.value,
                          },
                        },
                      });
                    }}
                  />
                )}
              />

              {/* Tipo de riesgo interno */}
              <Controller
                name="riskType"
                control={control}
                render={({ field }) => (
                  <Listbox
                    label="Tipo de riesgo Interno / Por Entorno *"
                    placeholder="Seleccione tipo de riesgo..."
                    data={tiposRiesgos}
                    displayField="label"
                    value={tiposRiesgos.find((r) => r.id === field.value) || null}
                    onChange={(val) => {
                      field.onChange(val?.id);
                      llenarListadoFormCtx.dispatch({
                        type: "SET_STEP_STATUS",
                        payload: {
                          riskInfo: {
                            ...riskInfoCtx,
                            riskType: val?.id,
                          },
                        },
                      });
                    }}
                    error={errors?.riskType?.message}
                  />
                )}
              />
            </div>

            {/* Antecedentes */}
            <Controller
              name="antecedents"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Antecedentes"
                  error={errors?.antecedents?.message}
                  required
                  placeholder="Escribir Antecedentes..."
                  onChange={(e) => {
                    field.onChange(e);
                    llenarListadoFormCtx.dispatch({
                      type: "SET_STEP_STATUS",
                      payload: {
                        riskInfo: {
                          ...riskInfoCtx,
                          antecedents: e.target.value,
                        },
                      },
                    });
                  }}
                />
              )}
            />
          </div>

          {/* 📅 Calendario */}
          <div className="flex flex-col gap-y-2">
            <label className="input-label">
              <span>Calendario de fechas destinadas al subprograma de prevención de riesgos</span>
              <span className="ml-2 text-error">*</span>
            </label>

            <Controller
              name="preventionCalendarDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  options={{
                    mode: "multiple",
                    dateFormat: "Y-m-d",
                    conjunction: ", ",
                  }}
                  error={errors?.preventionCalendarDate?.message}
                  placeholder="Seleccionar fechas..."
                  onChange={(dates) => {
                    field.onChange(dates);
                    llenarListadoFormCtx.dispatch({
                      type: "SET_STEP_STATUS",
                      payload: {
                        riskInfo: {
                          ...riskInfoCtx,
                          preventionCalendarDate: dates,
                        },
                      },
                    });
                  }}
                />
              )}
            />
          </div>

          {/* ⚠️ Riesgos generales internos - Checklist */}
          <div className="space-y-3">
            <h4 className="text-lg font-medium text-gray-800 dark:text-dark-100">
              Riesgos Generales Internos
            </h4>
            <div className="overflow-x-auto">
              <Table className="w-full text-left rtl:text-right">
                <THead>
                  <Tr className="border-b border-gray-200 dark:border-dark-500">
                    <Th className="w-[5%] text-center">#</Th>
                    <Th className="w-[55%] min-w-[250px] break-words">Elemento a Evaluar</Th>
                    <Th className="w-[10%] text-center">Sí / No</Th>
                    <Th className="w-[30%] text-center">Grado de Riesgo</Th>
                  </Tr>
                </THead>
                <TBody>
                  {internalGeneralRisksElements.map((element, idx) => {
                    const risksArray = watch("internalGeneralRisks") || [];
                    const currentItem = risksArray[idx] || { applies: false, riskLevel: null };
                    return (
                      <Tr key={idx} className="border-b border-gray-200 dark:border-dark-500">
                        <Td className="text-center">{idx + 1}</Td>
                        <Td className="break-words text-[15px]">{element}</Td>
                        <Td className="text-center">
                          <Checkbox
                            color="success"
                            checked={currentItem.applies || false}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              const current = watch("internalGeneralRisks") || internalGeneralRisksElements.map((el) => ({ element: el, applies: false, riskLevel: null }));
                              const updated = [...current];
                              updated[idx] = { ...updated[idx], element, applies: checked };
                              setValue("internalGeneralRisks", updated);
                              llenarListadoFormCtx.dispatch({
                                type: "SET_STEP_STATUS",
                                payload: {
                                  riskInfo: {
                                    ...riskInfoCtx,
                                    internalGeneralRisks: updated,
                                  },
                                },
                              });
                            }}
                          />
                        </Td>
                        <Td className="text-center">
                          <Listbox
                            placeholder="Seleccione..."
                            data={tiposRiesgosEstudios}
                            displayField="label"
                            value={tiposRiesgosEstudios?.find((r) => r.id === currentItem.riskLevel) || null}
                            onChange={(val) => {
                              const current = watch("internalGeneralRisks") || internalGeneralRisksElements.map((el) => ({ element: el, applies: false, riskLevel: null }));
                              const updated = [...current];
                              updated[idx] = { ...updated[idx], element, riskLevel: val?.id ?? null };
                              setValue("internalGeneralRisks", updated);
                              llenarListadoFormCtx.dispatch({
                                type: "SET_STEP_STATUS",
                                payload: {
                                  riskInfo: {
                                    ...riskInfoCtx,
                                    internalGeneralRisks: updated,
                                  },
                                },
                              });
                            }}
                          />
                        </Td>
                      </Tr>
                    );
                  })}
                </TBody>
              </Table>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end space-x-3 pb-4">
          <Button type="button" className="min-w-[7rem]" onClick={() => {
            setCurrentEmpresaStep(1);
            llenarListadoFormCtx.dispatch({
              type: "SET_STEP_STATUS",
              payload: {
                addressInfo: {
                  ...addressInfoCtx,
                  isDone: listado?.addressInfo?.isDone ?? false
                },
                riskInfo: {
                  ...riskInfoCtx,
                  isDone: listado?.riskInfo?.isDone ?? false
                },
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

                      {errorMessage && (
                        <p className="mt-2 text-sm text-gray-500 dark:text-dark-300">
                          {errorMessage}
                        </p>
                      )}

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