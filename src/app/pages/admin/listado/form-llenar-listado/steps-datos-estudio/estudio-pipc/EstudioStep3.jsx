import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  Switch,
  Table,
  THead,
  TBody,
  Th,
  Tr,
  Td,
  Upload,
  Checkbox,
} from "components/ui";
import { PlusIcon, CheckIcon } from "@heroicons/react/20/solid";
import { useLlenarListadoFormContext } from "../../contexts/LlenarListadoFormContext";
import { checkIfSectionIsDone } from "../utils/checkIfSectionIsDone";
import { deepMergeDefaults } from "../../utils/deepMergeDefaultsInfo";
import { resetDataEstudioStep3 } from "./utils/resetDataEstudioStep3";
import {
  airConditioningInstallationElements,
  electricalInstallationElements,
  externalRisksElements,
  gasInstallationElements,
  hydraulicInstallationElements,
} from "./utils/elementsTask";
import updateListado from "api/listados/updateListado";
import uploadImageWithFirma from "api/upload/uploadImageWithFirma.service";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { ObservationModal } from "../../modals/ObservacionesModal";

const sections = [
  { key: "hydraulicInstallation", label: "Instalación Hidráulica", elements: hydraulicInstallationElements },
  { key: "gasInstallation", label: "Instalación de Gas", elements: gasInstallationElements },
  { key: "electricalInstallation", label: "Instalación Eléctrica", elements: electricalInstallationElements },
  { key: "airConditioningInstallation", label: "Instalación de Aire Acondicionado", elements: airConditioningInstallationElements },
  { key: "externalRisks", label: "Riesgos externos", elements: externalRisksElements },
];

const buildDefaultSection = (elements) =>
  elements.map((element, i) => ({
    _uid: i,
    element: element,
    evidenceUrl: null,
    applies: false,
    no_aplica: false,
    distancia_aproximada: null,
    observations: "",
  }));

