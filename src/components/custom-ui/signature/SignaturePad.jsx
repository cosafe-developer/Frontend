import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import SignatureCanvas from "react-signature-canvas";

const SignaturePad = forwardRef(({ value, onChange, error }, ref) => {
  const sigRef = useRef(null);
  // Último dataURL emitido por este canvas (para no recargarlo sobre sí mismo)
  const lastEmittedRef = useRef(null);
  const [hasSignature, setHasSignature] = useState(!!value);

  const isDataUrl = typeof value === "string" && value.startsWith("data:");
  const isUrl = typeof value === "string" && (value.startsWith("http") || value.startsWith("/"));

  const handleClear = () => {
    sigRef.current?.clear();
    lastEmittedRef.current = null;
    setHasSignature(false);
    onChange?.(null);
  };

  useImperativeHandle(ref, () => ({
    clear: handleClear,
  }));

  // Al reabrir el paso con una firma aún no subida (dataURL) se dibuja en el
  // canvas; antes se mostraba vacío aunque el valor existía.
  useEffect(() => {
    if (!isDataUrl || value === lastEmittedRef.current || !sigRef.current) return;
    try {
      sigRef.current.fromDataURL(value);
      lastEmittedRef.current = value;
      setHasSignature(true);
    } catch (err) {
      console.warn("No se pudo mostrar la firma guardada:", err);
    }
  }, [value, isDataUrl]);

  const handleEnd = () => {
    if (sigRef.current && !sigRef.current.isEmpty()) {
      const dataUrl = sigRef.current.getTrimmedCanvas().toDataURL("image/png");
      lastEmittedRef.current = dataUrl;
      setHasSignature(true);
      onChange?.(dataUrl);
    }
  };

  return (
    <div className="flex flex-col gap-y-2">
      {(isUrl && !isDataUrl) ? (
        <div className="space-y-2">
          <div className="rounded-lg border border-gray-600 p-2 bg-white inline-block">
            <img src={value} alt="Firma guardada" className="max-h-32" />
          </div>
          <button
            type="button"
            onClick={() => {
              setHasSignature(false);
              onChange?.(null);
            }}
            className="text-sm text-red-400 hover:text-red-500 underline"
          >
            Cambiar firma
          </button>
        </div>
      ) : (
        <>
          <div className="rounded-lg border border-gray-600 overflow-hidden bg-white">
            <SignatureCanvas
              ref={sigRef}
              penColor="black"
              canvasProps={{
                className: "w-full",
                style: { height: 150, width: "100%" },
              }}
              onEnd={handleEnd}
            />
          </div>

          <div className="flex items-center gap-x-3">
            <button
              type="button"
              onClick={handleClear}
              className="text-sm text-red-400 hover:text-red-500 underline"
            >
              Limpiar firma
            </button>
            {hasSignature && (
              <span className="text-sm text-green-400">Firma capturada</span>
            )}
          </div>
        </>
      )}

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
});

SignaturePad.displayName = "SignaturePad";

export default SignaturePad;
