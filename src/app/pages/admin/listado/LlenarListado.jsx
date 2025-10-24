import { Page } from "components/shared/Page";
import { useState, useEffect } from "react";
import LoadingContent from "components/template/LoadingContent";
import LlenarListadoForm from "./form-llenar-listado/LlenarListadoForm";

// const dataMock = {
//   // 0 = datos generales
//   // 1 = estudio
//   paso_actual: 0,
//   datos_generales: {
//     informacion_empresa: {
//       logotipo: null,
//       nombre: "",
//       rfc: "",
//       email: "",
//       domicilio: "",
//       domicilio_fisico: "",
//       telefono: ""
//     },
//     informacion_de_la_direccion: {
//       constancia_fiscal: null,
//       actividades_empresa: "",
//       giro_empresarial: "",
//       responsable_inmueble: "",
//       cargo_responsable_inmueble: "",
//       nombre_representante: "",
//       cargo_representante: "",
//       firma_representante: null,
//       ine_representante: null,
//       domicilio_fisico: "",
//       domicilio_notificaciones: "",
//       superficie_terreno: "",
//       poblacion_fija: "",
//       colindancias_inmueble: "",
//       areas_inmueble: ""
//     },
//     informacion_de_riesgo: {
//       descripcion_empresa: "",
//       tipo_riesgo_interno: "",
//       antecedentes: "",
//       riesgos_generales_internos: ""
//     }
//   },
//   estudio: {}
// }

const LlenarListado = () => {
  const endPointListado = "/get/listado/:id";
  const [isFetching, setIsFetching] = useState(true);
  // const [data, setData] = useState(null);

  // console.log(data);

  useEffect(() => {
    const fetchData = async ({ endpoint }) => {
      console.log(endpoint);
      // SIMULACIÓN DE FETCH
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // setData(dataMock);
      setIsFetching(false);
    };

    if (isFetching) {
      fetchData({ endpoint: endPointListado });
    }
  }, [isFetching]);

  if (isFetching) {
    return <LoadingContent />
  }

  return (
    <Page title="Llenar Listado">
      <LlenarListadoForm />
    </Page>
  );
}

export default LlenarListado;