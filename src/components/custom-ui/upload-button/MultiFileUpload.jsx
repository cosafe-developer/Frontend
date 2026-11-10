import { useRef, useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { ArrowUpTrayIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "components/ui";
import {
  DEFAULT_UPLOAD_CONCURRENCY,
  describeUploadFailures,
  formatUploadProgress,
  splitAccepted,
  uploadMany,
} from "helpers/multiUpload";

/**
 * Selección y subida de varios archivos a la vez (input `multiple` y
 * arrastrar varios). Sube en paralelo con límite, muestra "Subiendo 2 de 5…"
 * y, si alguno falla, avisa cuál sin perder los que sí subieron.
 *
 * `onUploaded(urls, { failed })` recibe sólo las URLs subidas, en el orden en
 * que se eligieron; quien lo usa decide cómo guardarlas (una sola vez).
 *
 * variant "dropzone": recuadro punteado con botón; "button": sólo el botón
 * (también acepta que le suelten archivos encima).
 */
const MultiFileUpload = ({
  upload,
  onUploaded,
  accept = "image/*",
  variant = "dropzone",
  label = "Seleccionar fotos",
  hint = "o arrastra varias aquí",
  title,
  size = "md",
  disabled = false,
  concurrency = DEFAULT_UPLOAD_CONCURRENCY,
  className,
}) => {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(null);
  const [message, setMessage] = useState("");
  const busy = progress !== null;

  const start = async (fileList) => {
    if (busy || disabled) return;
    const { accepted, rejected } = splitAccepted(fileList, accept);
    const notes = [];
    if (rejected.length) {
      notes.push(`Se omitieron por tipo de archivo no permitido: ${rejected.map((f) => f.name).join(", ")}.`);
    }
    if (accepted.length === 0) {
      setMessage(notes.join(" "));
      return;
    }
    setMessage("");
    setProgress({ done: 0, total: accepted.length });
    try {
      const { urls, failed } = await uploadMany(accepted, upload, {
        concurrency,
        onProgress: ({ done, total }) => setProgress({ done, total }),
      });
      if (failed.length) {
        failed.forEach((f) => console.error(`Error al subir ${f.name}:`, f.error));
        notes.push(describeUploadFailures(failed, accepted.length));
      }
      if (urls.length) await onUploaded?.(urls, { failed });
    } catch (err) {
      console.error("Error al guardar los archivos subidos:", err);
      notes.push("Los archivos se subieron pero no se pudieron guardar. Intenta de nuevo.");
    } finally {
      setProgress(null);
      setMessage(notes.join(" "));
    }
  };

  const openPicker = () => {
    if (!busy && !disabled) inputRef.current?.click();
  };

  const dropHandlers = {
    onDragOver: (e) => {
      e.preventDefault();
      if (!busy && !disabled) setDragging(true);
    },
    onDragLeave: (e) => {
      if (!e.currentTarget.contains(e.relatedTarget)) setDragging(false);
    },
    onDrop: (e) => {
      e.preventDefault();
      setDragging(false);
      start(e.dataTransfer?.files);
    },
  };

  const status = busy ? formatUploadProgress(progress) : "";

  const button = (
    <Button
      type="button"
      color="primary"
      variant={variant === "button" ? "outlined" : "filled"}
      onClick={openPicker}
      disabled={busy || disabled}
      title={title}
      className={clsx(
        "gap-1 whitespace-nowrap",
        size === "sm" ? "h-8 px-2.5 text-xs" : "h-9 px-3 text-sm",
      )}
    >
      {variant === "button" ? <PhotoIcon className="size-4" /> : <ArrowUpTrayIcon className="size-4" />}
      {busy ? status : label}
    </Button>
  );

  return (
    <div className={clsx("flex flex-col gap-1", className)}>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={accept}
        hidden
        onChange={(e) => {
          const files = Array.from(e.currentTarget.files ?? []);
          // Permite volver a elegir los mismos archivos (p.ej. tras una falla)
          e.currentTarget.value = "";
          start(files);
        }}
      />

      {variant === "dropzone" ? (
        <div
          {...dropHandlers}
          className={clsx(
            "flex flex-wrap items-center gap-3 rounded-lg border-2 border-dashed px-4 py-3 transition-colors",
            dragging
              ? "border-primary-500 bg-primary-500/10"
              : "border-gray-300 dark:border-dark-450",
          )}
        >
          {button}
          <span className="text-xs text-gray-500 dark:text-dark-300">
            {busy ? status : hint}
          </span>
        </div>
      ) : (
        <div
          {...dropHandlers}
          className={clsx("inline-flex rounded-lg", dragging && "ring-2 ring-primary-500")}
        >
          {button}
        </div>
      )}

      <span className="sr-only" aria-live="polite">
        {status}
      </span>

      {message && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-md bg-warning/10 px-2 py-1 text-left text-xs text-warning dark:text-warning-lighter"
        >
          <span className="flex-1">{message}</span>
          <button
            type="button"
            aria-label="Cerrar aviso"
            onClick={() => setMessage("")}
            className="shrink-0 cursor-pointer"
          >
            <XMarkIcon className="size-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

MultiFileUpload.propTypes = {
  upload: PropTypes.func.isRequired,
  onUploaded: PropTypes.func,
  accept: PropTypes.string,
  variant: PropTypes.oneOf(["dropzone", "button"]),
  label: PropTypes.node,
  hint: PropTypes.node,
  title: PropTypes.string,
  size: PropTypes.oneOf(["sm", "md"]),
  disabled: PropTypes.bool,
  concurrency: PropTypes.number,
  className: PropTypes.string,
};

export default MultiFileUpload;
