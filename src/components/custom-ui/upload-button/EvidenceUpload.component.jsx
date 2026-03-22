import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button, Upload } from "components/ui";
import { ConfirmModal } from "components/shared/ConfirmModal";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";

// ── Modal de preview de imagen ──
function ImagePreviewModal({ show, onClose, url, name }) {
  return (
    <Transition
      appear
      show={show}
      as={Dialog}
      onClose={onClose}
      className="fixed inset-0 z-100 flex items-center justify-center overflow-hidden px-4 py-6"
    >
      <TransitionChild
        as="div"
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="absolute inset-0 bg-gray-900/70 transition-opacity dark:bg-black/60"
      />
      <TransitionChild
        as={DialogPanel}
        enter="ease-out duration-300"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
        className="relative flex max-h-[90vh] max-w-[90vw] flex-col items-center rounded-lg bg-white p-2 shadow-lg transition-all dark:bg-dark-700"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 rounded-full bg-gray-800 p-1 text-white hover:bg-gray-600 cursor-pointer"
        >
          <XMarkIcon className="size-5" />
        </button>
        <img
          src={url}
          alt={name || "Evidencia"}
          className="max-h-[85vh] max-w-full rounded object-contain"
        />
        {name && (
          <p className="mt-2 text-sm text-gray-500 dark:text-dark-200 truncate max-w-full px-2">
            {name}
          </p>
        )}
      </TransitionChild>
    </Transition>
  );
}

ImagePreviewModal.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
  url: PropTypes.string,
  name: PropTypes.string,
};

// ── Componente principal ──
const EvidenceUpload = ({ value, onChange, onRemove }) => {
  const [internalValue, setInternalValue] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showConfirmRemove, setShowConfirmRemove] = useState(false);

  useEffect(() => {
    if (value && typeof value === "string") {
      setInternalValue({
        type: "url",
        url: value,
        name: value.split("/").pop(),
      });
    }

    if (value instanceof File) {
      setInternalValue({
        type: "file",
        file: value,
        name: value.name,
        preview: URL.createObjectURL(value),
      });
    }

    if (!value) {
      setInternalValue(null);
    }
  }, [value]);

  const handleFileChange = (file) => {
    if (!file) return;
    const newVal = {
      type: "file",
      file,
      name: file.name,
      preview: URL.createObjectURL(file),
    };
    setInternalValue(newVal);
    onChange?.(file);
  };

  const handleRemove = () => {
    setInternalValue(null);
    onRemove?.();
    setShowConfirmRemove(false);
  };

  const isPdf = internalValue?.name?.toLowerCase().endsWith(".pdf");
  const urlToOpen =
    internalValue?.type === "file" ? internalValue.preview : internalValue?.url;

  return (
    <div className="flex flex-col items-center text-gray-600 dark:text-dark-200">
      {!internalValue ? (
        <Upload onChange={handleFileChange}>
          {(props) => (
            <Button color="primary" {...props}>
              <PlusIcon className="size-5" />
              Subir Evidencia
            </Button>
          )}
        </Upload>
      ) : (
        <>
          <span className="mt-2 text-sm">{internalValue.name}</span>

          <div className="flex space-x-3">
            {isPdf ? (
              <a
                href={urlToOpen}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:underline mt-1"
              >
                Ver PDF
              </a>
            ) : (
              <button
                type="button"
                className="text-primary-600 hover:underline mt-1 cursor-pointer"
                onClick={() => setShowPreview(true)}
              >
                Ver Imagen
              </button>
            )}

            <button
              type="button"
              className="text-xs mt-2 cursor-pointer text-error hover:text-red-400"
              onClick={() => setShowConfirmRemove(true)}
            >
              ✖ Eliminar
            </button>
          </div>
        </>
      )}

      {/* Modal de preview de imagen */}
      {!isPdf && urlToOpen && (
        <ImagePreviewModal
          show={showPreview}
          onClose={() => setShowPreview(false)}
          url={urlToOpen}
          name={internalValue?.name}
        />
      )}

      {/* Confirmación antes de eliminar */}
      <ConfirmModal
        show={showConfirmRemove}
        onClose={() => setShowConfirmRemove(false)}
        onOk={handleRemove}
        state="pending"
        messages={{
          pending: {
            title: "¿Eliminar evidencia?",
            description:
              "¿Estás seguro de que deseas eliminar esta evidencia? Esta acción no se puede deshacer.",
            actionText: "Sí, eliminar",
          },
        }}
      />
    </div>
  );
};

EvidenceUpload.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onChange: PropTypes.func,
  onRemove: PropTypes.func,
};

export default EvidenceUpload;
