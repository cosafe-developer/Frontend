// Import Dependencies
import clsx from "clsx";
import { useState } from "react";
import { FaLayerGroup, FaListUl } from "react-icons/fa";

// Local Imports
import { Card } from "components/ui";
import { LlenarListadoFormProvider } from "./LlenarListadoFormProvider";
import { Stepper } from "./Stepper";
import { UnderReview } from "./UnderReview";
import { Estudio } from "./steps-global/Estudio";
import { useLlenarListadoFormContext } from "./LlenarListadoFormContext";

import { DatosGenerales } from "./steps-global/DatosGenerales";

import { estudioSteps } from "./steps-datos-estudio/EstudioSteps";
import { empresaSteps } from "./steps-datos-empresa/EmpresaSteps";

// ----------------------------------------------------------------------

const EmpresaSteps = ({ currentEmpresaStep }) => {
  const addProductFormCtx = useLlenarListadoFormContext();
  const stepStatus = addProductFormCtx.state.stepStatus;
  return (
    <div className="max-w-xl">
      <ol className="steps is-vertical">
        {empresaSteps
          .map((item, i) => {
            const isActive = stepStatus[item.key].isDone;
            return (
              <li
                // className="step pb-6 before:bg-gray-200 dark:before:bg-surface-2"
                className={clsx(
                  "step pb-6",
                  currentEmpresaStep > i
                    ? "before:bg-primary-500"
                    : "before:bg-gray-200 dark:before:bg-dark-500",
                )}
                key={i}
              >
                <div
                  className={clsx(
                    "step-header rounded-full outline-hidden dark:text-white",
                    // isClickable && "cursor-pointer",
                    currentEmpresaStep === i && "ring-2 ring-primary-500",
                    isActive
                      ? "bg-primary-600 text-white ring-offset-[3px] ring-offset-gray-100 dark:bg-primary-500 dark:ring-offset-dark-900"
                      : "bg-gray-200 text-gray-950 dark:bg-dark-500",
                  )}
                // className={`step-header rounded-full bg-gray-200 text-gray-800 dark:bg-surface-2 dark:text-white ${currentEmpresaStep === i ? "ring-2 ring-primary-500" : ""}`}
                >
                  {i + 1}
                </div>
                <h3 className="text-gray-600 mt-1.5 ltr:ml-4 rtl:mr-4 dark:text-dark-100">
                  {item.label}
                </h3>
              </li>
            )
          })}
      </ol>
    </div>
  );
}

const EstudioSteps = () => {
  return (
    <div className="max-w-xl">
      <ol className="steps is-vertical">
        {estudioSteps
          .map((item, i) => (
            <li
              className="step pb-6 before:bg-gray-200 dark:before:bg-surface-2"
              key={i}
            >
              <div className="step-header rounded-full bg-gray-200 text-gray-800 dark:bg-surface-2 dark:text-white">
                {i + 1}
              </div>
              <h3 className="text-gray-600 mt-1.5 ltr:ml-4 rtl:mr-4 dark:text-dark-100">
                {item.label}
              </h3>
            </li>
          ))}
      </ol>
    </div>
  );
}

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

const LlenarListadoForm = () => {
  // Pasos Globales
  const [currentStep, setCurrentStep] = useState(0);
  // Pasos - Datos Generales Empresa
  const [currentEmpresaStep, setCurrentEmpresaStep] = useState(0);
  // Pasos - Datos Estudio Empresa
  const [currentEStudioStep, setCurrentEstudioStep] = useState(0);
  // Estado de finalización
  const [finished, setFinished] = useState(false);

  // Formulario Activo
  const ActiveForm = steps[currentStep].component;

  // Wrapper de Steps 
  const stepsNode = (
    <>
      <div className="col-span-12 sm:col-span-8 lg:col-span-9 mb-28">
        <h2 className="py-5 text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:py-6 lg:text-2xl">
          {
            currentStep === 0 ? "Llenar Datos de la Empresa" : steps[currentStep].label
          }
        </h2>
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
                  currentEStudioStep={currentEStudioStep}
                  setCurrentEstudioStep={setCurrentEstudioStep}
                  setCurrentEmpresaStep={setCurrentEmpresaStep}
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
                <EmpresaSteps currentEmpresaStep={currentEmpresaStep} />
              </div>
              :
              <div className="pl-1.5">
                <EstudioSteps />
              </div>
          }
        </div>
      </div>
    </>
  );

  return (
    <div className="transition-content grid w-full grid-rows-[auto_1fr] px-(--margin-x) pb-8">
      <LlenarListadoFormProvider>
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
      </LlenarListadoFormProvider>
    </div>
  );
};

export default LlenarListadoForm;
