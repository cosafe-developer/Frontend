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
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useLlenarListadoFormContext } from "../../contexts/LlenarListadoFormContext";
import { useEffect, useState } from "react";
import { resetDataEstudioStep2 } from "./utils/resetDataEstudioStep2";
import { deepMergeDefaults } from "../../utils/deepMergeDefaultsInfo";
import { ObservationModal } from "../../modals/ObservacionesModal";
import { checkIfSectionIsDone } from "../utils/checkIfSectionIsDone";

import {
  elementTaskStructuralDamage,
  finishesElements,
  nonStructuralElements,
} from "./utils/elementsTask";

import { useStudyStepPersistence } from "../../utils/useStudyStepPersistence";


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

const sections = [
  {
    key: "structuralDamage",
    label: "Riesgos por daños estructurales",
    elements: elementTaskStructuralDamage,
  },
  {
    key: "nonStructuralElements",
    label: "Riesgos por elementos no estructurales",
    elements: nonStructuralElements,
  },
  {
    key: "finishes",
    label: "Riesgos por acabados en el inmueble",
    elements: finishesElements,
  },
];

const buildDefaultSection = (elements) =>
  elements.map((el, i) => ({
    _uid: i,
    element: el,
    existsInPlace: false,
    applies: false,
    notApplicable: false,
    observations: "",
  }));

const filterForBackend = (item) => {
  const out = { element: item.element };
  if (typeof item.existsInPlace !== "undefined") out.existsInPlace = item.existsInPlace;
  if (typeof item.applies !== "undefined") out.applies = item.applies;
  if (typeof item.notApplicable !== "undefined") out.notApplicable = item.notApplicable;
  if (item.observations) out.observations = item.observations;
  return out;
};

// ----------------------------------------------------------------------

const EstudioStep2 = ({ onNext, onPrev, listado }) => {
  const llenarListadoFormCtx = useLlenarListadoFormContext();
  // Step 2 -> Actual
  const structuralRisksCtx = llenarListadoFormCtx?.state?.formData?.structuralRisks ?? {};

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const defaultValues = {};

  sections.forEach((section) => {
    defaultValues[section.key] =
      Array.isArray(structuralRisksCtx[section.key]) && structuralRisksCtx[section.key].length > 0
        ? structuralRisksCtx[section.key].map((item, i) => ({
          _uid: i,
          element: item.element ?? section.elements[i] ?? `Elemento ${i + 1}`,
          existsInPlace: typeof item.existsInPlace === "boolean" ? item.existsInPlace : false,
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
    if (listado && structuralRisksCtx) {
      const newData = resetDataEstudioStep2({ listado, structuralRisksCtx });
      const merged = deepMergeDefaults(defaultValues, newData);

      reset(merged);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset, listado]);


  // Guarda el paso completo (todas las sub-secciones) con los valores actuales
  // del formulario; "Siguiente" guarda con isDone:true antes de avanzar.
  const { handleFieldChange, saveAndNext, isSaving } = useStudyStepPersistence({
    stepKey: "structuralRisks",
    sections,
    filter: filterForBackend,
    getValues,
    setValue,
    listado,
    onNext,
    computeIsDone: (data) => checkIfSectionIsDone(data, ["observations", "applies", "existsInPlace", "notApplicable"], "some"),
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
              <Table className="w-full text-left rtl:text-right">
                <THead>
                  <Tr className="border-b border-gray-200 dark:border-dark-500">
                    <Th className="w-[5%] text-center">#</Th>
                    <Th className="w-[45%] min-w-[250px] break-words">Elemento a Evaluar</Th>
                    <Th className="w-[10%] text-center">Existe</Th>
                    <Th className="w-[10%] text-center">Sí / No</Th>
                    <Th className="w-[10%] text-center">N/A</Th>
                    <Th className="w-[20%] text-center">Observaciones</Th>
                  </Tr>
                </THead>

                <TBody>
                  {rows.map((row, rowIndex) => (
                    <Tr key={row._uid ?? rowIndex} className="border-b border-gray-200 dark:border-dark-500">
                      <Td className="text-center">{rowIndex + 1}</Td>
                      <Td className="break-words text-[15px]">{row.element}</Td>

                      {/* EXISTE */}
                      <Td className="text-center">
                        <Controller
                          name={`${section.key}.${rowIndex}.existsInPlace`}
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              color="success"
                              checked={field.value || false}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                field.onChange(checked);
                                handleFieldChange(section.key, rowIndex, { existsInPlace: checked });
                              }}
                            />
                          )}
                        />
                      </Td>

                      {/* SÍ / NO */}
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

                      {/* N/A */}
                      <Td className="text-center">
                        <Controller
                          name={`${section.key}.${rowIndex}.notApplicable`}
                          control={control}
                          render={({ field }) => (
                            <Checkbox
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

            onPrev();
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

export default EstudioStep2;