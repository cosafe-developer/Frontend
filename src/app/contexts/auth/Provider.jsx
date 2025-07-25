import PropTypes from "prop-types";
import emailLogin from "api/auth/emailLogin";
import checkSessionActive from "api/auth/checkSessionActive";

import { useEffect, useReducer } from "react";
import { setSession } from "utils/jwt";
import { AuthContext } from "./context";
import logoutSession from "api/auth/logoutSession";


const initialState = {
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  errorMessage: null,
  user: null,
  role: null,
};

const reducerHandlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user, role } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
      role,
    };
  },

  LOGIN_REQUEST: (state) => {
    return {
      ...state,
      isLoading: true,
    };
  },

  LOGIN_SUCCESS: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      isLoading: false,
      user,
    };
  },

  CLEAR_ERROR_MESSAGE: (state) => ({
    ...state,
    errorMessage: null,
  }),

  LOGIN_ERROR: (state, action) => {
    const { errorMessage } = action.payload;

    return {
      ...state,
      errorMessage,
      isLoading: false,
    };
  },

  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
};

const reducer = (state, action) => {
  const handler = reducerHandlers[action.type];
  if (handler) {
    return handler(state, action);
  }
  return state;
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const init = async () => {
      try {
        const session = await checkSessionActive();

        if (session?.ok) {
          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: true,
              role: session.role,
            },
          });
        } else {
          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: false,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: "INITIALIZE",
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    init();
  }, []);

  const login = async ({ email, password }) => {
    dispatch({
      type: "LOGIN_REQUEST",
    });

    try {
      const response = await emailLogin({
        requestBody: {
          email: email,
          password: password
        }
      });


      if (!response?.ok) {
        dispatch({
          type: "LOGIN_ERROR",
          payload: {
            errorMessage: response?.message || "Error desconocido",
          },
        });
      } else {
        const usuario = response?.data?.usuario || null
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: {
            admin: usuario,
          },
        });
      }
    } catch (err) {
      dispatch({
        type: "LOGIN_ERROR",
        payload: {
          errorMessage: err,
        },
      });
    }
  };

  const logout = async () => {
    await logoutSession()

    setSession(null);
    dispatch({ type: "LOGOUT" });
  };

  const clearErrorMessage = () => {
    dispatch({ type: "CLEAR_ERROR_MESSAGE" });
  };


  if (!children) {
    return null;
  }

  return (
    <AuthContext
      value={{
        ...state,
        login,
        logout,
        clearErrorMessage,
      }}
    >
      {children}
    </AuthContext>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
