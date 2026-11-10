import { useForm, Controller } from "react-hook-form";
import { Button, Switch, Table, THead, TBody, Th, Tr, Td, Checkbox } from "components/ui";
import EvidenceUpload from "components/custom-ui/upload-button/EvidenceUpload.component";
import { useLlenarListadoFormContext } from "../../contexts/LlenarListadoFormContext";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { ObservationModal } from "../../modals/ObservacionesModal";
import { useEffect, useState } from "react";
import { resetDataEstudioStep8 } from "./utils/resetDataEstudioStep8";
import { deepMergeDefaults } from "../../utils/deepMergeDefaultsInfo";
import { externalRiskElements } from "./utils/elementsTask";

import { useStudyStepPersistence } from "../../utils/useStudyStepPersistence";
import { LabelHelp } from "components/shared/HelpTip";
import { HELP } from "../../../helpers/helpTexts";
import uploadImageWithFirma from "api/upload/uploadImageWithFirma.service";

const sections = [
  { key: "externalRiskElements", label: "Tipo de Riesgo", elements: externalRiskElements },
];

const buildDefaultSection = (elements) =>
  elements.map((element, i) => ({
    _uid: i,
    element: element,
    evidenceUrl: null,
    applies: false,
    notApplicable: false,
    observations: "",
  }));

const filterForBackend = (item) => {
  const out = { element: item.element };
  if (item.evidenceUrl) out.evidenceUrl = item.evidenceUrl;
  if (typeof item.applies !== "undefined") out.applies = item.applies;
  if (typeof item.notApplicable !== "undefined") out.notApplicable = item.notApplicable;
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

const EstudioStep8 = ({ onNext, onPrev, listado }) => {
  const llenarListadoFormCtx = useLlenarListadoFormContext();
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
          applies: typeof item.applies === "boolean" ? item.applies : false,
          notApplicable: typeof item.notApplicable === "boolean" ? item.notApplicable : false,
          observations: item.observations ?? "",
        }))
        : buildDefaultSection(section.elements);
  });

  const { control, handleSubmit, watch, reset, setValue, getValues } = useForm({
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


  // Guarda el paso completo (todas las sub-secciones) con los valores actuales
  // del formulario; "Siguiente" guarda con isDone:true antes de avanzar.
  const { handleFieldChange, saveAndNext, isSaving } = useStudyStepPersistence({
    stepKey: "surroundingRisks",
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
                      <LabelHelp label="Evidencia" help={HELP.common.evidence} small />
                    </Th>
                    <Th className="w-px text-center">
                      <LabelHelp label="SIN RIESGO / CON RIESGO" help={HELP.study.surrounding.applies} small />
                    </Th>
                    <Th className="w-px text-center">
                      <LabelHelp label="N/A" help={HELP.common.notApplicable} small />
                    </Th>
                    <Th className="w-px text-center">
                      <LabelHelp label="Observaciones" help={HELP.common.observations} small />
                    </Th>
                  </Tr>
                </THead>

                <TBody>
                  {rows.map((row, rowIndex) => (
                    <Tr key={row._uid ?? rowIndex} className="border-b border-gray-200 dark:border-dark-500">
                      <Td>{rowIndex + 1}</Td>
                      <Td className="break-words text-[15px]">{row.element}</Td>

                      {/* EVIDENCIA */}
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


                      {/* SWITCH (applies) */}
                      <Td className="text-center ">
                        <Controller
                          name={`${section.key}.${rowIndex}.applies`}
                          control={control}
                          render={({ field }) => (
                            <Switch
                              title={HELP.study.surrounding.applies}
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

                      {/* === N/A === */}
                      <Td className="text-center">
                        <Controller
                          name={`${section.key}.${rowIndex}.notApplicable`}
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              title={HELP.common.notApplicable}
                              color="warning"
                              checked={field.value || false}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                field.onChange(checked);
                                handleFieldChange(section.key, rowIndex, { notApplicable: checked });
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
          title={HELP.common.back}
          onClick={() => {
            // Atrás sólo navega: antes metía claves de formData en stepStatus

            onPrev()
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

export default EstudioStep8;