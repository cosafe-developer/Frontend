// EstudioStep1.jsx
import { useForm, Controller } from "react-hook-form";
import { Button, Switch, Table, THead, TBody, Th, Tr, Td, Upload } from "components/ui";
import { PlusIcon } from "@heroicons/react/20/solid";
import { useLlenarListadoFormContext } from "../../contexts/LlenarListadoFormContext";
import { Listbox } from "components/shared/form/Listbox";
import { tiposRiesgosEstudios } from "../../utils/types";
import { useEffect } from "react";
import { resetDataEstudioStep5 } from "./utils/resetDataEstudioStep5";
import { deepMergeDefaults } from "../../utils/deepMergeDefaultsInfo";
import { geologicalDisruptionsElements, seismicEventsElements, volcanismElements } from "./utils/elementsTask";

import updateListado from "api/listados/updateListado";
import uploadImageWithFirma from "api/upload/uploadImageWithFirma.service";


const sections = [
  { key: "geologicalDisruptions", label: "Agente perturbardor geologico", elements: geologicalDisruptionsElements },
  { key: "seismicEvents", label: "Sismo", elements: seismicEventsElements },
  { key: "volcanism", label: "Vulcanismo", elements: volcanismElements },
];

const buildDefaultSection = (elements) =>
  elements.map((el, i) => ({
    _uid: i,
    element: el,
    evidenceUrl: null,
    applies: false,
    riskLevel: null,
  }));

const filterForBackend = (item) => {
  // Siempre mandar element para identificar el ítem
  const out = { element: item.element };

  // Incluye solo las propiedades que tienen valor (null/undefined NO se mandan)
  if (typeof item.applies !== "undefined") out.applies = item.applies;
  if (item.evidenceUrl) out.evidenceUrl = item.evidenceUrl;
  if (item.riskLevel) out.riskLevel = item.riskLevel;

  return out;
};

