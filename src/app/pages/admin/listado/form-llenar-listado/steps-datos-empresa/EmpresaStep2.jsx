import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// Local Imports
import { Badge, Button, Input, Table, THead, TBody, Th, Tr, Td } from "components/ui";
import { useLlenarListadoFormContext } from "../contexts/LlenarListadoFormContext";
import { informacionDireccionSchema } from "../contexts/schema";

import { CoverImageUpload } from "components/custom-ui/dropzone/CoverImageUpload";
import SignaturePad from "components/custom-ui/signature/SignaturePad";
import { useEffect, useState } from "react";
import { resetDataEmpresaStep2 } from "./utils/resetDataEmpresaStep2";

const EmpresaStep2 = ({
  setCurrentEmpresaStep,
  listado,
  empresa
}) => {
  const llenarListadoFormCtx = useLlenarListadoFormContext();
  const addressInfoCtx = llenarListadoFormCtx?.state?.stepStatus?.addressInfo;
  const [inputValue, setInputValue] = useState("");

  // control del formulario
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(informacionDireccionSchema),
    defaultValues: addressInfoCtx
  });

  useEffect(() => {
    if (empresa && listado && addressInfoCtx) {
      reset(resetDataEmpresaStep2({ listado, empresa, addressInfoCtx }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [empresa, reset, listado]);

  const onSubmit = (data) => {
    llenarListadoFormCtx.dispatch({
      type: "SET_STEP_STATUS",
      payload: {
        addressInfo: {
          ...data,
          isDone: true
        },
      },
    });

    setCurrentEmpresaStep(2);
  };


  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
      className="flex grow flex-col"
    >
      <div className="grow space-y-8">
        <div className="flex flex-col gap-y-1.5">
          <label className="input-label">
            <span>Constancia Situación Fiscal</span>
            <span className="ml-2 text-error">*</span>
          </label>

          <Controller
            name="taxCertificateUrl"
            control={control}
            render={({ field }) => (
              <CoverImageUpload
                label=""
                classNames={{ box: "mt-1.5" }}
                error={errors?.taxCertificateUrl?.message}
                {...field}
              />
            )}
          />
        </div>

        {/* DATOS DE LA EMPRESA */}
        <div>
          <h4 className="text-lg font-medium text-gray-800 dark:text-dark-100">
            Datos de la Empresa
          </h4>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Controller
              name="activities"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Actividades de la Empresa"
                  error={errors?.activities?.message}
                  required
                  placeholder="Escribir Actividades de la Empresa..."
                  onChange={(e) => {
                    field.onChange(e);
                    llenarListadoFormCtx.dispatch({
                      type: "SET_STEP_STATUS",
                      payload: {
                        addressInfo: {
                          ...addressInfoCtx,
                          activities: e.target.value,
                        },
                      },
                    });
                  }}
                />
              )}
            />

            <Controller
              name="businessTurn"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Giro Empresarial"
                  error={errors?.businessTurn?.message}
                  required
                  placeholder="Escribir Giro Empresarial..."
                  onChange={(e) => {
                    field.onChange(e);
                    llenarListadoFormCtx.dispatch({
                      type: "SET_STEP_STATUS",
                      payload: {
                        addressInfo: {
                          ...addressInfoCtx,
                          businessTurn: e.target.value,
                        },
                      },
                    });
                  }}
                />
              )}
            />

            <Controller
              name="propertyResponsibleName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Nombre del Responsable del Inmueble"
                  error={errors?.propertyResponsibleName?.message}
                  required
                  placeholder="Escribir Responsable del Inmueble..."
                  onChange={(e) => {
                    field.onChange(e);
                    llenarListadoFormCtx.dispatch({
                      type: "SET_STEP_STATUS",
                      payload: {
                        addressInfo: {
                          ...addressInfoCtx,
                          propertyResponsibleName: e.target.value,
                        },
                      },
                    });
                  }}
                />
              )}
            />

            <Controller
              name="propertyResponsiblePosition"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Cargo del Responsable del Inmueble"
                  error={errors?.propertyResponsiblePosition?.message}
                  required
                  placeholder="Escribir Cargo del Responsable..."
                  onChange={(e) => {
                    field.onChange(e);
                    llenarListadoFormCtx.dispatch({
                      type: "SET_STEP_STATUS",
                      payload: {
                        addressInfo: {
                          ...addressInfoCtx,
                          propertyResponsiblePosition: e.target.value,
                        },
                      },
                    });
                  }}
                />
              )}
            />
          </div>
        </div>

        {/* DATOS DEL REPRESENTANTE LEGAL */}
        <div>
          <h4 className="text-lg font-medium text-gray-800 dark:text-dark-100">
            Datos del Representante Legal
          </h4>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Controller
              name="legalRepresentativeName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Nombre del Representante Legal"
                  error={errors?.legalRepresentativeName?.message}
                  required
                  placeholder="Escribir el Representante Legal..."
                  onChange={(e) => {
                    field.onChange(e);
                    llenarListadoFormCtx.dispatch({
                      type: "SET_STEP_STATUS",
                      payload: {
                        addressInfo: {
                          ...addressInfoCtx,
                          legalRepresentativeName: e.target.value,
                        },
                      },
                    });
                  }}
                />
              )}
            />

            <Controller
              name="legalRepresentativePosition"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Cargo del Representante Legal"
                  error={errors?.legalRepresentativePosition?.message}
                  required
                  placeholder="Escribir el Cargo del Representante..."
                  onChange={(e) => {
                    field.onChange(e);
                    llenarListadoFormCtx.dispatch({
                      type: "SET_STEP_STATUS",
                      payload: {
                        addressInfo: {
                          ...addressInfoCtx,
                          legalRepresentativePosition: e.target.value,
                        },
                      },
                    });
                  }}
                />
              )}
            />

            <div className="flex flex-col gap-y-1.5">
              <label className="input-label">
                <span>Firma del Representante legal (opcional)</span>
              </label>

              <Controller
                name="legalRepresentativeSignatureUrl"
                control={control}
                render={({ field }) => (
                  <SignaturePad
                    value={field.value}
                    onChange={(val) => {
                      field.onChange(val);
                      llenarListadoFormCtx.dispatch({
                        type: "SET_STEP_STATUS",
                        payload: {
                          addressInfo: {
                            ...addressInfoCtx,
                            legalRepresentativeSignatureUrl: val,
                          },
                        },
                      });
                    }}
                    error={errors?.legalRepresentativeSignatureUrl?.message}
                  />
                )}
              />
            </div>

            <div className="flex flex-col gap-y-1.5">
              <label className="input-label">
                <span>Ine del Representante legal</span>
                <span className="ml-2 text-error">*</span>
              </label>

              <Controller
                name="legalRepresentativeIneUrl"
                control={control}
                render={({ field }) => (
                  <CoverImageUpload
                    label=""
                    classNames={{ box: "mt-1.5" }}
                    error={errors?.legalRepresentativeIneUrl?.message}
                    {...field}
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* DATOS DEL DOMICILIO */}
        <div>
          <h4 className="text-lg font-medium text-gray-800 dark:text-dark-100">
            Datos del Domicilio
          </h4>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Controller
              name="landAreaM2"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Superficie del Terreno (m²)"
                  type="number"
                  error={errors?.landAreaM2?.message}
                  required
                  placeholder="Ingresar superficie del terreno..."
                  onChange={(e) => {
                    field.onChange(e);
                    llenarListadoFormCtx.dispatch({
                      type: "SET_STEP_STATUS",
                      payload: {
                        addressInfo: {
                          ...addressInfoCtx,
                          landAreaM2: e.target.value,
                        },
                      },
                    });
                  }}
                />
              )}
            />

            <Controller
              name="builtAreaM2"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Superficie Construida (m²)"
                  type="number"
                  error={errors?.builtAreaM2?.message}
                  required
                  placeholder="Ingresar superficie construida..."
                  onChange={(e) => {
                    field.onChange(e);
                    llenarListadoFormCtx.dispatch({
                      type: "SET_STEP_STATUS",
                      payload: {
                        addressInfo: {
                          ...addressInfoCtx,
                          builtAreaM2: e.target.value,
                        },
                      },
                    });
                  }}
                />
              )}
            />

            <Controller
              name="fixedPopulation"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Población Fija"
                  type="number"
                  error={errors?.fixedPopulation?.message}
                  required
                  placeholder="Escribir cantidad de población fija..."
                  onChange={(e) => {
                    field.onChange(e);
                    llenarListadoFormCtx.dispatch({
                      type: "SET_STEP_STATUS",
                      payload: {
                        addressInfo: {
                          ...addressInfoCtx,
                          fixedPopulation: e.target.value,
                        },
                      },
                    });
                  }}
                />
              )}
            />

            <Controller
              name="floatingPopulation"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Población Flotante"
                  type="number"
                  error={errors?.floatingPopulation?.message}
                  required
                  placeholder="Escribir cantidad de población flotante..."
                  onChange={(e) => {
                    field.onChange(e);
                    llenarListadoFormCtx.dispatch({
                      type: "SET_STEP_STATUS",
                      payload: {
                        addressInfo: {
                          ...addressInfoCtx,
                          floatingPopulation: e.target.value,
                        },
                      },
                    });
                  }}
                />
              )}
            />

            <div className="sm:col-span-2">
              <label className="block mb-2 text-sm font-medium text-[#A7AAB4]">
                Colindancias del Inmueble <span className="text-error">*</span>
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <Controller
                  name="propertyBoundariesNorth"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Norte"
                      error={errors?.propertyBoundariesNorth?.message}
                      required
                      placeholder="Colindancia al Norte..."
                      onChange={(e) => {
                        field.onChange(e);
                        llenarListadoFormCtx.dispatch({
                          type: "SET_STEP_STATUS",
                          payload: {
                            addressInfo: {
                              ...addressInfoCtx,
                              propertyBoundariesNorth: e.target.value,
                            },
                          },
                        });
                      }}
                    />
                  )}
                />
                <Controller
                  name="propertyBoundariesSouth"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Sur"
                      error={errors?.propertyBoundariesSouth?.message}
                      required
                      placeholder="Colindancia al Sur..."
                      onChange={(e) => {
                        field.onChange(e);
                        llenarListadoFormCtx.dispatch({
                          type: "SET_STEP_STATUS",
                          payload: {
                            addressInfo: {
                              ...addressInfoCtx,
                              propertyBoundariesSouth: e.target.value,
                            },
                          },
                        });
                      }}
                    />
                  )}
                />
                <Controller
                  name="propertyBoundariesEast"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Este"
                      error={errors?.propertyBoundariesEast?.message}
                      required
                      placeholder="Colindancia al Este..."
                      onChange={(e) => {
                        field.onChange(e);
                        llenarListadoFormCtx.dispatch({
                          type: "SET_STEP_STATUS",
                          payload: {
                            addressInfo: {
                              ...addressInfoCtx,
                              propertyBoundariesEast: e.target.value,
                            },
                          },
                        });
                      }}
                    />
                  )}
                />
                <Controller
                  name="propertyBoundariesWest"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Oeste"
                      error={errors?.propertyBoundariesWest?.message}
                      required
                      placeholder="Colindancia al Oeste..."
                      onChange={(e) => {
                        field.onChange(e);
                        llenarListadoFormCtx.dispatch({
                          type: "SET_STEP_STATUS",
                          payload: {
                            addressInfo: {
                              ...addressInfoCtx,
                              propertyBoundariesWest: e.target.value,
                            },
                          },
                        });
                      }}
                    />
                  )}
                />
              </div>

              <div className="mt-3">
                <label className="block mb-2 text-sm font-medium text-[#A7AAB4]">
                  Imagen de referencia de colindancias <span className="text-error">*</span>
                </label>
                <div className="overflow-x-auto">
                  <Table className="w-full text-left rtl:text-right">
                    <THead>
                      <Tr className="border-b border-gray-200 dark:border-dark-500">
                        <Th className="w-[5%] text-center">#</Th>
                        <Th className="w-[40%]">Elementos a evaluar</Th>
                        <Th className="w-[55%] text-center">Evidencia</Th>
                      </Tr>
                    </THead>
                    <TBody>
                      {[
                        { index: 1, label: "Norte", name: "propertyBoundariesImageNorth" },
                        { index: 2, label: "Sur", name: "propertyBoundariesImageSouth" },
                        { index: 3, label: "Este", name: "propertyBoundariesImageEast" },
                        { index: 4, label: "Oeste", name: "propertyBoundariesImageWest" },
                      ].map((dir) => (
                        <Tr key={dir.name} className="border-b border-gray-200 dark:border-dark-500">
                          <Td className="text-center">{dir.index}</Td>
                          <Td>{dir.label}</Td>
                          <Td className="text-center">
                            <Controller
                              name={dir.name}
                              control={control}
                              render={({ field }) => (
                                <CoverImageUpload
                                  label=""
                                  classNames={{ box: "mt-1.5" }}
                                  {...field}
                                  onChange={(value) => {
                                    field.onChange(value);
                                    llenarListadoFormCtx.dispatch({
                                      type: "SET_STEP_STATUS",
                                      payload: {
                                        addressInfo: {
                                          ...addressInfoCtx,
                                          [dir.name]: value,
                                        },
                                      },
                                    });
                                  }}
                                  error={errors[dir.name]?.message}
                                />
                              )}
                            />
                          </Td>
                        </Tr>
                      ))}
                    </TBody>
                  </Table>
                </div>
              </div>
            </div>

            <Controller
              name="internalAreas"
              control={control}
              defaultValue={[]}
              rules={{ required: "Agrega al menos un área interna" }}
              render={({ field }) => {
                const handleAddArea = () => {
                  const trimmed = inputValue.trim();
                  if (!trimmed) return;
                  if (field.value.includes(trimmed)) return;
                  field.onChange([...field.value, trimmed]);
                  setInputValue("");
                  llenarListadoFormCtx.dispatch({
                    type: "SET_STEP_STATUS",
                    payload: {
                      addressInfo: {
                        ...addressInfoCtx,
                        internalAreas: [...field.value, trimmed],
                      },
                    },
                  });
                };

                const handleRemoveArea = (area) => {
                  const updated = field.value.filter((a) => a !== area);
                  field.onChange(updated);
                  llenarListadoFormCtx.dispatch({
                    type: "SET_STEP_STATUS",
                    payload: {
                      addressInfo: {
                        ...addressInfoCtx,
                        internalAreas: updated,
                      },
                    },
                  });
                };

                const handleKeyDown = (e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddArea();
                  }
                };

                return (
                  <div>
                    <label className="block mb-2 text-sm font-medium text-[#A7AAB4]">
                      Áreas que se encuentran dentro del Inmueble
                    </label>

                    <div className="flex items-center gap-2 mb-3">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Escribir área interna y presionar Enter..."
                        className="flex-1 rounded-lg border border-gray-600 bg-transparent px-3 py-2 text-sm text-white placeholder-[#989BA3] focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <Button
                        type="button"
                        onClick={handleAddArea}
                        color="success"
                        size="sm"
                        className="min-w-[80px]"
                      >
                        Agregar
                      </Button>
                    </div>

                    {field.value.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {field.value.map((area) => (
                          <Badge
                            key={area}
                            color="info"
                            variant="soft"
                            className="rounded-full capitalize px-4 text-sm py-2 flex items-center gap-2 border border-gray-500/60"
                          >
                            {area}
                            <button
                              type="button"
                              onClick={() => handleRemoveArea(area)}
                              className="text-xs text-red-400 hover:text-red-600"
                            >
                              ✕
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}

                    {errors?.internalAreas?.message && (
                      <p className="mt-2 text-sm text-red-400">{errors.internalAreas.message}</p>
                    )}
                  </div>
                );
              }}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end space-x-3 pb-4">
        <Button type="button" className="min-w-[7rem]" onClick={() => {
          setCurrentEmpresaStep(0);
          llenarListadoFormCtx.dispatch({
            type: "SET_STEP_STATUS",
            payload: {
              addressInfo: {
                ...addressInfoCtx,
                isDone: listado?.addressInfo?.isDone ?? false
              }
            },
          });
        }}>
          Atrás
        </Button>
        <Button type="submit" className="min-w-[7rem]" color="primary">
          Siguiente
        </Button>
      </div>
    </form>
  );
};

export default EmpresaStep2;