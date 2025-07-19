import PropTypes from "prop-types";
import { useEffect, useReducer } from "react";

import { setSession } from "utils/jwt";
import { AuthContext } from "./context";
import { ApiLoginAdmin, checkAdminSession } from "api/admin/login";

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
        const session = await checkAdminSession();
        if (session) {
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
      const { admin, mensaje } = await ApiLoginAdmin(email, password);
      if (mensaje === "Login exitoso") {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: {
            admin,
          },
        });
      } else {
        dispatch({
          type: "LOGIN_ERROR",
          payload: {
            mensaje,
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
    setSession(null);
    dispatch({ type: "LOGOUT" });
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
      }}
    >
      {children}
    </AuthContext>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
