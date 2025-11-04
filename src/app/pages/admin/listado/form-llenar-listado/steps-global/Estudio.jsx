// Estudio.jsx

import PropTypes from "prop-types";
import { estudioSteps } from "../steps-datos-estudio/estudio-pipc/EstudioSteps";

export function Estudio({
  currentEstudioStep,
  setCurrentEstudioStep,
  setFinished,
  listado,
}) {
  const StepComponent = estudioSteps[currentEstudioStep]?.component;

  if (!StepComponent) return null;

  const handleNext = () => {
    if (currentEstudioStep < estudioSteps.length - 1) {
      setCurrentEstudioStep((prev) => prev + 1);
    } else {
      setFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentEstudioStep > 0) {
      setCurrentEstudioStep((prev) => prev - 1);
    }
  };

  return (
    <StepComponent
      onNext={handleNext}
      onPrev={handlePrev}
      currentEStudioStep={currentEstudioStep}
      listado={listado}
    />
  );
}

Estudio.propTypes = {
  currentEStudioStep: PropTypes.number,
  setCurrentEstudioStep: PropTypes.func,
  setFinished: PropTypes.func,
};
