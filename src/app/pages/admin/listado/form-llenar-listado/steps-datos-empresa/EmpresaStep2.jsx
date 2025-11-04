import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// Local Imports
import { Badge, Button, Input } from "components/ui";
import { useLlenarListadoFormContext } from "../contexts/LlenarListadoFormContext";
import { informacionDireccionSchema } from "../contexts/schema";

import { CoverImageUpload } from "components/custom-ui/dropzone/CoverImageUpload";
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
                <span>Firma del Representante legal</span>
                <span className="ml-2 text-error">*</span>
              </label>

              <Controller
                name="legalRepresentativeSignatureUrl"
                control={control}
                render={({ field }) => (
                  <CoverImageUpload
                    label=""
                    classNames={{ box: "mt-1.5" }}
                    error={errors?.legalRepresentativeSignatureUrl?.message}
                    {...field}
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

            <Controller
              name="propertyBoundaries"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Colindancias del Inmueble"
                  error={errors?.propertyBoundaries?.message}
                  required
                  placeholder="Escribir colindancias del inmueble..."
                  onChange={(e) => {
                    field.onChange(e);
                    llenarListadoFormCtx.dispatch({
                      type: "SET_STEP_STATUS",
                      payload: {
                        addressInfo: {
                          ...addressInfoCtx,
                          propertyBoundaries: e.target.value,
                        },
                      },
                    });
                  }}
                />
              )}
            />

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
        <Button type="submit" className="min-w-[7rem]" onClick={() => {
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