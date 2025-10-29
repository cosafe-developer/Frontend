// Import Dependencies
import { useReducer } from "react";
import PropTypes from "prop-types";

// Local Imports
import { LlenarListadoFormContextProvider } from "./LlenarListadoFormContext";
// import { Delta } from "components/shared/form/TextEditor";

// ----------------------------------------------------------------------

const initialState = {
  formData: {
    riesgos_por_daños_no_estructurales: {
      logotipo: null,
      nombre: "",
      rfc: "",
      email: "",
      domicilio: "",
      domicilio_fisico: "",
      isDone: false,
    },
    riesgos_por_daños_estructurales: {
      constancia_fiscal: null,
      actividades_empresa: "",
      giro_empresarial: "",
      responsable_inmueble: "",
      cargo_responsable_inmueble: "",
      nombre_representante: "",
      cargo_representante: "",
      firma_representante: null,
      ine_representante: null,
      domicilio_fisico: "",
      domicilio_notificaciones: "",
      superficie_terreno: "",
      poblacion_fija: "",
      colindancias_inmueble: "",
      areas_inmueble: "",
      isDone: false,
    },
    informacion_de_riesgo: {
      isDone: false,
    },
    agente_perturbador_socio_organizativo: {
      isDone: false,
    },
    agente_perturbador_geologico: {
      isDone: false,
    },
    agente_perturbador_fisico_quimico: {
      isDone: false,
    },
    agente_perturbador_sanitario: {
      isDone: false,
    },
    riesgos_circundantes: {
      isDone: false,
    },
    medidas_equipos_de_seguridad: {
      isDone: false,
    },
    evaluacion_de_daños: {
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
    informacion_empresa: {
      isDone: false,
    },
    informacion_de_la_direccion: {
      isDone: false,
    },
    informacion_de_riesgo: {
      isDone: false,
    },
    // ------------------------ 
    estudio: {
      isDone: false,
    },
  },
};

const reducerHandlers = {
  SET_FORM_DATA: (state, action) => {
    return {
      ...state,
      formData: {
        ...state.formData,
        ...action.payload,
      },
    };
  },
  SET_STEP_STATUS: (state, action) => {
    return {
      ...state,
      stepStatus: {
        ...state.stepStatus,
        ...action.payload,
      },
    };
  },
  SET_STEP_EMPRESA_STATUS: (state, action) => {
    return {
      ...state,
      stepStatus: {
        ...state.stepStatus,
        ...action.payload,
      },
    };
  },
  SET_STEP_ESTUDIO_STATUS: (state, action) => {
    return {
      ...state,
      stepStatus: {
        ...state.stepStatus,
        ...action.payload,
      },
    };
  },
};

const reducer = (state, action) =>
  reducerHandlers[action.type]?.(state, action) || state;

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
