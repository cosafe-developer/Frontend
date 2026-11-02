import { useState } from "react";
import updateListado from "api/listados/updateListado";
import { useToastContext } from "app/contexts/toast-provider/context";
import { useLlenarListadoFormContext } from "../contexts/LlenarListadoFormContext";
import { persistStudyStep, pickStepSections } from "./persistStudyStep";
import { getStudyStepIssues } from "../../helpers/studyStepRules.js";
import { progressPercentageOf } from "../../helpers/calculateProgressGeneralListado.js";

/**
 * Guardado de un paso del estudio PIPC (EstudioStep1..10).
 *
 * - handleFieldChange: actualiza una fila y guarda el paso completo con los
 *   valores actuales del formulario (todas las sub-secciones). No marca el
 *   paso como terminado: conserva isDone sólo si ya lo estaba y sigue válido.
 * - saveAndNext ("Siguiente"): guarda el paso completo y sólo avanza si el
 *   guardado tuvo éxito; si falla muestra un toast. El paso queda terminado
 *   (isDone) si cumple las reglas de helpers/studyStepRules.js (p.ej. grado de
 *   riesgo en filas "Sí" del paso 1); si no, se guarda igual, se avanza y se
 *   avisa qué falta.
 *
 * Cada guardado manda también progressPercentage, calculado con
 * calculateProgressGeneralListado sobre el estudio en el contexto.
 */
export function useStudyStepPersistence({
  stepKey,
  sections,
  filter,
  getValues,
  setValue,
  listado,
  onNext,
}) {
  const llenarListadoFormCtx = useLlenarListadoFormContext();
  const { showToast } = useToastContext();
  const [isSaving, setIsSaving] = useState(false);

  const formData = llenarListadoFormCtx?.state?.formData ?? {};
  const stepCtx = formData?.[stepKey] ?? {};
  const stepApplicability = llenarListadoFormCtx?.state?.stepApplicability;

  const stepData = (values, isDone) => ({
    ...stepCtx,
    ...pickStepSections(sections, values),
    isDone,
  });

  const updateContext = (values, isDone) => {
    llenarListadoFormCtx.dispatch({
      type: "SET_FORM_DATA",
      payload: { [stepKey]: stepData(values, isDone) },
    });
  };

  const issuesOf = (values) => getStudyStepIssues(stepKey, pickStepSections(sections, values));

  const save = (values, isDone) =>
    persistStudyStep({
      save: updateListado,
      listadoId: listado?._id,
      stepKey,
      sections,
      values,
      filter,
      isDone,
      stepApplicability,
      progressPercentage: progressPercentageOf(
        { ...formData, [stepKey]: stepData(values, isDone) },
        stepApplicability,
      ),
    });

  const handleFieldChange = async (sectionKey, rowIndex, changedFields) => {
    try {
      const currentArray = getValues(sectionKey) || [];
      const updatedArray = [...currentArray];
      updatedArray[rowIndex] = { ...updatedArray[rowIndex], ...changedFields };
      setValue(sectionKey, updatedArray);

      // Valores actuales de TODAS las sub-secciones (no la prop listado)
      const values = { ...getValues(), [sectionKey]: updatedArray };
      const isDone = stepCtx.isDone === true && issuesOf(values).length === 0;

      updateContext(values, isDone);
      await save(values, isDone);
    } catch (err) {
      console.error("Error al actualizar campo de estudio:", err);
      showToast({ message: "No se pudo guardar el cambio. Intenta de nuevo.", type: "error" });
    }
  };

  const saveAndNext = async () => {
    if (isSaving) return;
    setIsSaving(true);
    const values = getValues();
    const issues = issuesOf(values);
    const isDone = issues.length === 0;
    try {
      await save(values, isDone);
      updateContext(values, isDone);
    } catch (err) {
      console.error(`Error al guardar el paso ${stepKey}:`, err);
      showToast({
        message: "No se pudo guardar este paso. Revisa tu conexión e intenta de nuevo.",
        type: "error",
      });
      setIsSaving(false);
      return;
    }
    if (!isDone) {
      showToast({
        message: `Se guardó, pero el paso queda pendiente: ${issues.join(" ")}`,
        type: "warning",
        duration: 7000,
      });
    }
    setIsSaving(false);
    onNext();
  };

  return { handleFieldChange, saveAndNext, isSaving };
}
