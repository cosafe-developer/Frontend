import EmpresaStep1 from "../steps-datos-empresa/EmpresaStep1";
import EmpresaStep2 from "../steps-datos-empresa/EmpresaStep2";
import EmpresaStep3 from "../steps-datos-empresa/EmpresaStep3";

// ----------------------------------------------------------------------

export function DatosGenerales({
  setCurrentStep,
  currentEmpresaStep,
  listado,
  // currentEStudioStep,
  // setCurrentEStudioStep,
  setCurrentEmpresaStep,
  empresa,
}) {
  switch (currentEmpresaStep) {
    case 0:
      return (
        <EmpresaStep1
          setCurrentEmpresaStep={setCurrentEmpresaStep}
          listado={listado}
          empresa={empresa}
        />
      )
    case 1:
      return (
        <EmpresaStep2
          setCurrentEmpresaStep={setCurrentEmpresaStep}
          listado={listado}
          empresa={empresa}
        />
      )
    case 2:
      return (
        <EmpresaStep3
          setCurrentEmpresaStep={setCurrentEmpresaStep}
          setCurrentStep={setCurrentStep}
          listado={listado}
          empresa={empresa}
        />
      )
    default:
      return null;
  }
}