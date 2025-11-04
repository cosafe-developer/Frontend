import EstudioStep1 from "./EstudioStep1";
import EstudioStep2 from "./EstudioStep2";
import EstudioStep3 from "./EstudioStep3";
import EstudioStep4 from "./EstudioStep4";
import EstudioStep5 from "./EstudioStep5";
import EstudioStep6 from "./EstudioStep6";
import EstudioStep7 from "./EstudioStep7";
import EstudioStep8 from "./EstudioStep8";
import EstudioStep9 from "./EstudioStep9";
import EstudioStep10 from "./EstudioStep10";
import EstudioStep11 from "./EstudioStep11";

export const estudioSteps = [
  {
    key: "nonStructuralRisks",
    component: EstudioStep1,
    label: "Riesgos por daños no estructurales",
  },
  {
    key: "structuralRisks",
    component: EstudioStep2,
    label: "Riesgos por daños estructurales",
  },
  {
    key: "serviceInstallations",
    component: EstudioStep3,
    label: "Riesgos por deficiencia en las instalaciones de servicio del inmueble",
  },
  {
    key: "socioOrganizationalAgent",
    component: EstudioStep4,
    label: "Agente Perturbador Socio-Organizativo",
  },
  {
    key: "geologicalAgent",
    component: EstudioStep5,
    label: "Agente Perturbador Geológico",
  },
  {
    key: "physicochemicalAgent",
    component: EstudioStep6,
    label: "Agente Perturbador Físico-Químico",
  },
  {
    key: "sanitaryAgent",
    component: EstudioStep7,
    label: "Agente Perturbador Sanitario",
  },
  {
    key: "surroundingRisks",
    component: EstudioStep8,
    label: "Riesgos Circundantes",
  },
  {
    key: "securityMeasures",
    component: EstudioStep9,
    label: "Medidas y Equipos de Seguridad",
  },
  {
    key: "damageEvaluation",
    component: EstudioStep10,
    label: "Evaluación de Daños",
  },
  {
    key: "attachments",
    component: EstudioStep11,
    label: "Evaluación de Daños",
  },
];