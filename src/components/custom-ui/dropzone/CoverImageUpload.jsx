// Import Dependencies
import { CloudArrowUpIcon } from "@heroicons/react/20/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { forwardRef, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import PropTypes from "prop-types";

// Local Imports
import { PreviewImg } from "components/shared/PreviewImg";
import { Button, InputErrorMsg, Upload } from "components/ui";
import { useId } from "hooks";

// ----------------------------------------------------------------------

const CoverImageUpload = forwardRef(
  ({ classNames, value, label, onChange, error }, ref) => {
    const id = useId();

    // Convierte URL a "File-like" para previsualizar
    const displayFile =
      typeof value === "string"
        ? { name: value.split("/").pop(), preview: value }
        : value;


    const { getRootProps, getInputProps, isDragReject, isDragAccept } =
      useDropzone({
        onDrop: useCallback((acceptedFiles) => {
          const file = acceptedFiles[0];
          if (file) {
            onChange(file);
          }
        }, [onChange]),
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
            "h-72 w-full rounded-lg border-2 border-dashed border-current",
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
              displayFile ? (
                <div
                  title={displayFile.name}
                  className="group relative h-full w-full rounded-lg ring-primary-600 ring-offset-4 ring-offset-white transition-all hover:ring-3 dark:ring-primary-500 dark:ring-offset-dark-700"
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

                  <div className="absolute -right-3 -top-4 flex items-center justify-center rounded-full bg-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-dark-700">
                    <Button
                      onClick={onRemove}
                      className="size-6 shrink-0 rounded-full border p-0 dark:border-dark-450"
                    >
                      <XMarkIcon className="size-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  unstyled
                  className="h-full w-full shrink-0 flex-col space-x-2 px-3 "
                  {...props}
                >
                  <CloudArrowUpIcon className="pointer-events-none size-12" />
                  <span className="pointer-events-none mt-2 text-gray-600 dark:text-dark-200">
                    <span className="text-primary-600 dark:text-primary-400">
                      Busca
                    </span>
                    <span> o arrastra el archivo aquí</span>
                  </span>
                </Button>
              )
            }
          </Upload>
        </div>
        <InputErrorMsg
          when={error && typeof error !== "boolean"}
          className={classNames?.error}
        >
          {error}
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
};

export { CoverImageUpload };
