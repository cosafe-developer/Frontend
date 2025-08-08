
// Local Imports
import { Table, THead, TBody, Th, Tr, Td, Button } from "components/ui";
import { truncateText } from "helpers/truncateText.helper";
import { useState } from "react";
import { Navigate } from "react-router";

// ----------------------------------------------------------------------

const cols = ["ESTUDIOS", "PROGRESO"];

const data = [
  {
    certificado: "Checklist de Requerimientos",
    fecha: "05.05.2025",
    progress: "100%",
  },
  {
    certificado: "Checklist tipo de Riesgo",
    fecha: "06.05.2025",
    progress: "100%",
  },
  {
    certificado: "Checklist por Daño Estructural",
    fecha: "07.05.2025",
    progress: "75%",
  },
  {
    institucion: "Santander",
    certificado: "Checklist de Riesgos por Deficiencia en las Instalaciones",
    fecha: "08.05.2025",
    progress: "45%",
  },
  {
    certificado: "Checklist de Riesgos por Acabados en el Inmueble",
    fecha: "09.05.2025",
    progress: "25%",
  },
  {
    certificado: "Checklist de Agente Perturbador de Tipo Socio-Organizativo",
    fecha: "10.05.2025",
    progress: "100%",
  },
];

export function ContentAdministrarEmpresa({ close }) {
  const [redirect, setRedirect] = useState(false);

  const handleAdministrarEmpresa = () => {
    setRedirect(true);
  };

  if (redirect) {
    close();
    return <Navigate to="/admin/empresas/editar" />;
  }

  return (
    <div className="min-w-full mt-5 px-4">

      <div className="hide-scrollbar max-h-[500px] overflow-y-auto ">
        <Table className="w-full text-left rtl:text-right">
          <THead>
            <Tr className="border-y border-transparent border-b-gray-200 dark:border-b-dark-500">
              {cols.map((title, index) => (
                <Th
                  key={index}
                  className="sticky top-0 bg-white dark:bg-dark-700 font-semibold uppercase text-gray-800 dark:text-dark-100 border-b border-gray-200 dark:border-dark-500"
                >
                  {title}
                </Th>
              ))}
            </Tr>
          </THead>

          <TBody>
            {data.map((tr, index) => {
              const progressValue = parseInt(tr.progress);
              let textColorClass = "";

              if (progressValue >= 50) {
                textColorClass = "text-success";
              } else if (progressValue > 25) {
                textColorClass = "text-warning";
              } else {
                textColorClass = "text-[#9b0708]";
              }

              const fullText = `${tr.certificado} - ${tr.fecha}`;

              return (
                <Tr
                  key={index}
                  className="border-y border-transparent border-b-gray-200 dark:border-b-dark-500"
                >
                  <Td title={fullText} className="truncate max-w-[400px] cursor-pointer">
                    {truncateText(tr.certificado, 40)} -{" "}
                    <span className="text-[#60a5fa]">{tr.fecha}</span>
                  </Td>
                  <Td className={`font-semibold ${textColorClass}`}>
                    {tr.progress}
                  </Td>
                </Tr>
              );
            })}
          </TBody>
        </Table>
      </div>

      <div className="mt-14 flex justify-end space-x-3">
        <Button
          onClick={close}
          color="neutral"
          className="h-10 text-base font-light"
        >
          Cancelar
        </Button>

        <Button
          onClick={handleAdministrarEmpresa}
          color="primary"
          className="h-10 text-base font-light"
        >
          Ver
        </Button>
      </div>
    </div>
  );
}
