// Import Dependencies
import { useReducer } from "react";
import PropTypes from "prop-types";

// Local Imports
import { LlenarListadoFormContextProvider } from "./LlenarListadoFormContext";
import { Delta } from "components/shared/form/TextEditor";

// ----------------------------------------------------------------------

const initialState = {
  formData: {
    general: {
      logotipo: null,
      nombre: "",
      rfc: "",
      email: "",
      domicilio: "",
      domicilio_fisico: "",
    },
    estudio: {},
    description: {
      short_description: "",
      description: new Delta(),
      meta_title: "",
      meta_description: "",
      meta_keywords: [],
    },
    images: {
      cover: null,
      gallery: [],
    },
  },
  stepStatus: {
    general: {
      isDone: false,
    },
    description: {
      isDone: false,
    },
    images: {
      isDone: false,
    },
    finish: {
      isDone: false,
    },
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
