// Import Dependencies
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { FaLayerGroup, FaListUl } from "react-icons/fa";

// Local Imports
import { Avatar, Button, Card } from "components/ui";
import { AdjustmentsHorizontalIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useBreakpointsContext } from "app/contexts/breakpoint/context";
import { ApplicabilityConfigModal } from "../modals/ApplicabilityConfigModal";
import updateListado from "api/listados/updateListado";
import { Stepper } from "./Stepper";
import { UnderReview } from "./UnderReview";
import { Estudio } from "../steps-global/Estudio";
import { DatosGenerales } from "../steps-global/DatosGenerales";
import { estudioSteps } from "../steps-datos-estudio/estudio-pipc/EstudioSteps";
import { empresaSteps } from "../steps-datos-empresa/EmpresaSteps";
import { useLlenarListadoFormContext } from "../contexts/LlenarListadoFormContext";
import { buildAutosavePayload, diffAgainstBaseline, mergeBaseline } from "helpers/listadoData";
import { calendarEventsFrom } from "../utils/calendarActivities";
import { HELP } from "../../helpers/helpTexts";

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

const EstudioSteps = ({ currentEstudioStep, setCurrentEstudioStep, listado }) => {
  const llenarListadoFormCtx = useLlenarListadoFormContext();
  const stepStatus = llenarListadoFormCtx?.state?.formData;
  const stepApplicability = llenarListadoFormCtx?.state?.stepApplicability;
  const [showConfig, setShowConfig] = useState(false);

  return (
    <div className="max-w-xl">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-400 dark:text-dark-300">Pasos del estudio</span>
        <Button
          variant="outlined"
          className="h-7 px-2 text-xs"
          title={HELP.study.configure}
          onClick={() => setShowConfig(true)}
        >
          <AdjustmentsHorizontalIcon className="size-4 mr-1" />
          Configurar
        </Button>
      </div>
      <ol className="steps is-vertical">
        {estudioSteps.map((item, i) => {
          const isActive = stepStatus[item.key]?.isDone;
          const doesNotApply = stepApplicability[item.key] === false;
          const isClickable = !doesNotApply;
          return (
            <li
              key={i}
              className={clsx(
                "step pb-6",
                doesNotApply
                  ? "before:bg-gray-300 dark:before:bg-dark-600 opacity-50"
                  : currentEstudioStep > i
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
                  currentEstudioStep === i && !doesNotApply && "ring-2 ring-primary-500",
                  doesNotApply
                    ? "bg-gray-300 text-gray-500 dark:bg-dark-600 dark:text-dark-400"
                    : isActive
                      ? "bg-primary-600 text-white ring-offset-[3px] ring-offset-gray-100 dark:bg-primary-500 dark:ring-offset-dark-900"
                      : "bg-gray-200 text-gray-950 dark:bg-dark-500",
                )}
              >
                {doesNotApply ? "—" : i + 1}
              </button>
              <h3 className={clsx(
                "mt-1.5 ltr:ml-4 rtl:mr-4 text-left",
                doesNotApply
                  ? "text-gray-400 line-through dark:text-dark-400"
                  : "text-gray-600 dark:text-dark-100",
              )}>
                {item.label}
                {doesNotApply && <span className="text-xs ml-2 text-gray-400">(N/A)</span>}
              </h3>
            </li>
          );
        })}
      </ol>

      <ApplicabilityConfigModal
        show={showConfig}
        onClose={() => setShowConfig(false)}
        listado={listado}
      />
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
  // en teléfono la lista de pasos va arriba y plegada; se cierra al cambiar de paso
  const { smAndUp } = useBreakpointsContext();
  const [stepsOpen, setStepsOpen] = useState(false);
  useEffect(() => {
    setStepsOpen(false);
  }, [currentStep, currentEmpresaStep, currentEstudioStep]);

  const llenarListadoFormCtx = useLlenarListadoFormContext();

  // Auto-save silencioso al cambiar de step
  const prevEmpresaStep = useRef(currentEmpresaStep);
  const prevEstudioStep = useRef(currentEstudioStep);
  const prevMainStep = useRef(currentStep);
  // Lo que ya está en la BD (como payload de auto-guardado); se fija al cargar el listado
  const autosaveBaseline = useRef(null);

  useEffect(() => {
    const changed =
      prevEmpresaStep.current !== currentEmpresaStep ||
      prevEstudioStep.current !== currentEstudioStep ||
      prevMainStep.current !== currentStep;

    if (changed) {
      // Guardar datos actuales al backend. El payload se sanitiza: nunca se
      // mandan File/Blob (serializan a {}), dataURLs, _uid/localPreview,
      // objetos vacíos ni studyData.estudio; las claves omitidas conservan
      // lo que ya está guardado (merge del backend).
      const payload = buildAutosavePayload({
        stepStatus: llenarListadoFormCtx?.state?.stepStatus || {},
        formData: llenarListadoFormCtx?.state?.formData || {},
        listadoId: listado?._id,
      });

      // Sólo lo que cambió desde que se abrió el listado (o desde el último
      // auto-guardado): abrir un listado y moverse entre pasos sin editar no
      // debe reescribir nada en la BD.
      const changes = diffAgainstBaseline(payload, autosaveBaseline.current);
      if (listado?._id && changes) {
        updateListado({ requestBody: changes })
          .then(() => {
            autosaveBaseline.current = mergeBaseline(autosaveBaseline.current, changes);
          })
          .catch((err) => console.warn("Auto-save falló:", err));
      }
    }

    prevEmpresaStep.current = currentEmpresaStep;
    prevEstudioStep.current = currentEstudioStep;
    prevMainStep.current = currentStep;
  }, [currentEmpresaStep, currentEstudioStep, currentStep, llenarListadoFormCtx, listado]);

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

    // Secciones que viven en Información de Riesgo pero se guardan en studyData
    ["resourceInventory", "evidencePhotos"].forEach((key) => {
      if (listado?.studyData?.[key]) {
        estudioStepStatus[key] = {
          ...listado.studyData[key],
          isDone: listado.studyData[key]?.isDone ?? false,
        };
      }
    });

    const loadedStepStatus = {
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
        // [{ date, activity }]; los listados viejos sólo traen preventionCalendarDate
        preventionCalendarEvents: calendarEventsFrom(listado?.riskInfo),
        isDone: listado?.riskInfo?.isDone ?? false,
      },
    };

    llenarListadoFormCtx.dispatch({
      type: "SET_STEP_STATUS",
      payload: {
        ...loadedStepStatus,
        datos_generales: {
          isDone: isDatosGeneralesEmpresaCompleted,
        },
      },
    });

    autosaveBaseline.current = buildAutosavePayload({
      stepStatus: loadedStepStatus,
      formData: estudioStepStatus,
      listadoId: listado?._id,
    });

    llenarListadoFormCtx.dispatch({
      type: "SET_FORM_DATA",
      payload: {
        ...estudioStepStatus
      },
    });

    // Cargar applicabilidad de steps desde backend
    const savedApplicability = listado?.studyData?.stepApplicability;
    if (savedApplicability) {
      llenarListadoFormCtx.dispatch({
        type: "SET_STEP_APPLICABILITY",
        payload: savedApplicability,
      });
    }

    if (isDatosGeneralesEmpresaCompleted) {
      setCurrentStep(1);

      const excludedKeys = [
        "socioOrganizationalAgent",
        "geologicalAgent",
        "physicochemicalAgent",
        "sanitaryAgent",
        "surroundingRisks",
        "securityMeasures"
      ];

      const lastDoneIndex = estudioSteps.reduce((acc, step, index) => {
        return listado?.studyData?.[step.key]?.isDone ? index : acc;
      }, -1);

      if (lastDoneIndex !== -1) {
        const lastDoneKey = estudioSteps[lastDoneIndex].key;

        if (excludedKeys.includes(lastDoneKey)) {
          setCurrentEstudioStep(lastDoneIndex);
        } else {
          const nextStep = lastDoneIndex + 1;
          setCurrentEstudioStep(Math.min(nextStep, estudioSteps.length - 1));
        }
      } else {
        setCurrentEstudioStep(0);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listado]);


  // Wrapper de Steps 
  const stepsNode = (
    <>
      <div className="col-span-12 sm:col-span-8 lg:col-span-9 mb-28">
        <div className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-5 lg:py-6">

          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {currentStep === 0
              ? "Llenar Datos de la Empresa"
              : estudioSteps[currentEstudioStep]?.label}
          </h2>


          <div className="flex min-w-0 items-center space-x-2">
            <Avatar
              size={10}
              name={empresa?.tradeName}
              src=""
              classNames={{
                display: "mask is-squircle rounded-none text-sm",
              }}
            />
            <span className="truncate text-gray-700 dark:text-dark-100 text-[15px] font-medium">
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
      <div className="col-span-12 max-sm:order-first sm:col-span-4 lg:col-span-3">
        {!smAndUp && (
          <button
            type="button"
            onClick={() => setStepsOpen((v) => !v)}
            aria-expanded={stepsOpen}
            className="mt-5 flex w-full items-center justify-between gap-3 rounded-lg border border-gray-200 px-4 py-3 text-start dark:border-dark-500 dark:bg-dark-700"
          >
            <span className="min-w-0">
              <span className="block text-xs opacity-80">
                {currentStep === 0
                  ? `Datos Generales · Paso ${currentEmpresaStep + 1} de ${empresaSteps.length}`
                  : `Estudio · Paso ${currentEstudioStep + 1} de ${estudioSteps.length}`}
              </span>
              <span className="block truncate font-medium text-primary-600 dark:text-primary-400">
                {currentStep === 0
                  ? empresaSteps[currentEmpresaStep]?.label
                  : estudioSteps[currentEstudioStep]?.label}
              </span>
            </span>
            <ChevronDownIcon className={clsx("size-5 shrink-0 transition-transform", stepsOpen && "rotate-180")} />
          </button>
        )}
        <div className={clsx("flex flex-col gap-y-6", !smAndUp && !stepsOpen && "hidden", !smAndUp && "mt-4 rounded-lg border border-gray-200 p-4 dark:border-dark-500")}>
          <div className="sm:mt-20">
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
                  listado={listado}
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
            <UnderReview listadoId={listado?._id} />
          </div>
        ) : (
          stepsNode
        )}
      </div>

    </div>
  );
};

export default LlenarListadoForm;