import { useForm, Controller } from "react-hook-form";
import { Button, Switch, Table, THead, TBody, Th, Tr, Td, Upload, Checkbox } from "components/ui";
import { PlusIcon } from "@heroicons/react/20/solid";
import { useLlenarListadoFormContext } from "../../contexts/LlenarListadoFormContext";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { ObservationModal } from "../../modals/ObservacionesModal";
import { checkIfSectionIsDone } from "../utils/checkIfSectionIsDone";
import { useEffect, useState } from "react";
import { resetDataEstudioStep8 } from "./utils/resetDataEstudioStep8";
import { deepMergeDefaults } from "../../utils/deepMergeDefaultsInfo";
import { externalRiskElements } from "./utils/elementsTask";

import updateListado from "api/listados/updateListado";
import uploadImageWithFirma from "api/upload/uploadImageWithFirma.service";

const sections = [
  { key: "externalRiskElements", label: "Tipo de Riesgo", elements: externalRiskElements },
];

const buildDefaultSection = (elements) =>
  elements.map((element, i) => ({
    _uid: i,
    element: element,
    evidenceUrl: null,
    has_riesgo: false,
    no_aplica: false,
    observations: "",
  }));

const filterForBackend = (item) => {
  const out = { element: item.element };
  if (item.evidenceUrl) out.evidenceUrl = item.evidenceUrl;
  if (typeof item.has_riesgo !== "undefined") out.has_riesgo = item.has_riesgo;
  if (typeof item.no_aplica !== "undefined") out.no_aplica = item.no_aplica;
  if (item.observations) out.observations = item.observations;
  return out;
};

