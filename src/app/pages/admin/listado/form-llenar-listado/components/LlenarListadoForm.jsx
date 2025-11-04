// Import Dependencies
import clsx from "clsx";
import { useEffect, useState } from "react";
import { FaLayerGroup, FaListUl } from "react-icons/fa";

// Local Imports
import { Avatar, Card } from "components/ui";
import { Stepper } from "./Stepper";
import { UnderReview } from "./UnderReview";
import { Estudio } from "../steps-global/Estudio";
import { DatosGenerales } from "../steps-global/DatosGenerales";
import { estudioSteps } from "../steps-datos-estudio/estudio-pipc/EstudioSteps";
import { empresaSteps } from "../steps-datos-empresa/EmpresaSteps";
import { useLlenarListadoFormContext } from "../contexts/LlenarListadoFormContext";

// ----------------------------------------------------------------------

const EmpresaSteps = ({ currentEmpresaStep, setCurrentEmpresaStep }) => {
  const llenarListadoFormCtx = useLlenarListadoFormContext();
  const stepStatus = llenarListadoFormCtx?.state?.stepStatus;

  return (
    <div className="max-w-xl">
      <ol className="steps is-vertical">
        {empresaSteps.map((item, i) => {
          const isActive = stepStatus[item.key]?.isDone;
          const isClickable = isActive;
          return (
            <li
              key={i}
              className={clsx(
                "step pb-6",
                currentEmpresaStep > i
                  ? "before:bg-primary-500"
                  : "before:bg-gray-200 dark:before:bg-dark-500",
              )}
            >
              <button
                onClick={() => isClickable && setCurrentEmpresaStep(i)}
                disabled={!isClickable}
                className={clsx(
                  "step-header rounded-full outline-hidden dark:text-white",
                  isClickable && "cursor-pointer hover:scale-105 transition-transform",
                  currentEmpresaStep === i && "ring-2 ring-primary-500",
                  isActive
                    ? "bg-primary-600 text-white ring-offset-[3px] ring-offset-gray-100 dark:bg-primary-500 dark:ring-offset-dark-900"
                    : "bg-gray-200 text-gray-950 dark:bg-dark-500",
                )}
              >
                {i + 1}
              </button>
              <h3 className="text-gray-600 mt-1.5 ltr:ml-4 rtl:mr-4 text-left dark:text-dark-100">
                {item.label}
              </h3>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

const EstudioSteps = ({ currentEstudioStep, setCurrentEstudioStep }) => {
  const llenarListadoFormCtx = useLlenarListadoFormContext();
  const stepStatus = llenarListadoFormCtx?.state?.formData;

  return (
    <div className="max-w-xl">
      <ol className="steps is-vertical">
        {estudioSteps.map((item, i) => {
          const isActive = stepStatus[item.key]?.isDone;
          const isClickable = isActive;
          return (
            <li
              key={i}
              className={clsx(
                "step pb-6",
                currentEstudioStep > i
                  ? "before:bg-primary-500"
                  : "before:bg-gray-200 dark:before:bg-dark-500",
              )}
            >
              <button
                onClick={() => isClickable && setCurrentEstudioStep(i)}
                disabled={!isClickable}
                className={clsx(
                  "step-header rounded-full outline-hidden dark:text-white",
                  isClickable && "cursor-pointer hover:scale-105 transition-transform",
                  currentEstudioStep === i && "ring-2 ring-primary-500",
                  isActive
                    ? "bg-primary-600 text-white ring-offset-[3px] ring-offset-gray-100 dark:bg-primary-500 dark:ring-offset-dark-900"
                    : "bg-gray-200 text-gray-950 dark:bg-dark-500",
                )}
              >
                {i + 1}
              </button>
              <h3 className="text-gray-600 mt-1.5 ltr:ml-4 rtl:mr-4 text-left dark:text-dark-100">
                {item.label}
              </h3>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

const steps = [
  {
    key: "datos_generales",
    component: DatosGenerales,
    label: "Datos Generales",
    descripcion: "Por favor proporciona la información de la empresa para completar su estudio",
    icon: FaLayerGroup,
  },
  {
    key: "estudio",
    component: Estudio,
    label: "Estudio",
    icon: FaListUl,
  },
];

const LlenarListadoForm = ({ listado, empresa }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentEmpresaStep, setCurrentEmpresaStep] = useState(0);
  const [currentEstudioStep, setCurrentEstudioStep] = useState(0);
  const [finished, setFinished] = useState(false);
  const ActiveForm = steps[currentStep].component;

  const llenarListadoFormCtx = useLlenarListadoFormContext();

  useEffect(() => {
    if (!listado) return;

    const isDatosGeneralesEmpresaCompleted =
      listado?.companyInfo?.isDone === true &&
      listado?.addressInfo?.isDone === true &&
      listado?.riskInfo?.isDone === true;


    const estudioStepStatus = {};
    estudioSteps.forEach((step) => {
      estudioStepStatus[step.key] = {
        ...listado?.studyData?.[step.key],
        isDone: listado?.studyData?.[step.key]?.isDone ?? false,
      };
    });

    llenarListadoFormCtx.dispatch({
      type: "SET_STEP_STATUS",
      payload: {
        companyInfo: {
          ...listado.companyInfo,
          isDone: listado?.companyInfo?.isDone ?? false,
        },
        addressInfo: {
          ...listado.addressInfo,
          isDone: listado?.addressInfo?.isDone ?? false,
        },
        riskInfo: {
          ...listado.riskInfo,
          isDone: listado?.riskInfo?.isDone ?? false,
        },
        datos_generales: {
          isDone: isDatosGeneralesEmpresaCompleted,
        },
      },
    });

    llenarListadoFormCtx.dispatch({
      type: "SET_FORM_DATA",
      payload: {
        ...estudioStepStatus
      },
    });


    if (isDatosGeneralesEmpresaCompleted) {
      setCurrentStep(1);

      const lastDoneIndex = estudioSteps.reduce((acc, step, index) => {
        return listado?.studyData?.[step.key]?.isDone ? index : acc;
      }, -1);

      setCurrentEstudioStep(lastDoneIndex + 1);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listado]);


  // Wrapper de Steps 
  const stepsNode = (
    <>
      <div className="col-span-12 sm:col-span-8 lg:col-span-9 mb-28">
        <div className="flex items-center  justify-between space-x-5 py-5 lg:py-6">

          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {currentStep === 0
              ? "Llenar Datos de la Empresa"
              : estudioSteps[currentEstudioStep].label}
          </h2>


          <div className="flex items-center space-x-2">
            <Avatar
              size={10}
              name={empresa?.tradeName}
              src=""
              classNames={{
                display: "mask is-squircle rounded-none text-sm",
              }}
            />
            <span className="text-gray-700 dark:text-dark-100 text-[15px] font-medium">
              {empresa?.tradeName} /
            </span>
            <span className="text-blue-400 text-[15px] font-medium">
              {listado?.studyId?.studyName ?? ""}
            </span>
          </div>
        </div>

        <Card className="flex h-full flex-col">
          {currentStep !== 1 && (
            <div className="flex flex-col items-left space-x-2 border-b border-gray-200 p-4 dark:border-dark-500 sm:px-5 ">
              <h4 className="text-lg font-medium text-gray-800 dark:text-dark-100">
                <span> {steps[currentStep].label}</span>
              </h4>
              <p>{steps[currentStep].descripcion}</p>
            </div>
          )}
          {
            !finished && (
              <div className="flex grow flex-col p-4 sm:p-5">
                <ActiveForm
                  setFinished={setFinished}
                  setCurrentStep={setCurrentStep}
                  currentEmpresaStep={currentEmpresaStep}
                  currentEstudioStep={currentEstudioStep}
                  setCurrentEstudioStep={setCurrentEstudioStep}
                  setCurrentEmpresaStep={setCurrentEmpresaStep}
                  listado={listado}
                  empresa={empresa}
                />
              </div>
            )
          }
        </Card>
      </div>
      <div className="col-span-12 sm:col-span-4 lg:col-span-3">
        <div className="flex flex-col gap-y-6">
          <div className="mt-20">
            <Stepper
              steps={steps}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
            />
          </div>
          {
            currentStep === 0
              ?
              <div className="pl-1.5">
                <EmpresaSteps
                  currentEmpresaStep={currentEmpresaStep}
                  setCurrentEmpresaStep={setCurrentEmpresaStep}
                />
              </div>
              :
              <div className="pl-1.5">
                <EstudioSteps
                  currentEstudioStep={currentEstudioStep}
                  setCurrentEstudioStep={setCurrentEstudioStep}
                />
              </div>
          }
        </div>
      </div>
    </>
  );

  return (
    <div className="transition-content grid w-full grid-rows-[auto_1fr] px-(--margin-x) pb-8">

      <div
        className={clsx(
          "grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6",
          !finished && "grid-rows-[auto_1fr] sm:grid-rows-none",
        )}
      >
        {finished ? (
          <div className="col-span-12 place-self-center">
            <UnderReview />
          </div>
        ) : (
          stepsNode
        )}
      </div>

    </div>
  );
};

export default LlenarListadoForm;