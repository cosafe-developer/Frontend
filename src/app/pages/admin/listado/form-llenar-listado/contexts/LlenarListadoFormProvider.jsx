// Import Dependencies
import { useReducer } from "react";
import PropTypes from "prop-types";

// Local Imports
import { LlenarListadoFormContextProvider } from "./LlenarListadoFormContext";
// import { Delta } from "components/shared/form/TextEditor";

// ----------------------------------------------------------------------

const initialState = {
  formData: {
    //? Step 1
    nonStructuralRisks: {
      fallingObjects: null,
      slidingObjects: null,
      overturningObjects: null,
      flammableObjects: null,
      evacuationBlockingObjects: null,
      isDone: false,
    },
    //? Step 2
    structuralRisks: {
      structuralDamage: null,
      nonStructuralElements: null,
      finishes: null,
      isDone: false,
    },
    //? Step 3
    serviceInstallations: {
      hydraulicInstallation: null,
      gasInstallation: null,
      electricalInstallation: null,
      airConditioningInstallation: null,
      externalRisks: null,
      isDone: false,
    },
    //? Step 4
    socioOrganizationalAgent: {
      majorAccidents: null,
      criminalActs: null,
      socialDisturbances: null,
      isDone: false,
    },
    //? Step 5
    geologicalAgent: {
      geologicalDisruptions: null,
      seismicEvents: null,
      volcanism: null,
      isDone: false,
    },
    //? Step 6
    physicochemicalAgent: {
      fireAgent: null,
      chemicalSpill: null,
      explosionAgent: null,
      contamination: null,
      flooding: null,
      isDone: false,
    },
    //? Step 7
    sanitaryAgent: {
      epidemic: null,
      plague: null,
      // TODO: Validar cual es la key del "Agente pertubador"
      agent: null,
      isDone: false,
    },
    //? Step 8
    surroundingRisks: {
      externalRiskElements: null,
      isDone: false,
    },
    //? Step 9
    securityMeasures: {
      alarmSystem: null,
      isDone: false,
    },
    //? Step 10
    damageEvaluation: {
      damageElements: null,
      isDone: false,
    },
    //? Step 11
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
