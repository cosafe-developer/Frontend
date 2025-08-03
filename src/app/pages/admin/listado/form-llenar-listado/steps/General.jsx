import EmpresaStep1 from "../empresa/EmpresaStep1";
import EmpresaStep2 from "../empresa/EmpresaStep2";
import EmpresaStep3 from "../empresa/EmpresaStep3";

// ----------------------------------------------------------------------

export function General({
  // setCurrentStep,
  currentEmpresaStep,
  // currentEStudioStep,
  // setCurrentEStudioStep,
  setCurrentEmpresaStep
}) {
  switch (currentEmpresaStep) {
    case 0:
      return <EmpresaStep1 setCurrentEmpresaStep={setCurrentEmpresaStep} />;
    case 1:
      return <EmpresaStep2 setCurrentEmpresaStep={setCurrentEmpresaStep} />;
    case 2:
      return <EmpresaStep3 setCurrentEmpresaStep={setCurrentEmpresaStep} />;
    default:
      return null;
  }
}