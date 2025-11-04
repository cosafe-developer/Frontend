import { useState } from "react";
import { Navigate } from "react-router";
import { Table, THead, TBody, Th, Tr, Td, Button } from "components/ui";
import { truncateText } from "helpers/truncateText.helper";
import { estudioSteps } from "app/pages/admin/listado/form-llenar-listado/steps-datos-estudio/estudio-pipc/EstudioSteps";

const cols = ["CHECKLIST", "PROGRESO"];


export function ContentPreviewEmpresa({ close, data }) {
  const [redirect, setRedirect] = useState(false);

  const taskScores = Object.entries(data?.progressSections).map(([key, value]) => {
    const labelObj = estudioSteps.find((estudio) => estudio.key === key);
    return {
      key: key,
      label: labelObj ? labelObj.label : key,
      progress: Math.round(value)
    };
  });

  const handlePreviewEmpresa = () => {
    setRedirect(true);
  };

  if (redirect) {
    close();
    return <Navigate to={`/admin/listado/completo/${data?._id}`} />;
  }

  return (
    <div className="min-w-full mt-5 px-4">
      <div className="hide-scrollbar max-h-[500px] overflow-y-auto">
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
            {taskScores.map((tr, index) => {
              const progressValue = parseInt(tr.progress);
              const textColorClass =
                progressValue >= 50
                  ? "text-success"
                  : progressValue > 25
                    ? "text-warning"
                    : "text-[#DE0405]";

              return (
                <Tr
                  key={index}
                  className="border-y border-transparent border-b-gray-200 dark:border-b-dark-500"
                >
                  <Td>{truncateText(tr.label, 60)}</Td>
                  <Td className={`font-semibold ${textColorClass}`}>
                    {tr.progress} %
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
          onClick={handlePreviewEmpresa}
          color="primary"
          className="h-10 text-base font-light"
        >
          Ver
        </Button>
      </div>
    </div>
  );
}
