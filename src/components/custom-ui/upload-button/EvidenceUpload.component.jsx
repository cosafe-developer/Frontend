import { PlusIcon } from "@heroicons/react/24/outline";
import { Button, Upload } from "components/ui";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const EvidenceUpload = ({ value, onChange, onRemove }) => {
  const [internalValue, setInternalValue] = useState(null);

  // --- Cuando `value` cambia desde afuera (ej: backend), sincronizar ---
  useEffect(() => {
    if (value && typeof value === "string") {
      setInternalValue({
        type: "url",
        url: value,
        name: value.split("/").pop()
      });
    }

    if (value instanceof File) {
      setInternalValue({
        type: "file",
        file: value,
        name: value.name,
        preview: URL.createObjectURL(value)
      });
    }

    if (!value) {
      setInternalValue(null);
    }
  }, [value]);

  // --- Cuando el usuario sube un archivo ---
  const handleFileChange = (file) => {
    if (!file) return;

    const newVal = {
      type: "file",
      file,
      name: file.name,
      preview: URL.createObjectURL(file),
    };

    setInternalValue(newVal);
    onChange?.(file); // ← mandas SOLO EL FILE hacia afuera
  };

  // --- Eliminar evidencia ---
  const handleRemove = () => {
    setInternalValue(null);
    onRemove?.();
  };

  const isPdf = internalValue?.name?.toLowerCase().endsWith(".pdf");
  const urlToOpen =
    internalValue?.type === "file"
      ? internalValue.preview
      : internalValue?.url;

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
          {/* Nombre del archivo */}
          <span className="mt-2 text-sm">{internalValue.name}</span>

          <div className="flex space-x-3">
            <a
              href={urlToOpen}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:underline mt-1"
            >
              Ver {isPdf ? "PDF" : "Imagen"}
            </a>

            <button
              type="button"
              className="text-xs mt-2 cursor-pointer"
              onClick={handleRemove}
            >
              ✖
            </button>
          </div>
        </>
      )}
    </div>
  );
};

EvidenceUpload.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onChange: PropTypes.func,
  onRemove: PropTypes.func,
};

export default EvidenceUpload;