const EstudioStep5 = ({ onNext, onPrev, listado }) => {
  const llenarListadoFormCtx = useLlenarListadoFormContext();
  const geologicalAgentCtx = llenarListadoFormCtx?.state?.formData?.geologicalAgent ?? {};
  const socioOrganizationalAgentCtx = llenarListadoFormCtx?.state?.formData?.socioOrganizationalAgent ?? {};
  const serviceInstallationsCtx = llenarListadoFormCtx?.state?.formData?.serviceInstallations ?? {};
  const structuralRisksCtx = llenarListadoFormCtx?.state?.formData?.structuralRisks ?? {};

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const defaultValues = {}

  sections.forEach((section) => {
    defaultValues[section.key] =
      geologicalAgentCtx[section.key] && Array.isArray(geologicalAgentCtx[section.key])
        ?
        geologicalAgentCtx[section.key].map((it, i) => ({
          _uid: i,
          element: it.element ?? section.elements[i] ?? `Elemento ${i + 1}`,
          evidenceUrl: it.evidenceUrl ?? null,
          applies: typeof it.applies === "boolean" ? it.applies : false,
          riskLevel: it.riskLevel ?? null,
        }))
        : buildDefaultSection(section.elements);
  });

  const { control, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues,
  });

  useEffect(() => {
    if (listado && geologicalAgentCtx) {
      const newData = resetDataEstudioStep5({ listado, geologicalAgentCtx });
      const merged = deepMergeDefaults(defaultValues, newData);
      reset(merged);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset, listado]);


  const handleFieldChange = async (sectionKey, rowIndex, changedFields) => {
    try {
      const currentArray = watch(sectionKey) || [];
      const updatedArray = [...currentArray];
      updatedArray[rowIndex] = { ...updatedArray[rowIndex], ...changedFields };

      setValue(sectionKey, updatedArray);

      llenarListadoFormCtx.dispatch({
        type: "SET_FORM_DATA",
        payload: {
          nonStructuralRisks: {
            ...geologicalAgentCtx,
            [sectionKey]: updatedArray,
          },
        },
      });

      const backendData = listado?.studyData?.nonStructuralRisks ?? {};

      const merged = {
        ...backendData,
        ...geologicalAgentCtx,
        [sectionKey]: updatedArray,
      };


      const structuredNonRisks = Object.fromEntries(
        Object.entries(merged).map(([key, arr]) => [
          key,
          Array.isArray(arr) ? arr.map(filterForBackend) : arr,
        ])
      );


      await updateListado({
        requestBody: {
          listado_id: listado?._id,
          studyData: {
            nonStructuralRisks: structuredNonRisks,
          },
        },
      });
    } catch (err) {
      console.error("Error al actualizar campo de estudio:", err);
    }
  };

  const onSubmit = async () => {
    try {


      onNext();
    } catch (error) {
      console.error("Error al enviar estudio paso 1:", error);
    }
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex grow flex-col space-y-8">
      {sections.map((section) => {
        const rows = watch(section.key) || [];
        return (
          <div key={section.key} className="space-y-3">
            <h3 className="text-lg font-medium text-white">{section.label}</h3>
            <div className="overflow-x-auto">
              <Table className="w-full text-left rtl:text-right">
                <THead>
                  <Tr className="border-b border-gray-200 dark:border-dark-500">
                    <Th className="w-[5%] text-center">#</Th>
                    <Th className="w-[45%] min-w-[250px] break-words">Elemento a Evaluar</Th>
                    <Th className="w-[20%] text-center">Evidencia</Th>
                    <Th className="w-[10%] text-center">No / Sí</Th>
                    <Th className="w-[20%] text-center">Grado de Riesgo</Th>
                  </Tr>
                </THead>

                <TBody>
                  {rows.map((row, rowIndex) => (
                    <Tr key={row._uid ?? rowIndex} className="border-b border-gray-200 dark:border-dark-500">
                      <Td>{rowIndex + 1}</Td>
                      <Td className="break-words  text-[15px]">{row.element}</Td>

                      {/* EVIDENCIA */}
                      <Td className="text-center">
                        <Upload
                          onChange={async (file) => {
                            const url = await uploadImageWithFirma(file);
                            await handleFieldChange(section.key, rowIndex, { evidenceUrl: url });
                          }}
                        >
                          {({ ...props }) => (
                            <Button color="primary" {...props}>
                              <PlusIcon className="size-5" />
                              Subir Evidencia
                            </Button>
                          )}
                        </Upload>

                        {row.evidenceUrl ? (
                          <div className="mt-1 text-xs">
                            <a className="underline" href={row.evidenceUrl} target="_blank" rel="noreferrer">Ver evidencia</a>
                          </div>
                        ) : null}
                      </Td>

                      {/* SWITCH (applies) */}
                      <Td className="text-center ">
                        <Controller
                          name={`${section.key}.${rowIndex}.applies`}
                          control={control}
                          render={({ field }) => (
                            <Switch
                              checked={field.value}
                              onChange={(event) => {
                                const isChecked = event.target.checked;
                                field.onChange(isChecked);
                                handleFieldChange(section.key, rowIndex, { applies: isChecked });
                              }}
                            />
                          )}
                        />
                      </Td>

                      {/* RISK LEVEL */}
                      <Td className="text-center ">
                        <Controller
                          name={`${section.key}.${rowIndex}.riskLevel`}
                          control={control}
                          render={({ field }) => (
                            <Listbox
                              placeholder="Seleccione tipo de riesgo..."
                              data={tiposRiesgosEstudios}
                              displayField="label"
                              value={tiposRiesgosEstudios?.find((r) => r.id === field.value) || null}
                              onChange={(val) => {
                                field.onChange(val?.id ?? null);
                                handleFieldChange(section.key, rowIndex, { riskLevel: val?.id ?? null });
                              }}
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
        );
      })}

      <div className="flex justify-end pt-4 space-x-3">
        <Button
          type="button"
          className="min-w-[7rem]"
          onClick={() => {
            llenarListadoFormCtx.dispatch({
              type: "SET_STEP_STATUS",
              payload: {
                geologicalAgent: {
                  ...geologicalAgentCtx,
                  isDone: listado?.studyData?.geologicalAgent?.isDone ?? false,
                },
                socioOrganizationalAgent: {
                  ...socioOrganizationalAgentCtx,
                  isDone: listado?.studyData?.socioOrganizationalAgent?.isDone ?? false,
                },
                structuralRisks: {
                  ...structuralRisksCtx,
                  isDone: listado?.studyData?.structuralRisks?.isDone ?? false,
                },
                serviceInstallations: {
                  ...serviceInstallationsCtx,
                  isDone: listado?.studyData?.serviceInstallations?.isDone ?? false,
                },
              },
            });

            onPrev()
          }}
        >
          Atrás
        </Button>

        <Button type="submit" color="primary" className="min-w-[7rem]">
          Siguiente
        </Button>
      </div>
    </form>
  );
};

export default EstudioStep5;