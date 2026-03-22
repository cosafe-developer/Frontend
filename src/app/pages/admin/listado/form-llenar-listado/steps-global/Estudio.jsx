import PropTypes from "prop-types";
import { useState, useEffect, useCallback } from "react";
import { estudioSteps } from "../steps-datos-estudio/estudio-pipc/EstudioSteps";
import { useLlenarListadoFormContext } from "../contexts/LlenarListadoFormContext";
import { ApplicabilityModal } from "../modals/ApplicabilityModal";
import updateListado from "api/listados/updateListado";

export function Estudio({
  currentEstudioStep,
  setCurrentEstudioStep,
  setFinished,
  listado,
}) {
  const llenarListadoFormCtx = useLlenarListadoFormContext();
  const stepApplicability = llenarListadoFormCtx?.state?.stepApplicability;
  const [showApplicabilityModal, setShowApplicabilityModal] = useState(false);

  const currentStepDef = estudioSteps[currentEstudioStep];
  const currentStepKey = currentStepDef?.key;
  const StepComponent = currentStepDef?.component;

  // Busca el siguiente step que aplica (o que no tiene decisión aún)
  const findNextApplicable = useCallback(
    (fromIndex) => {
      for (let i = fromIndex; i < estudioSteps.length; i++) {
        const key = estudioSteps[i].key;
        if (stepApplicability[key] !== false) return i;
      }
      return -1; // todos los siguientes no aplican
    },
    [stepApplicability],
  );

  const findPrevApplicable = useCallback(
    (fromIndex) => {
      for (let i = fromIndex; i >= 0; i--) {
        const key = estudioSteps[i].key;
        if (stepApplicability[key] !== false) return i;
      }
      return -1;
    },
    [stepApplicability],
  );

  // Cuando cambia el step actual, verifica si necesita preguntar applicabilidad
  useEffect(() => {
    if (!currentStepKey) return;
    const applicability = stepApplicability[currentStepKey];

    if (applicability === null) {
      // No se ha decidido aún → mostrar modal
      setShowApplicabilityModal(true);
    } else if (applicability === false) {
      // Este step no aplica → saltar al siguiente
      const next = findNextApplicable(currentEstudioStep + 1);
      if (next !== -1) {
        setCurrentEstudioStep(next);
      } else {
        setFinished(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEstudioStep, currentStepKey]);

  const saveApplicability = async (key, applies) => {
    llenarListadoFormCtx.dispatch({
      type: "SET_STEP_APPLICABILITY",
      payload: { [key]: applies },
    });

    // Si no aplica, marcar como done
    if (!applies) {
      llenarListadoFormCtx.dispatch({
        type: "SET_FORM_DATA",
        payload: {
          [key]: {
            ...llenarListadoFormCtx.state.formData[key],
            isDone: true,
          },
        },
      });
    }

    // Guardar en backend
    try {
      const currentApplicability = { ...stepApplicability, [key]: applies };
      await updateListado({
        requestBody: {
          listado_id: listado?._id,
          studyData: {
            stepApplicability: currentApplicability,
          },
        },
      });
    } catch (err) {
      console.error("Error al guardar applicabilidad:", err);
    }
  };

  const handleApplies = () => {
    setShowApplicabilityModal(false);
    saveApplicability(currentStepKey, true);
  };

  const handleNotApplies = async () => {
    setShowApplicabilityModal(false);
    await saveApplicability(currentStepKey, false);

    // Avanzar al siguiente step que aplique
    const next = findNextApplicable(currentEstudioStep + 1);
    if (next !== -1) {
      setCurrentEstudioStep(next);
    } else {
      setFinished(true);
    }
  };

  const handleNext = () => {
    const next = findNextApplicable(currentEstudioStep + 1);
    if (next !== -1) {
      setCurrentEstudioStep(next);
    } else {
      setFinished(true);
    }
  };

  const handlePrev = () => {
    const prev = findPrevApplicable(currentEstudioStep - 1);
    if (prev !== -1) {
      setCurrentEstudioStep(prev);
    }
  };

  if (!StepComponent) return null;

  // Si el step no aplica y el modal no está abierto, no renderizar nada (el useEffect se encarga de saltar)
  if (stepApplicability[currentStepKey] === false) return null;

  return (
    <>
      {/* Modal de applicabilidad */}
      <ApplicabilityModal
        show={showApplicabilityModal}
        onClose={() => setShowApplicabilityModal(false)}
        stepLabel={currentStepDef?.label}
        onApplies={handleApplies}
        onNotApplies={handleNotApplies}
      />

      {/* Solo renderizar el step si ya se decidió que aplica */}
      {stepApplicability[currentStepKey] === true && (
        <StepComponent
          onNext={handleNext}
          onPrev={handlePrev}
          currentEStudioStep={currentEstudioStep}
          listado={listado}
        />
      )}
    </>
  );
}

Estudio.propTypes = {
  currentEstudioStep: PropTypes.number,
  setCurrentEstudioStep: PropTypes.func,
  setFinished: PropTypes.func,
  listado: PropTypes.object,
};
