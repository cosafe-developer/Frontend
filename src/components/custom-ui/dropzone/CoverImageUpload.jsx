// Import Dependencies
import { CloudArrowUpIcon } from "@heroicons/react/20/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { forwardRef, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import PropTypes from "prop-types";

// Local Imports
import { PreviewImg } from "components/shared/PreviewImg";
import { Button, InputErrorMsg, Upload } from "components/ui";
import { useId } from "hooks";
import { displayFileName, normalizeUploadValue } from "helpers/listadoData";

// ----------------------------------------------------------------------

const CoverImageUpload = forwardRef(
  ({ classNames, value, label, onChange, error, upload }, ref) => {
    const id = useId();
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");

    // Valores inválidos ({} de un File serializado, placeholders) => vacío
    const safeValue = normalizeUploadValue(value);

    // Convierte URL a "File-like" para previsualizar
    const displayFile =
      typeof safeValue === "string"
        ? { name: displayFileName(safeValue), preview: safeValue }
        : safeValue;


    const { getRootProps, getInputProps, isDragReject, isDragAccept } =
      useDropzone({
        onDrop: useCallback(async (acceptedFiles) => {
          const file = acceptedFiles[0];
          if (!file) return;
          // Sin `upload` se conserva el comportamiento anterior (entrega el File)
          if (!upload) {
            onChange(file);
            return;
          }
          // Con `upload` el archivo se sube ANTES de llegar al formulario:
          // el valor del campo siempre es la URL pública (string).
          setUploadError("");
          setUploading(true);
          try {
            const url = await upload(file);
            onChange(url);
          } catch (err) {
            console.error("Error al subir archivo:", err);
            setUploadError("No se pudo subir el archivo. Intenta de nuevo.");
          } finally {
            setUploading(false);
          }
        }, [onChange, upload]),
        disabled: uploading,
        accept: {
          "image/jpeg": [".jpeg", ".jpg"],
          "image/png": [".png"],
          "image/gif": [".gif"],
          "image/heif": [".heif"],
          "image/heic": [".heic"],
          "image/webp": [".webp"],
          "image/bmp": [".bmp"],
          "image/tiff": [".tiff"],
          "image/avif": [".avif"],
          "application/pdf": [".pdf"],
        },
        multiple: false,
      });

    const onRemove = () => {
      onChange(null);
    };

    return (
      <div className="flex flex-col">
        {label && (
          <label htmlFor={id} className={classNames?.label}>
            {label}
          </label>
        )}
        <div
          className={clsx(
            // Alto configurable (classNames.height); por defecto h-72
            classNames?.height ?? "h-72",
            "w-full rounded-lg border-2 border-dashed border-current",
            !isDragAccept &&
            (isDragReject || error) &&
            "text-error dark:text-error-light",
            isDragAccept && "text-primary-600 dark:text-primary-500",
            !isDragReject &&
            !isDragAccept &&
            !error &&
            "text-gray-300 dark:text-dark-450",
            classNames?.box
          )}
        >
          <Upload
            ref={ref}
            inputProps={{ ...getInputProps(), id }}
            {...getRootProps()}
          >
            {({ ...props }) =>
              uploading ? (
                <div className="flex h-full w-full flex-col items-center justify-center text-gray-600 dark:text-dark-200">
                  <CloudArrowUpIcon className="size-12 animate-pulse text-primary-500" />
                  <span className="mt-2 text-sm">Subiendo archivo...</span>
                </div>
              ) : displayFile ? (
                <div
                  title={displayFile.name}
                  {...props}
                  className="group relative h-full w-full cursor-pointer rounded-lg ring-primary-600 ring-offset-4 ring-offset-white transition-all hover:ring-3 dark:ring-primary-500 dark:ring-offset-dark-700"
                >
                  <div className="h-full w-full overflow-hidden p-2 flex items-center justify-center">
                    {displayFile.type === "application/pdf" || displayFile.name?.endsWith(".pdf") ? (
                      <div className="flex flex-col items-center justify-center text-gray-600 dark:text-dark-200">
                        <CloudArrowUpIcon className="size-12 text-primary-500" />
                        <span className="mt-2 text-sm">{displayFile.name}</span>
                        <a
                          href={displayFile.preview || (typeof displayFile === "string" ? displayFile : "")}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-primary-600 hover:underline mt-1"
                        >
                          Ver PDF
                        </a>
                      </div>
                    ) : (
                      <PreviewImg
                        className="m-auto h-full object-contain"
                        file={displayFile}
                        alt={displayFile.name}
                        isUrl={typeof displayFile === "string" || displayFile.preview}
                      />
                    )}
                  </div>

                  <div className="absolute -right-3 -top-3 flex items-center justify-center rounded-full bg-white shadow-md dark:bg-dark-700">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onRemove();
                      }}
                      title="Eliminar"
                      aria-label="Eliminar imagen"
                      className="size-7 shrink-0 rounded-full border border-gray-300 p-0 text-error hover:bg-error/10 dark:border-dark-450"
                    >
                      <XMarkIcon className="size-4" />
                    </Button>
                  </div>

                  <div className="absolute inset-x-0 bottom-2 mx-auto w-fit rounded-full bg-black/60 px-3 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                    Click para reemplazar
                  </div>
                </div>
              ) : (
                <Button
                  unstyled
                  className="h-full w-full shrink-0 flex-col space-x-2 px-3 "
                  {...props}
                >
                  <CloudArrowUpIcon className="pointer-events-none size-12" />
                  <span className="pointer-events-none mt-2 text-center text-gray-600 dark:text-dark-200">
                    <span className="text-primary-600 dark:text-primary-400">
                      Tomar foto, seleccionar imagen o PDF
                    </span>
                    <span className="block text-xs mt-1">Arrastra o haz clic para subir</span>
                  </span>
                </Button>
              )
            }
          </Upload>
        </div>
        <InputErrorMsg
          when={(error && typeof error !== "boolean") || !!uploadError}
          className={classNames?.error}
        >
          {uploadError || error}
        </InputErrorMsg>
      </div>
    );
  }
);

CoverImageUpload.displayName = "CoverImageUpload";

CoverImageUpload.propTypes = {
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  id: PropTypes.string,
  onChange: PropTypes.func,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.node]),
  classNames: PropTypes.object,
  label: PropTypes.node,
  // async (file) => url. Si se pasa, el archivo se sube al soltarlo y
  // onChange recibe la URL pública en lugar del File.
  upload: PropTypes.func,
};

export { CoverImageUpload };
