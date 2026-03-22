import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button, Switch } from "components/ui";
import PropTypes from "prop-types";
import { useLlenarListadoFormContext } from "../contexts/LlenarListadoFormContext";
import { estudioSteps } from "../steps-datos-estudio/estudio-pipc/EstudioSteps";
import updateListado from "api/listados/updateListado";

export function ApplicabilityConfigModal({ show, onClose, listado }) {
  const llenarListadoFormCtx = useLlenarListadoFormContext();
  const stepApplicability = llenarListadoFormCtx?.state?.stepApplicability;

  const handleToggle = async (stepKey, applies) => {
    const newApplicability = { ...stepApplicability, [stepKey]: applies };

    llenarListadoFormCtx.dispatch({
      type: "SET_STEP_APPLICABILITY",
      payload: { [stepKey]: applies },
    });

    if (!applies) {
      // No aplica → marcar como done para porcentajes
      llenarListadoFormCtx.dispatch({
        type: "SET_FORM_DATA",
        payload: {
          [stepKey]: {
            ...llenarListadoFormCtx.state.formData[stepKey],
            isDone: true,
          },
        },
      });
    } else {
      // Reactiva → restaurar isDone real del backend
      const realIsDone = listado?.studyData?.[stepKey]?.isDone ?? false;
      llenarListadoFormCtx.dispatch({
        type: "SET_FORM_DATA",
        payload: {
          [stepKey]: {
            ...llenarListadoFormCtx.state.formData[stepKey],
            isDone: realIsDone,
          },
        },
      });
    }

    try {
      await updateListado({
        requestBody: {
          listado_id: listado?._id,
          studyData: {
            stepApplicability: newApplicability,
          },
        },
      });
    } catch (err) {
      console.error("Error al guardar configuración:", err);
    }
  };

  return (
    <Transition
      appear
      show={show}
      as={Dialog}
      onClose={onClose}
      className="fixed inset-0 z-100 flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
    >
      <TransitionChild
        as="div"
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="absolute inset-0 bg-gray-900/50 transition-opacity dark:bg-black/40"
      />

      <TransitionChild
        as={DialogPanel}
        enter="ease-out duration-300"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
        className="scrollbar-sm relative flex w-full max-w-lg flex-col overflow-y-auto rounded-lg bg-white px-6 py-6 transition-all dark:bg-dark-700 max-h-[85vh]"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-800 dark:text-dark-100">
            Configurar aplicabilidad de pasos
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-dark-600 cursor-pointer"
          >
            <XMarkIcon className="size-5 text-gray-500" />
          </button>
        </div>

        <p className="text-sm text-gray-500 dark:text-dark-300 mb-5">
          Activa o desactiva los pasos del estudio que aplican para esta empresa.
          Los pasos desactivados se marcarán como &quot;No aplica&quot; y no se incluirán en el estudio.
        </p>

        <div className="space-y-3">
          {estudioSteps.map((step) => {
            const applies = stepApplicability[step.key] !== false;
            return (
              <div
                key={step.key}
                className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-dark-500 px-4 py-3"
              >
                <div className="flex-1 pr-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-dark-100">
                    {step.label}
                  </p>
                  {!applies && (
                    <span className="text-xs text-gray-400">No aplica</span>
                  )}
                </div>
                <Switch
                  checked={applies}
                  onChange={(e) => handleToggle(step.key, e.target.checked)}
                />
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={onClose} color="primary" className="h-9 min-w-[7rem]">
            Listo
          </Button>
        </div>
      </TransitionChild>
    </Transition>
  );
}

ApplicabilityConfigModal.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
  listado: PropTypes.object,
};
