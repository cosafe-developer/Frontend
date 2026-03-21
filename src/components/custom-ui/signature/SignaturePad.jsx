import { useRef, useState, forwardRef, useImperativeHandle } from "react";
import SignatureCanvas from "react-signature-canvas";

const SignaturePad = forwardRef(({ value, onChange, error }, ref) => {
  const sigRef = useRef(null);
  const [hasSignature, setHasSignature] = useState(!!value);

  useImperativeHandle(ref, () => ({
    clear: handleClear,
  }));

  const handleEnd = () => {
    if (sigRef.current && !sigRef.current.isEmpty()) {
      const dataUrl = sigRef.current.getTrimmedCanvas().toDataURL("image/png");
      setHasSignature(true);
      onChange?.(dataUrl);
    }
  };

  const handleClear = () => {
    sigRef.current?.clear();
    setHasSignature(false);
    onChange?.(null);
  };

  const isDataUrl = typeof value === "string" && value.startsWith("data:");
  const isUrl = typeof value === "string" && (value.startsWith("http") || value.startsWith("/"));

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
