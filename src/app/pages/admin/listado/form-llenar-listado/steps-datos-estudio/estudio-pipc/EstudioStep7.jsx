import { useForm, Controller } from "react-hook-form";
import { Button, Switch, Table, THead, TBody, Th, Tr, Td } from "components/ui";
import EvidenceUpload from "components/custom-ui/upload-button/EvidenceUpload.component";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useLlenarListadoFormContext } from "../../contexts/LlenarListadoFormContext";
import { ObservationModal } from "../../modals/ObservacionesModal";
import { useEffect, useState } from "react";
import { resetDataEstudioStep7 } from "./utils/resetDataEstudioStep7";
import { deepMergeDefaults } from "../../utils/deepMergeDefaultsInfo";
import { epidemicElements, plagueElements, agentElements } from "./utils/elementsTask";

import { useStudyStepPersistence } from "../../utils/useStudyStepPersistence";
import uploadImageWithFirma from "api/upload/uploadImageWithFirma.service";

const sections = [
  { key: "epidemic", label: "Epidemia", elements: epidemicElements },
  { key: "plague", label: "Plaga", elements: plagueElements },
  { key: "sanitaryDisruptor", label: "Agente pertubador", elements: agentElements },
];

const buildDefaultSection = (elements) =>
  elements.map((element, i) => ({
    _uid: i,
    element: element,
    evidenceUrl: null,
    applies: false,
    observations: "",
  }));

const filterForBackend = (item) => {
  const out = { element: item.element };
  if (item.evidenceUrl) out.evidenceUrl = item.evidenceUrl;
  if (typeof item.applies !== "undefined") out.applies = item.applies;
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
      <Button onClick={() => setIsOpen(true)} className="h-8 gap-1 whitespace-nowrap px-2.5 text-xs">
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

const EstudioStep7 = ({ onNext, onPrev, listado }) => {
  const llenarListadoFormCtx = useLlenarListadoFormContext();
  const sanitaryAgentCtx = llenarListadoFormCtx?.state?.formData?.sanitaryAgent ?? {};

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const defaultValues = {}

  sections.forEach((section) => {
    defaultValues[section.key] =
      Array.isArray(sanitaryAgentCtx[section.key]) && sanitaryAgentCtx[section.key].length > 0
        ? sanitaryAgentCtx[section.key].map((it, i) => ({
          _uid: i,
          element: it.element ?? section.elements[i] ?? `Elemento ${i + 1}`,
          evidenceUrl: it.evidenceUrl ?? null,
          applies: typeof it.applies === "boolean" ? it.applies : false,
          observations: it.observations ?? "",
        }))
        : buildDefaultSection(section.elements);
  });

  const { control, handleSubmit, watch, reset, setValue, getValues } = useForm({
    defaultValues,
  });

  useEffect(() => {
    if (listado && sanitaryAgentCtx) {
      const newData = resetDataEstudioStep7({ listado, sanitaryAgentCtx });
      const merged = deepMergeDefaults(defaultValues, newData);
      reset(merged);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset, listado]);


  // Guarda el paso completo (todas las sub-secciones) con los valores actuales
  // del formulario; "Siguiente" guarda con isDone:true antes de avanzar.
  const { handleFieldChange, saveAndNext, isSaving } = useStudyStepPersistence({
    stepKey: "sanitaryAgent",
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
            <h3 className="text-lg font-medium text-white">{section.label}</h3>
            <div className="overflow-x-auto">
              <Table dense className="w-full text-left rtl:text-right [&_td]:whitespace-normal [&_th]:whitespace-normal">
                <THead>
                  <Tr className="border-b border-gray-200 dark:border-dark-500">
                    <Th className="w-10 text-center">#</Th>
                    <Th className="w-full min-w-[10rem]">Elemento a Evaluar</Th>
                    <Th className="w-px text-center">Evidencia</Th>
                    <Th className="w-px text-center">No / Sí</Th>
                    <Th className="w-px text-center">Observaciones</Th>
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

                      {/* OBSERVACIONES */}
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
            // Atrás sólo navega: antes metía claves de formData en stepStatus

            onPrev()
          }}
        >
          Atrás
        </Button>

        <Button type="submit" color="primary" className="min-w-[7rem]" disabled={isSaving}>
          Siguiente
        </Button>
      </div>
    </form>
  );
};

export default EstudioStep7;