
import { LlenarListadoFormProvider } from "./contexts/LlenarListadoFormProvider";
import LlenarListado from "./LlenarListado";


export default function LlenarListadoIndex() {



  return (
    <LlenarListadoFormProvider>
      <LlenarListado />
    </LlenarListadoFormProvider>
  )
}
