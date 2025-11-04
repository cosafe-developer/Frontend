import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Button } from "components/ui";
import { Fragment, useEffect, useState } from "react";


// Modal de Observaciones
export function ObservationModal({ isOpen, onClose, initialValue = "", onSave }) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
        onClose={onClose}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="absolute inset-0 bg-gray-900/50 dark:bg-black/40" />
        </TransitionChild>

        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <DialogPanel className="relative w-full max-w-md rounded-xl bg-white dark:bg-dark-700 p-6 shadow-xl transition-all">
            <DialogTitle
              as="h3"
              className="text-lg font-medium mb-3 text-gray-800 dark:text-dark-100"
            >
              Observaciones
            </DialogTitle>

            <textarea
              rows={4}
              className="w-full rounded-md border border-gray-300 dark:border-dark-400 bg-transparent px-3 py-2 text-sm text-gray-800 dark:text-dark-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Escribe tus observaciones..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />

            <div className="flex justify-end space-x-2 mt-4">
              <Button onClick={onClose} variant="outlined">
                Cancelar
              </Button>
              <Button
                color="primary"
                onClick={() => {
                  onSave(value);
                  onClose();
                }}
              >
                Guardar
              </Button>
            </div>
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}
