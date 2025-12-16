import { useForm, Controller } from "react-hook-form";
import { Button, Switch, Table, THead, TBody, Th, Tr, Td } from "components/ui";
import { useLlenarListadoFormContext } from "../../contexts/LlenarListadoFormContext";
import { Listbox } from "components/shared/form/Listbox";
import { tiposRiesgosEstudios } from "../../utils/types";
import { useEffect } from "react";
import { resetDataEstudioStep1 } from "./utils/resetDataEstudioStep1";
import { deepMergeDefaults } from "../../utils/deepMergeDefaultsInfo";
import { evacuationBlockingObjects, fallingObjects, flammableObjects, overturningObjects, slidingObjects } from "./utils/elementsTask";
import { checkIfSectionIsDone } from "../utils/checkIfSectionIsDone";
import { replaceImage } from "helpers/updateImageUpload";

import updateListado from "api/listados/updateListado";
import EvidenceUpload from "components/custom-ui/upload-button/EvidenceUpload.component";



const sections = [
  { key: "fallingObjects", label: "Objetos que se pueden caer", elements: fallingObjects },
  { key: "slidingObjects", label: "Objetos que puedan deslizarse", elements: slidingObjects },
  { key: "overturningObjects", label: "Objetos que puedan volcarse", elements: overturningObjects },
  { key: "flammableObjects", label: "Objetos que puedan inflamarse", elements: flammableObjects },
  { key: "evacuationBlockingObjects", label: "Objetos que puedan entorpecer la evacuación", elements: evacuationBlockingObjects },
];


const buildDefaultSection = (elements) =>
  elements.map((el, i) => ({
    _uid: i,
    element: el,
    evidenceUrl: null,
    localPreview: null,
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

const EstudioStep1 = ({ onNext, listado }) => {
  const llenarListadoFormCtx = useLlenarListadoFormContext();
  //? Step 1 -> Actual
  const nonStructuralRisksCtx = llenarListadoFormCtx?.state?.formData?.nonStructuralRisks ?? {};


  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const defaultValues = {}

  sections.forEach((section) => {
    defaultValues[section.key] =
      nonStructuralRisksCtx[section.key] && Array.isArray(nonStructuralRisksCtx[section.key])
        ?
        nonStructuralRisksCtx[section.key].map((it, i) => ({
          _uid: i,
          element: it.element ?? section.elements[i] ?? `Elemento ${i + 1}`,
          evidenceUrl: it.evidenceUrl ?? null,
          localPreview: null,
          applies: typeof it.applies === "boolean" ? it.applies : false,
          riskLevel: it.riskLevel ?? null,
        }))
        : buildDefaultSection(section.elements);
  });

  const { control, handleSubmit, watch, reset } = useForm({
    defaultValues,
  });


  useEffect(() => {
    if (listado) {
      const newData = resetDataEstudioStep1({ listado, nonStructuralRisksCtx });
      const merged = deepMergeDefaults(defaultValues, newData);


      reset(merged);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listado, reset]);


  const handleFieldChange = async (sectionKey, rowIndex, changedFields) => {
    try {
      const backendData = listado?.studyData?.nonStructuralRisks ?? {};
      const currentArray = watch(sectionKey) || [];
      const updatedArray = [...currentArray];
      updatedArray[rowIndex] = { ...updatedArray[rowIndex], ...changedFields };

      const newNonStructuralRisks = {
        ...nonStructuralRisksCtx,
        [sectionKey]: updatedArray,
      };

      const isDoneNonStructural = checkIfSectionIsDone(newNonStructuralRisks, ["riskLevel"]);

      llenarListadoFormCtx.dispatch({
        type: "SET_FORM_DATA",
        payload: {
          nonStructuralRisks: {
            ...newNonStructuralRisks,
            isDone: isDoneNonStructural,
          },
        },
      });

      const merged = {
        ...backendData,
        ...newNonStructuralRisks,
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
            nonStructuralRisks: {
              ...structuredNonRisks,
              isDone: isDoneNonStructural,
            },
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
                        <EvidenceUpload
                          value={row.evidenceUrl}
                          onChange={async (file) => {
                            await handleFieldChange(section.key, rowIndex, { evidenceUrl: file });

                            const url = await replaceImage({
                              previousUrl: row?.evidenceUrl,
                              newFile: file,
                              folder: `listado-formulario-${listado?._id}`,
                            });

                            await handleFieldChange(section.key, rowIndex, {
                              evidenceUrl: url,
                            });
                          }}
                          onRemove={() =>
                            handleFieldChange(section.key, rowIndex, { evidenceUrl: null })
                          }
                        />
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

      <div className="flex justify-end pt-4">
        <Button type="submit" color="primary" className="min-w-[7rem]">
          Siguiente
        </Button>
      </div>
    </form>
  );
};

export default EstudioStep1;