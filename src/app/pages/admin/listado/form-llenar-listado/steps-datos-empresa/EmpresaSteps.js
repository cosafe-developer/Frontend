import EmpresaStep1 from "./EmpresaStep1";
import EmpresaStep2 from "./EmpresaStep2";
import EmpresaStep3 from "./EmpresaStep3";

export const empresaSteps = [
  {
    key: "companyInfo",
    component: EmpresaStep1,
    label: "Información de la Empresa",
  },
  {
    key: "addressInfo",
    component: EmpresaStep2,
    label: "Información de la Dirección",
  },
  {
    key: "riskInfo",
    component: EmpresaStep3,
    label: "Información de Riesgo",
  },
];