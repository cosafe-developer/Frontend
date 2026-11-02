import { useForm, Controller } from "react-hook-form";
import { Button, Switch, Table, THead, TBody, Th, Tr, Td } from "components/ui";
import { useLlenarListadoFormContext } from "../../contexts/LlenarListadoFormContext";
import { Listbox } from "components/shared/form/Listbox";
import { tiposRiesgosEstudios } from "../../utils/types";
import { useEffect } from "react";
import { resetDataEstudioStep1 } from "./utils/resetDataEstudioStep1";
import { deepMergeDefaults } from "../../utils/deepMergeDefaultsInfo";
import { evacuationBlockingObjects, fallingObjects, flammableObjects, overturningObjects, slidingObjects } from "./utils/elementsTask";
import { uploadListadoFile } from "helpers/updateImageUpload";

import { useStudyStepPersistence } from "../../utils/useStudyStepPersistence";
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
      Array.isArray(nonStructuralRisksCtx[section.key]) && nonStructuralRisksCtx[section.key].length > 0
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

  const { control, handleSubmit, watch, reset, setValue, getValues } = useForm({
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


  // Guarda el paso completo (todas las sub-secciones) con los valores actuales
  // del formulario; "Siguiente" guarda con isDone:true antes de avanzar.
  const { handleFieldChange, saveAndNext, isSaving } = useStudyStepPersistence({
    stepKey: "nonStructuralRisks",
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
                    <Th className="w-px text-center">Grado de Riesgo</Th>
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
                            // Subir PRIMERO y guardar sólo la URL: antes se
                            // guardaba el File (serializa a {}) antes de subir.
                            // La evidencia anterior no se borra aquí porque
                            // handleFieldChange no confirma que se guardó.
                            try {
                              const url = await uploadListadoFile(file, {
                                listadoId: listado?._id,
                                fileName: "evidencia",
                              });
                              await handleFieldChange(section.key, rowIndex, { evidenceUrl: url });
                            } catch (err) {
                              console.error("Error al subir evidencia:", err);
                            }
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
                              placeholder="Seleccione..."
                              classNames={{ root: "mx-auto w-36" }}
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
        <Button type="submit" color="primary" className="min-w-[7rem]" disabled={isSaving}>
          Siguiente
        </Button>
      </div>
    </form>
  );
};

export default EstudioStep1;