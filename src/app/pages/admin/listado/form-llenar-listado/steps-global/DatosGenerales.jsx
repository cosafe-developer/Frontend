import EmpresaStep1 from "../steps-datos-empresa/EmpresaStep1";
import EmpresaStep2 from "../steps-datos-empresa/EmpresaStep2";
import EmpresaStep3 from "../steps-datos-empresa/EmpresaStep3";

// ----------------------------------------------------------------------

export function DatosGenerales({
  setCurrentStep,
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
      return <EmpresaStep3 setCurrentEmpresaStep={setCurrentEmpresaStep} setCurrentStep={setCurrentStep} />;
    default:
      return null;
  }
}