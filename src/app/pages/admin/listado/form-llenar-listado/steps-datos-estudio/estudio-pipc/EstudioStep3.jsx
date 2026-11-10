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
  Checkbox,
} from "components/ui";
import { CheckIcon } from "@heroicons/react/20/solid";
import EvidenceUpload from "components/custom-ui/upload-button/EvidenceUpload.component";
import { useLlenarListadoFormContext } from "../../contexts/LlenarListadoFormContext";
import { deepMergeDefaults } from "../../utils/deepMergeDefaultsInfo";
import { resetDataEstudioStep3 } from "./utils/resetDataEstudioStep3";
import {
  airConditioningInstallationElements,
  electricalInstallationElements,
  externalRisksElements,
  gasInstallationElements,
  hydraulicInstallationElements,
} from "./utils/elementsTask";
import { useStudyStepPersistence } from "../../utils/useStudyStepPersistence";
import { LabelHelp } from "components/shared/HelpTip";
import { HELP } from "../../../helpers/helpTexts";
import uploadImageWithFirma from "api/upload/uploadImageWithFirma.service";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { ObservationModal } from "../../modals/ObservacionesModal";
import { toNumberOrNull } from "helpers/listadoData";

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
    approxDistance: null,
    observations: "",
  }));

const filterForBackend = (item) => {
  const out = { element: item.element };
  if (typeof item.applies !== "undefined") out.applies = item.applies;
  if (item.evidenceUrl) out.evidenceUrl = item.evidenceUrl;
  if (typeof item.no_aplica !== "undefined") out.no_aplica = item.no_aplica;
  // Siempre número (0 es válido); antes se mandaba string y 0 se descartaba
  const distance = toNumberOrNull(item.approxDistance);
  if (distance !== null) out.approxDistance = distance;
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
      <Button
        onClick={() => setIsOpen(true)}
        className="h-8 gap-1 whitespace-nowrap px-2.5 text-xs"
        title={HELP.common.commentButton}
      >
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
          approxDistance: toNumberOrNull(item.approxDistance),
          observations: item.observations ?? "",
        }))
        : buildDefaultSection(section.elements);
  });

  const { control, handleSubmit, watch, reset, setValue, getValues } = useForm({ defaultValues });

  useEffect(() => {
    if (listado && serviceInstallationsCtx) {
      const newData = resetDataEstudioStep3({ listado, serviceInstallationsCtx });
      const merged = deepMergeDefaults(defaultValues, newData);
      // Datos guardados con approxDistance string => número
      reset(
        Object.fromEntries(
          Object.entries(merged).map(([key, rows]) => [
            key,
            Array.isArray(rows)
              ? rows.map((row) => ({ ...row, approxDistance: toNumberOrNull(row?.approxDistance) }))
              : rows,
          ]),
        ),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset, listado]);

  // Guarda el paso completo (todas las sub-secciones) con los valores actuales
  // del formulario; "Siguiente" guarda con isDone:true antes de avanzar.
  const { handleFieldChange, saveAndNext, isSaving } = useStudyStepPersistence({
    stepKey: "serviceInstallations",
    sections,
    filter: filterForBackend,
    getValues,
    setValue,
    listado,
    onNext,
  });

  const onSubmit = () => saveAndNext();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex grow flex-col space-y-8">
      {sections.map((section) => {
        const rows = watch(section.key) || [];
        return (
          <div key={section.key} className="space-y-3">
            <h3 className="text-lg font-medium text-white">
              <LabelHelp label={section.label} help={HELP.common.sectionTable} />
            </h3>
            <div className="overflow-x-auto">
              <Table dense className="w-full text-left rtl:text-right [&_td]:whitespace-normal [&_th]:whitespace-normal">
                <THead>
                  <Tr className="border-b border-gray-200 dark:border-dark-500">
                    <Th className="w-10 text-center" title={HELP.common.index}>#</Th>
                    <Th className="w-full min-w-[10rem]">
                      <LabelHelp label="Elemento a Evaluar" help={HELP.common.element} small />
                    </Th>
                    <Th className="w-px text-center">
                      <LabelHelp label="Evidencia" help={section.key === "externalRisks" ? HELP.common.evidence : HELP.common.evidenceNoColumn} small />
                    </Th>
                    <Th className="w-px text-center">
                      <LabelHelp label="No / Sí" help={section.key === "externalRisks" ? HELP.study.service.externalApplies : HELP.study.service.applies} small />
                    </Th>
                    <Th className="w-px text-center">
                      <LabelHelp label="N/A" help={HELP.common.notApplicable} small />
                    </Th>
                    <Th className="w-px text-center">
                      {section.key === "externalRisks" ? (
                        <LabelHelp label="Distancia aproximada" help={HELP.study.service.distance} small />
                      ) : (
                        <LabelHelp label="Observaciones" help={HELP.common.observations} small />
                      )}
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
                        <EvidenceUpload
                          size="sm"
                          value={row.evidenceUrl}
                          onChange={async (file) => {
                            const url = await uploadImageWithFirma(file, `listado-${listado?._id}`);
                            await handleFieldChange(section.key, rowIndex, { evidenceUrl: url });
                          }}
                          onRemove={() => handleFieldChange(section.key, rowIndex, { evidenceUrl: null })}
                        />
                      </Td>

                      {/* === SWITCH (applies) === */}
                      <Td className="text-center">
                        <Controller
                          name={`${section.key}.${rowIndex}.applies`}
                          control={control}
                          render={({ field }) => (
                            <Switch
                              title={section.key === "externalRisks" ? HELP.study.service.externalApplies : HELP.study.service.applies}
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
                              title={HELP.common.notApplicable}
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
                            name={`${section.key}.${rowIndex}.approxDistance`}
                            control={control}
                            render={({ field }) => {


                              const isFocused =
                                focusedInput.section === section.key && focusedInput.row === rowIndex;


                              // Guarda como número (o null) al salir del campo o con ✓;
                              // antes sólo se guardaba con ✓ y como string.
                              const saveDistance = () => {
                                const value = toNumberOrNull(field.value);
                                // Último valor guardado (contexto), no el del input
                                const saved = toNumberOrNull(
                                  serviceInstallationsCtx?.[section.key]?.[rowIndex]?.approxDistance,
                                );
                                if (value !== saved) {
                                  handleFieldChange(section.key, rowIndex, { approxDistance: value });
                                }
                              };

                              return (
                                <div className="flex items-center justify-center gap-1 text-center">
                                  <input
                                    type="number"
                                    min={0}
                                    // Más ancho y sin flechas del number: tapaban el valor
                                    inputMode="decimal"
                                    aria-label="Distancia aproximada en metros"
                                    title={HELP.study.service.distance}
                                    className="w-24 rounded-full border border-[#2A2C32] px-2 py-1 text-center text-sm outline-none focus:ring-2 focus:ring-primary-400 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                    value={field.value ?? ""}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    onFocus={() => setFocusedInput({ section: section.key, row: rowIndex })}
                                    onBlur={() => {
                                      setFocusedInput({ section: null, row: null });
                                      saveDistance();
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        e.preventDefault();
                                        e.currentTarget.blur();
                                      }
                                    }}
                                  />
                                  <div className="flex items-center justify-center gap-1">
                                    <span className="whitespace-nowrap text-sm text-gray-400">metros</span>

                                    {/* Hueco fijo para el ✓: la columna no cambia de ancho al enfocar */}
                                    <span className="inline-flex w-5 justify-center">
                                    {isFocused && (
                                      <button
                                        type="button"
                                        onMouseDown={(e) => {
                                          // preventDefault: el input conserva el foco y su
                                          // blur posterior no vuelve a guardar el mismo valor
                                          e.preventDefault();
                                          saveDistance();
                                        }}
                                        className="text-green-500 hover:text-green-600 cursor-pointer"
                                        aria-label="Guardar distancia"
                                        title="Guarda la distancia escrita"
                                      >
                                        <CheckIcon className="h-5 w-5" />
                                      </button>
                                    )}
                                    </span>
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
          title={HELP.common.back}
          onClick={() => {
            // Atrás sólo navega: antes metía claves de formData en stepStatus
            onPrev();
          }}
        >
          Atrás
        </Button>

        <Button type="submit" color="primary" className="min-w-[7rem]" disabled={isSaving} title={HELP.common.next}>
          Siguiente
        </Button>
      </div>
    </form>
  );
};

export default EstudioStep3;
