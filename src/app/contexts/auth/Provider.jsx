// Import Dependencies
import { useEffect, useReducer } from "react";
// import isObject from "lodash/isObject";
import PropTypes from "prop-types";
// import isString from "lodash/isString";

// Local Imports
// import axios from "utils/axios";
// import { isTokenValid, setSession } from "utils/jwt";
import { setSession } from "utils/jwt";
import { AuthContext } from "./context";
import { ApiLoginAdmin, checkAdminSession } from "api/admin/login";

// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  errorMessage: null,
  user: null,
};

const reducerHandlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
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
    console.log("LOGIN_SUCCESS: ", user);

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
        // validar sesión activa
        const session = await checkAdminSession();
        if (session && session.role === 'admin') {
          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: true,
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
        // const authToken = window.localStorage.getItem("authToken");

        // if (authToken && isTokenValid(authToken)) {
        //   setSession(authToken);

        //   const response = await axios.get("/user/profile");
        //   const { user } = response.data;

        //   dispatch({
        //     type: "INITIALIZE",
        //     payload: {
        //       isAuthenticated: true,
        //       user,
        //     },
        //   });
        // } else {
        //   dispatch({
        //     type: "INITIALIZE",
        //     payload: {
        //       isAuthenticated: false,
        //       user: null,
        //     },
        //   });
        // }
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
        throw new Error("Error en la petición");
      }
      // const response = await axios.post("/login", {
      //   username: email,
      //   password,
      // });

      // console.log(response);

      // console.log(response.data);
      // const { authToken, admin, mensaje } = response.data;

      // console.log(authToken);
      // console.log(admin);
      // console.log(mensaje);

      // if (!isString(authToken) && !isObject(user)) {
      //   throw new Error("Response is not vallid");
      // }

      // setSession(authToken);

      // dispatch({
      //   type: "LOGIN_SUCCESS",
      //   payload: {
      //     user,
      //   },
      // });

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
