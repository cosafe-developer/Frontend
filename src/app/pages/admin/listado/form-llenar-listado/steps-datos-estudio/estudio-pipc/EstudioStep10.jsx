// EstudioStep1.jsx
import { useForm, Controller } from "react-hook-form";
import { Button, Table, THead, TBody, Th, Tr, Td, Checkbox } from "components/ui";
import EvidenceUpload from "components/custom-ui/upload-button/EvidenceUpload.component";
import { useLlenarListadoFormContext } from "../../contexts/LlenarListadoFormContext";
import { Listbox } from "components/shared/form/Listbox";
import { tiposRiesgosEstudios } from "../../utils/types";
import { useEffect } from "react";
import { deepMergeDefaults } from "../../utils/deepMergeDefaultsInfo";
import { resetDataEstudioStep10 } from "./utils/resetDataEstudioStep10";
import { damageElements } from "./utils/elementsTask";

import { useStudyStepPersistence } from "../../utils/useStudyStepPersistence";
import uploadImageWithFirma from "api/upload/uploadImageWithFirma.service";

const sections = [
  { key: "damageElements", label: "Daños", elements: damageElements },
];

const buildDefaultSection = (elements) =>
  elements.map((el, i) => ({
    _uid: i,
    element: el,
    evidenceUrl: null,
    riskLevel: null,
    no_aplica: false,
  }));

const filterForBackend = (item) => {
  const out = { element: item.element };
  if (item.evidenceUrl) out.evidenceUrl = item.evidenceUrl;
  if (item.riskLevel) out.riskLevel = item.riskLevel;
  if (typeof item.no_aplica !== "undefined") out.no_aplica = item.no_aplica;
  return out;
};

const EstudioStep10 = ({ onNext, onPrev, listado }) => {
  const llenarListadoFormCtx = useLlenarListadoFormContext();
  const damageEvaluationCtx = llenarListadoFormCtx?.state?.formData?.damageEvaluation ?? {};

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);


  const defaultValues = {}
  sections.forEach((section) => {
    defaultValues[section.key] =
      Array.isArray(damageEvaluationCtx[section.key]) && damageEvaluationCtx[section.key].length > 0
        ? damageEvaluationCtx[section.key].map((item, i) => ({
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


  const { control, handleSubmit, watch, reset, setValue, getValues } = useForm({
    defaultValues,
  });

  useEffect(() => {
    if (listado && damageEvaluationCtx) {
      const newData = resetDataEstudioStep10({ listado, damageEvaluationCtx });
      const merged = deepMergeDefaults(defaultValues, newData);
      reset(merged);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset, listado]);


  // Guarda el paso completo (todas las sub-secciones) con los valores actuales
  // del formulario; "Siguiente" guarda con isDone:true antes de avanzar.
  const { handleFieldChange, saveAndNext, isSaving } = useStudyStepPersistence({
    stepKey: "damageEvaluation",
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
              <Table className="w-full text-left rtl:text-right">
                <THead>
                  <Tr className="border-b border-gray-200 dark:border-dark-500">
                    <Th className="w-[5%] text-center">#</Th>
                    <Th className="w-[45%] min-w-[250px] break-words">Elemento a Evaluar</Th>
                    <Th className="w-[20%] text-center">Evidencia</Th>
                    <Th className="w-[10%] text-center">N/A</Th>
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
                            const url = await uploadImageWithFirma(file, `listado-${listado?._id}`);
                            await handleFieldChange(section.key, rowIndex, { evidenceUrl: url });
                          }}
                          onRemove={() => handleFieldChange(section.key, rowIndex, { evidenceUrl: null })}
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

export default EstudioStep10;