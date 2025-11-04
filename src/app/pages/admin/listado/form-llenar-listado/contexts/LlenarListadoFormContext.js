import { createSafeContext } from "utils/createSafeContext";

export const [LlenarListadoFormContextProvider, useLlenarListadoFormContext] = createSafeContext(
  "useLlenarListadoFormContext must be used within a LlenarListadoFormProvider",
);