const filterForBackend = (item) => {
  const out = { element: item.element };
  if (typeof item.applies !== "undefined") out.applies = item.applies;
  if (item.evidenceUrl) out.evidenceUrl = item.evidenceUrl;
  if (typeof item.no_aplica !== "undefined") out.no_aplica = item.no_aplica;
  if (item.distancia_aproximada) out.distancia_aproximada = item.distancia_aproximada;
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

const EstudioStep3 = ({ onNext, onPrev, listado }) => {
  const llenarListadoFormCtx = useLlenarListadoFormContext();
  const nonStructuralRisksCtx = llenarListadoFormCtx?.state?.formData?.nonStructuralRisks ?? {};
  const structuralRisksCtx = llenarListadoFormCtx?.state?.formData?.structuralRisks ?? {};
  const serviceInstallationsCtx = llenarListadoFormCtx?.state?.formData?.serviceInstallations ?? {};
  const [focusedInput, setFocusedInput] = useState({ section: null, row: null });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const defaultValues = {};
  sections.forEach((section) => {
    defaultValues[section.key] =
      Array.isArray(serviceInstallationsCtx[section.key]) && serviceInstallationsCtx[section.key].length > 0
        ? serviceInstallationsCtx[section.key].map((item, i) => ({
          _uid: i,
          element: item.element ?? section.elements[i] ?? `Elemento ${i + 1}`,
          evidenceUrl: item.evidenceUrl ?? null,
          applies: typeof item.applies === "boolean" ? item.applies : false,
          no_aplica: typeof item.no_aplica === "boolean" ? item.no_aplica : false,
          distancia_aproximada: item.distancia_aproximada ?? null,
          observations: item.observations ?? "",
        }))
        : buildDefaultSection(section.elements);
  });

  const { control, handleSubmit, watch, reset } = useForm({ defaultValues });

  useEffect(() => {
    if (listado && serviceInstallationsCtx) {
      const newData = resetDataEstudioStep3({ listado, serviceInstallationsCtx });
      const merged = deepMergeDefaults(defaultValues, newData);
      reset(merged);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset, listado]);

  const handleFieldChange = async (sectionKey, rowIndex, changedFields) => {
    try {
      const backendData = listado?.studyData?.serviceInstallations ?? {};
      const currentArray = watch(sectionKey) || [];
      const updatedArray = [...currentArray];
      updatedArray[rowIndex] = { ...updatedArray[rowIndex], ...changedFields };

      const newServiceInstallations = {
        ...serviceInstallationsCtx,
        [sectionKey]: updatedArray,
      };


      const isDoneServiceInstallations = checkIfSectionIsDone(newServiceInstallations, ["observations", "applies", "no_aplica", "distancia_aproximada",], "some");
      llenarListadoFormCtx.dispatch({
        type: "SET_FORM_DATA",
        payload: {
          serviceInstallations: {
            ...newServiceInstallations,
            isDone: isDoneServiceInstallations,
          },
        },
      });

      const merged = {
        ...backendData,
        ...newServiceInstallations,
      };

      const serviceInstallations = Object.fromEntries(
        Object.entries(merged).map(([key, arr]) => [
          key,
          Array.isArray(arr) ? arr.map(filterForBackend) : arr,
        ])
      );

      await updateListado({
        requestBody: {
          listado_id: listado?._id,
          studyData: {
            serviceInstallations: {
              ...serviceInstallations,
              isDone: isDoneServiceInstallations,
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
      console.error("Error al enviar estudio paso 3:", error);
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
                    <Th className="w-[5%] text-center">No / Sí</Th>
                    <Th className="w-[5%] text-center">N/A</Th>
                    <Th className="w-[20%] text-center">
                      {section.key === "externalRisks" ? "Distancia aproximada" : "Observaciones"}
                    </Th>
                  </Tr>
                </THead>

                <TBody>
                  {rows.map((row, rowIndex) => (
                    <Tr key={row._uid ?? rowIndex} className="border-b border-gray-200 dark:border-dark-500">
                      <Td>{rowIndex + 1}</Td>
                      <Td className="break-words text-[15px]">{row.element}</Td>

                      {/* === EVIDENCIA === */}
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
                            <a className="underline" href={row.evidenceUrl} target="_blank" rel="noreferrer">
                              Ver evidencia
                            </a>
                          </div>
                        ) : null}
                      </Td>

                      {/* === SWITCH (applies) === */}
                      <Td className="text-center">
                        <Controller
                          name={`${section.key}.${rowIndex}.applies`}
                          control={control}
                          render={({ field }) => (
                            <Switch
                              checked={field.value}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                field.onChange(checked);
                                handleFieldChange(section.key, rowIndex, { applies: checked });
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
                        {section.key === "externalRisks" ? (
                          <Controller
                            name={`${section.key}.${rowIndex}.distancia_aproximada`}
                            control={control}
                            render={({ field }) => {


                              const isFocused =
                                focusedInput.section === section.key && focusedInput.row === rowIndex;


                              return (
                                <div className="flex items-center text-center justify-center space-x-1">
                                  <input
                                    type="number"
                                    min={0}
                                    className="w-20 rounded-full border border-[#2A2C32] px-3 py-1 text-center text-sm focus:ring-2 focus:ring-primary-400 outline-none"
                                    value={field.value ?? ""}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    onFocus={() => setFocusedInput({ section: section.key, row: rowIndex })}
                                    onBlur={() => setFocusedInput({ section: null, row: null })}
                                  />
                                  <div className="space-x-2 items-center flex justify-center ml-1">
                                    <span className="text-sm text-gray-400">metros</span>

                                    {isFocused && (
                                      <button
                                        type="button"
                                        onMouseDown={() => {
                                          handleFieldChange(section.key, rowIndex, { distancia_aproximada: field.value });
                                        }}
                                        className="text-green-500 hover:text-green-600 cursor-pointer"
                                      >
                                        <CheckIcon className="h-5 w-5" />
                                      </button>
                                    )}
                                  </div>

                                </div>
                              );
                            }}
                          />
                        ) : (
                          <ObservationCell
                            sectionKey={section.key}
                            rowIndex={rowIndex}
                            currentValue={row.observations}
                            handleFieldChange={handleFieldChange}
                          />
                        )}
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
                nonStructuralRisks: {
                  ...nonStructuralRisksCtx,
                  isDone: listado?.studyData?.nonStructuralRisks?.isDone ?? false,
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
            onPrev();
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

export default EstudioStep3;
