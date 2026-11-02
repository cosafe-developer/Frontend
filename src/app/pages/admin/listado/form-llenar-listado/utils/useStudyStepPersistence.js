import { useState } from "react";
import updateListado from "api/listados/updateListado";
import { useToastContext } from "app/contexts/toast-provider/context";
import { useLlenarListadoFormContext } from "../contexts/LlenarListadoFormContext";
import { persistStudyStep, pickStepSections } from "./persistStudyStep";

/**
 * Guardado de un paso del estudio PIPC (EstudioStep1..10).
 *
 * - handleFieldChange: actualiza una fila y guarda el paso completo con los
 *   valores actuales del formulario (todas las sub-secciones).
 * - saveAndNext ("Siguiente"): guarda el paso completo y sólo avanza si el
 *   guardado tuvo éxito; si falla muestra un toast.
 *
 * `computeIsDone(sectionsData)` es opcional (por defecto el paso cuenta como
 * hecho al guardarse).
 */
export function useStudyStepPersistence({
  stepKey,
  sections,
  filter,
  getValues,
  setValue,
  listado,
  onNext,
  computeIsDone,
}) {
  const llenarListadoFormCtx = useLlenarListadoFormContext();
  const { showToast } = useToastContext();
  const [isSaving, setIsSaving] = useState(false);

  const stepCtx = llenarListadoFormCtx?.state?.formData?.[stepKey] ?? {};
  const stepApplicability = llenarListadoFormCtx?.state?.stepApplicability;

  const updateContext = (values, isDone) => {
    llenarListadoFormCtx.dispatch({
      type: "SET_FORM_DATA",
      payload: {
        [stepKey]: {
          ...stepCtx,
          ...pickStepSections(sections, values),
          isDone,
        },
      },
    });
  };

  // Pasos con validación propia (1, 2, 3, 8, 10) sólo cuentan como hechos si
  // están completos; los demás, al guardarse.
  const isStepDone = (values) =>
    computeIsDone ? Boolean(computeIsDone(pickStepSections(sections, values))) : true;

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
    });

  const handleFieldChange = async (sectionKey, rowIndex, changedFields) => {
    try {
      const currentArray = getValues(sectionKey) || [];
      const updatedArray = [...currentArray];
      updatedArray[rowIndex] = { ...updatedArray[rowIndex], ...changedFields };
      setValue(sectionKey, updatedArray);

      // Valores actuales de TODAS las sub-secciones (no la prop listado)
      const values = { ...getValues(), [sectionKey]: updatedArray };
      const isDone = isStepDone(values);

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
    try {
      const values = getValues();
      const isDone = isStepDone(values);
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
    setIsSaving(false);
    onNext();
  };

  return { handleFieldChange, saveAndNext, isSaving };
}