function ObservationCell({ sectionKey, rowIndex, currentValue, handleFieldChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const saveObservation = (newValue) => {
    handleFieldChange(sectionKey, rowIndex, { observations: newValue });
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <PencilSquareIcon className="size-4 mr-1" />
        Comentar
      </Button>

      <ObservationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialValue={currentValue || ""}
        onSave={saveObservation}
      />
    </>
  );
}

const EstudioStep8 = ({ onNext, onPrev, listado }) => {
  const llenarListadoFormCtx = useLlenarListadoFormContext();
  const nonStructuralRisksCtx = llenarListadoFormCtx?.state?.formData?.nonStructuralRisks ?? {};
  const structuralRisksCtx = llenarListadoFormCtx?.state?.formData?.structuralRisks ?? {};
  const serviceInstallationsCtx = llenarListadoFormCtx?.state?.formData?.serviceInstallations ?? {};
  const socioOrganizationalAgentCtx = llenarListadoFormCtx?.state?.formData?.socioOrganizationalAgent ?? {};
  const geologicalAgentCtx = llenarListadoFormCtx?.state?.formData?.geologicalAgent ?? {};
  const physicochemicalAgentCtx = llenarListadoFormCtx?.state?.formData?.physicochemicalAgent ?? {};
  const sanitaryAgentCtx = llenarListadoFormCtx?.state?.formData?.sanitaryAgent ?? {};
  const surroundingRisksCtx = llenarListadoFormCtx?.state?.formData?.surroundingRisks ?? {};

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const defaultValues = {}
  sections.forEach((section) => {
    defaultValues[section.key] =
      Array.isArray(surroundingRisksCtx[section.key]) && surroundingRisksCtx[section.key].length > 0
        ? surroundingRisksCtx[section.key].map((item, i) => ({
          _uid: i,
          element: item.element ?? section.elements[i] ?? `Elemento ${i + 1}`,
          evidenceUrl: item.evidenceUrl ?? null,
          has_riesgo: typeof item.has_riesgo === "boolean" ? item.has_riesgo : false,
          no_aplica: typeof item.no_aplica === "boolean" ? item.no_aplica : false,
          observations: item.observations ?? "",
        }))
        : buildDefaultSection(section.elements);
  });

  const { control, handleSubmit, watch, reset } = useForm({
    defaultValues,
  });

  useEffect(() => {
    if (listado && surroundingRisksCtx) {
      const newData = resetDataEstudioStep8({ listado, surroundingRisksCtx });
      const merged = deepMergeDefaults(defaultValues, newData);
      reset(merged);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset, listado]);


  const handleFieldChange = async (sectionKey, rowIndex, changedFields) => {
    try {
      const backendData = listado?.studyData?.surroundingRisks ?? {};
      const currentArray = watch(sectionKey) || [];
      const updatedArray = [...currentArray];
      updatedArray[rowIndex] = { ...updatedArray[rowIndex], ...changedFields };

      const newSurroundingRisksCtx = {
        ...surroundingRisksCtx,
        [sectionKey]: updatedArray,
      };


      const isDoneSurroundingRisks = checkIfSectionIsDone(newSurroundingRisksCtx, ["observations", "has_riesgo", "no_aplica",], "some");
      llenarListadoFormCtx.dispatch({
        type: "SET_FORM_DATA",
        payload: {
          surroundingRisks: {
            ...newSurroundingRisksCtx,
            isDone: isDoneSurroundingRisks,
          },
        },
      });

      const merged = {
        ...backendData,
        ...newSurroundingRisksCtx,
      };

      const surroundingRisks = Object.fromEntries(
        Object.entries(merged).map(([key, arr]) => [
          key,
          Array.isArray(arr) ? arr.map(filterForBackend) : arr,
        ])
      );

      await updateListado({
        requestBody: {
          listado_id: listado?._id,
          studyData: {
            surroundingRisks: {
              ...surroundingRisks,
              isDone: isDoneSurroundingRisks,
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
                    <Th className="w-[5%] text-center">SIN RIESGO / CON RIESGO</Th>
                    <Th className="w-[5%] text-center">N/A</Th>
                    <Th className="w-[20%] text-center">Observaciones</Th>
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


                      {/* SWITCH (has_riesgo) */}
                      <Td className="text-center ">
                        <Controller
                          name={`${section.key}.${rowIndex}.has_riesgo`}
                          control={control}
                          render={({ field }) => (
                            <Switch
                              checked={field.value}
                              onChange={(event) => {
                                const isChecked = event.target.checked;
                                field.onChange(isChecked);
                                handleFieldChange(section.key, rowIndex, { has_riesgo: isChecked });
                              }}
                            />
                          )}
                        />
                      </Td>

                      {/* === N/A === */}
                      <Td className="text-center">
                        <Controller
                          name={`${section.key}.${rowIndex}.no_aplica`}
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              color="warning"
                              checked={field.value || false}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                field.onChange(checked);
                                handleFieldChange(section.key, rowIndex, { no_aplica: checked });
                              }}
                            />
                          )}
                        />
                      </Td>

                      <Td className="text-center">
                        <ObservationCell
                          sectionKey={section.key}
                          rowIndex={rowIndex}
                          currentValue={row.observations}
                          handleFieldChange={handleFieldChange}
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
                //? Step 1
                nonStructuralRisks: {
                  ...nonStructuralRisksCtx,
                  isDone: listado?.studyData?.nonStructuralRisks?.isDone ?? false,
                },
                //? Step 2
                structuralRisks: {
                  ...structuralRisksCtx,
                  isDone: listado?.studyData?.structuralRisks?.isDone ?? false,
                },
                //? Step 3
                serviceInstallations: {
                  ...serviceInstallationsCtx,
                  isDone: listado?.studyData?.serviceInstallations?.isDone ?? false,
                },
                //? Step 4
                socioOrganizationalAgent: {
                  ...socioOrganizationalAgentCtx,
                  isDone: listado?.studyData?.socioOrganizationalAgent?.isDone ?? false,
                },
                //? Step 5
                geologicalAgent: {
                  ...geologicalAgentCtx,
                  isDone: listado?.studyData?.geologicalAgent?.isDone ?? false,
                },
                //? Step 6
                physicochemicalAgent: {
                  ...physicochemicalAgentCtx,
                  isDone: listado?.studyData?.physicochemicalAgent?.isDone ?? false,
                },
                //? Step 7
                sanitaryAgent: {
                  ...sanitaryAgentCtx,
                  isDone: listado?.studyData?.sanitaryAgent?.isDone ?? false,
                },
                //? Step 8
                surroundingRisks: {
                  ...surroundingRisksCtx,
                  isDone: listado?.studyData?.surroundingRisks?.isDone ?? false,
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

export default EstudioStep8;