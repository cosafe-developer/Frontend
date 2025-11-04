// Import Dependencies
import { useReducer } from "react";
import PropTypes from "prop-types";

// Local Imports
import { LlenarListadoFormContextProvider } from "./LlenarListadoFormContext";
// import { Delta } from "components/shared/form/TextEditor";

// ----------------------------------------------------------------------

const initialState = {
  formData: {
    nonStructuralRisks: {
      fallingObjects: null,
      slidingObjects: null,
      overturningObjects: null,
      flammableObjects: null,
      evacuationBlockingObjects: null,
      isDone: false,
    },
    structuralRisks: {
      structuralDamage: null,
      nonStructuralElements: null,
      finishes: null,
      isDone: false,
    },
    serviceInstallations: {
      hydraulicInstallation: null,
      gasInstallation: null,
      electricalInstallation: null,
      airConditioningInstallation: null,
      externalRisks: null,
      isDone: false,
    },
    socioOrganizationalAgent: {
      majorAccidents: null,
      criminalActs: null,
      socialDisturbances: null,
      isDone: false,
    },
    geologicalAgent: {
      geologicalDisruptions: null,
      seismicEvents: null,
      volcanism: null,
      isDone: false,
    },
    physicochemicalAgent: {
      fireAgent: null,
      chemicalSpill: null,
      explosionAgent: null,
      contamination: null,
      flooding: null,
      isDone: false,
    },
    sanitaryAgent: {
      epidemic: null,
      plague: null,
      isDone: false,
    },
    surroundingRisks: {
      externalRiskElements: null,
      isDone: false,
    },
    securityMeasures: {
      alarmSystem: null,
      isDone: false,
    },
    damageEvaluation: {
      damageElements: null,
      isDone: false,
    },
    attachments: {
      documents: null,
      isDone: false,
    },
    estudio: {
      isDone: false,
    },
  },
  stepStatus: {
    datos_generales: {
      isDone: false,
    },
    companyInfo: {
      address: null,
      businessName: null,
      email: null,
      logoUrl: null,
      phone: null,
      rfc: null,
      isDone: false,
    },
    addressInfo: {
      taxCertificateUrl: null,
      activities: null,
      businessTurn: null,
      propertyResponsibleName: null,
      propertyResponsiblePosition: null,
      legalRepresentativeName: null,
      legalRepresentativePosition: null,
      legalRepresentativeSignatureUrl: null,
      legalRepresentativeIneUrl: null,
      landAreaM2: null,
      builtAreaM2: null,
      fixedPopulation: null,
      floatingPopulation: null,
      propertyBoundaries: null,
      internalAreas: null,
      isDone: false,
    },
    riskInfo: {
      materialsInventoryUrl: null,
      companyDescription: null,
      riskType: "ordinario",
      antecedents: null,
      preventionCalendarDate: null,
      internalGeneralRisks: null,
      isDone: false,
    },
    // ------------------------ 
    estudio: {
      isDone: false,
    },
  },
};


const reducer = (state, action) => {
  switch (action.type) {
    case "SET_FORM_DATA":
      return {
        ...state,
        formData: {
          ...state.formData,
          ...action.payload,
        },
      };
    case "SET_STEP_STATUS":
      return {
        ...state,
        stepStatus: {
          ...state.stepStatus,
          ...action.payload,
        },
      };
    default:
      return state;
  }

};



export function LlenarListadoFormProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return (
    <LlenarListadoFormContextProvider value={value}>
      {children}
    </LlenarListadoFormContextProvider>
  );
}

LlenarListadoFormProvider.propTypes = {
  children: PropTypes.node,
};
