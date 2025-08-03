import EmpresaStep1 from "./EmpresaStep1";
import EmpresaStep2 from "./EmpresaStep2";
import EmpresaStep3 from "./EmpresaStep3";

export const empresaSteps = [
  {
    key: "informacion_de_la_empresa",
    component: EmpresaStep1,
    label: "Información de la Empresa",
  },
  {
    key: "informacion_de_la_direccion",
    component: EmpresaStep2,
    label: "Información de la Dirección",
  },
  {
    key: "informacion_de_riesgo",
    component: EmpresaStep3,
    label: "Información de Riesgo",
  },
];