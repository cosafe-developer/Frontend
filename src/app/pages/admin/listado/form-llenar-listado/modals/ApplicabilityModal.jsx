import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "components/ui";
import PropTypes from "prop-types";
import { useRef } from "react";

export function ApplicabilityModal({ show, onClose, stepLabel, onApplies, onNotApplies }) {
  const focusRef = useRef();

  return (
    <Transition
      appear
      show={show}
      as={Dialog}
      initialFocus={focusRef}
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
        className="relative flex w-full max-w-md flex-col overflow-y-auto rounded-lg bg-white px-6 py-8 text-center transition-all dark:bg-dark-700"
      >
        <QuestionMarkCircleIcon className="mx-auto size-20 shrink-0 text-primary-500" />

        <h3 className="mt-4 text-xl font-medium text-gray-800 dark:text-dark-100">
          ¿Aplica este checklist?
        </h3>

        <p className="mx-auto mt-3 max-w-xs text-gray-600 dark:text-dark-200">
          <span className="font-semibold text-primary-400">{stepLabel}</span>
          <br />
          ¿Este checklist aplica para la empresa evaluada?
        </p>

        <div className="mt-8 flex justify-center space-x-3">
          <Button
            onClick={onNotApplies}
            variant="outlined"
            className="h-10 min-w-[8rem]"
          >
            No aplica
          </Button>

          <Button
            ref={focusRef}
            onClick={onApplies}
            color="primary"
            className="h-10 min-w-[8rem]"
          >
            Sí, aplica
          </Button>
        </div>
      </TransitionChild>
    </Transition>
  );
}

ApplicabilityModal.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
  stepLabel: PropTypes.string,
  onApplies: PropTypes.func,
  onNotApplies: PropTypes.func,
};
