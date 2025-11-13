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

import updateListado from "api/listados/updateListado";


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
    exists: false,
    applies: false,
    no_aplica: false,
    observations: "",
  }));

const filterForBackend = (item) => {
  const out = { element: item.element };
  if (typeof item.exists !== "undefined") out.exists = item.exists;
  if (typeof item.applies !== "undefined") out.applies = item.applies;
  if (typeof item.no_aplica !== "undefined") out.no_aplica = item.no_aplica;
  if (item.observations) out.observations = item.observations;
  return out;
};

// ----------------------------------------------------------------------

const EstudioStep2 = ({ onNext, onPrev, listado }) => {
  const llenarListadoFormCtx = useLlenarListadoFormContext();
  //? Step 1
  const nonStructuralRisksCtx = llenarListadoFormCtx?.state?.formData?.nonStructuralRisks ?? {};
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
      structuralRisksCtx[section.key] && Array.isArray(structuralRisksCtx[section.key])
        ? structuralRisksCtx[section.key].map((item, i) => ({
          _uid: i,
          element: item.element ?? section.elements[i] ?? `Elemento ${i + 1}`,
          exists: typeof item.exists === "boolean" ? item.exists : false,
          applies: typeof item.applies === "boolean" ? item.applies : false,
          no_aplica: typeof item.no_aplica === "boolean" ? item.no_aplica : false,
          observations: item.observations ?? "",
        }))
        : buildDefaultSection(section.elements);
  });

  const { control, handleSubmit, watch, reset } = useForm({
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


  const handleFieldChange = async (sectionKey, rowIndex, changedFields) => {
    try {
      const backendData = listado?.studyData?.structuralRisks ?? {};
      const currentArray = watch(sectionKey) || [];
      const updatedArray = [...currentArray];
      updatedArray[rowIndex] = { ...updatedArray[rowIndex], ...changedFields };

      const newStructuralRisks = {
        ...structuralRisksCtx,
        [sectionKey]: updatedArray,
      };

      const isDoneNonStructural = checkIfSectionIsDone(newStructuralRisks, ["observations", "applies", "exists", "no_aplica"], "some");

      llenarListadoFormCtx.dispatch({
        type: "SET_FORM_DATA",
        payload: {
          structuralRisks: {
            ...newStructuralRisks,
            isDone: isDoneNonStructural,
          },
        },
      });

      const merged = {
        ...backendData,
        ...newStructuralRisks,
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
            structuralRisks: {
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
      console.error("Error al enviar estudio paso 2:", error);
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
                          name={`${section.key}.${rowIndex}.exists`}
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              color="success"
                              checked={field.value || false}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                field.onChange(checked);
                                handleFieldChange(section.key, rowIndex, { exists: checked });
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

export default EstudioStep2;