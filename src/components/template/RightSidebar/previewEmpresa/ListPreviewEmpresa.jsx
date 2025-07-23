
// Local Imports
import { Table, THead, TBody, Th, Tr, Td } from "components/ui";

// ----------------------------------------------------------------------

const cols = ["CHECKLIST", "PROGRESO"];

const data = [
  {
    verification_name: "Checklist de Requerimientos",
    progress: "100%",
  },
  {
    verification_name: "Checklist tipo de Riesgo",
    progress: "100%",
  },
  {
    verification_name: "Checklist por Daño Estructural",
    progress: "75%",
  },
  {
    verification_name: "Checklist de Riesgos por Deficiencia en las Instalaciones",
    progress: "45%",
  },
  {
    verification_name: "Checklist de Riesgos por Acabados en el Inmueble",
    progress: "25%",
  },
  {
    verification_name: "Checklist de Agente Perturbador de Tipo Socio-Organizativo",
    progress: "100%",
  },
];

export function ListPreviewEmpresa() {
  return (
    <div className="hide-scrollbar min-w-full overflow-x-auto">
      <Table className="w-full text-left rtl:text-right">
        <THead>
          <Tr className="border-y border-transparent border-b-gray-200 dark:border-b-dark-500">
            {cols.map((title, index) => (
              <Th
                key={index}
                className="font-semibold uppercase text-gray-800 dark:text-dark-100"
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

            return (
              <Tr
                key={index}
                className="border-y border-transparent border-b-gray-200 dark:border-b-dark-500"
              >
                <Td>{tr.verification_name}</Td>
                <Td className={`font-semibold ${textColorClass}`}>
                  {tr.progress}
                </Td>
              </Tr>
            );
          })}
        </TBody>
      </Table>
    </div>
  );
}
