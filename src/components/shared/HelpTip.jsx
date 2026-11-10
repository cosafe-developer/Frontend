import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import clsx from "clsx";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

const GAP = 6;
const MARGIN = 8;
const MAX_WIDTH = 280;

/**
 * Ícono (i) con la explicación de un campo, botón, casilla o columna.
 *
 * - Se abre al pasar el mouse o al enfocar con teclado; en móvil, al tocar
 *   (el toque lo deja fijo hasta tocar fuera o pulsar Esc).
 * - El texto se pinta en un portal con posición fija: no lo recortan las
 *   tablas con overflow ni cambia el ancho de las columnas.
 * - Accesible: el botón describe su texto con aria-describedby (texto
 *   oculto siempre presente para lectores de pantalla).
 */
export function HelpTip({ text, label = "Más información", className, iconClassName }) {
  const id = useId();
  const btnRef = useRef(null);
  const tipRef = useRef(null);
  const [hover, setHover] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [pos, setPos] = useState(null);
  const open = (hover || pinned) && Boolean(text);

  const place = useCallback(() => {
    const btn = btnRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const width = Math.min(MAX_WIDTH, vw - MARGIN * 2);
    const tipH = tipRef.current?.offsetHeight ?? 0;
    let left = r.left + r.width / 2 - width / 2;
    left = Math.max(MARGIN, Math.min(left, vw - width - MARGIN));
    const below = r.bottom + GAP;
    const top = tipH && below + tipH > vh - MARGIN && r.top - GAP - tipH > MARGIN ? r.top - GAP - tipH : below;
    setPos({ top, left, width });
  }, []);

  // El texto ya está montado (fuera de pantalla) cuando corre este efecto:
  // se mide su altura para abrirlo hacia arriba si no cabe abajo.
  useLayoutEffect(() => {
    if (open) place();
  }, [open, place]);

  useEffect(() => {
    if (!open) return undefined;
    const close = () => {
      setHover(false);
      setPinned(false);
    };
    const onKey = (e) => e.key === "Escape" && close();
    const onDown = (e) => {
      if (btnRef.current?.contains(e.target) || tipRef.current?.contains(e.target)) return;
      close();
    };
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  if (!text) return null;

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        aria-label={label}
        aria-describedby={`${id}-desc`}
        aria-expanded={open}
        className={clsx(
          "inline-flex shrink-0 cursor-help items-center justify-center rounded-full align-middle text-gray-400 outline-none hover:text-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500 dark:text-dark-300 dark:hover:text-primary-400",
          className,
        )}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        onClick={(e) => {
          // Dentro de un <label> no debe marcar la casilla asociada
          e.preventDefault();
          e.stopPropagation();
          // En táctil el toque también dispara hover/focus: un segundo toque cierra
          if (pinned) {
            setPinned(false);
            setHover(false);
          } else {
            setPinned(true);
          }
        }}
      >
        <InformationCircleIcon className={clsx("size-4", iconClassName)} aria-hidden="true" />
        <span id={`${id}-desc`} className="sr-only">
          {text}
        </span>
      </button>
      {open &&
        createPortal(
          <div
            ref={tipRef}
            role="tooltip"
            aria-hidden="true"
            style={{
              position: "fixed",
              top: pos?.top ?? -9999,
              left: pos?.left ?? -9999,
              width: pos?.width ?? Math.min(MAX_WIDTH, window.innerWidth - MARGIN * 2),
              zIndex: 1000,
            }}
            className="pointer-events-auto rounded-lg bg-gray-800 px-3 py-2 text-left text-xs font-normal normal-case leading-snug tracking-normal whitespace-normal text-white shadow-lg dark:bg-dark-500 dark:text-dark-50"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            {text}
          </div>,
          document.body,
        )}
    </>
  );
}

HelpTip.propTypes = {
  text: PropTypes.node,
  label: PropTypes.string,
  className: PropTypes.string,
  iconClassName: PropTypes.string,
};

/**
 * Etiqueta con su (i): `<LabelHelp label="RFC" help={HELP.companyInfo.rfc} />`.
 * Sirve como `label` de Input/Listbox/Textarea, como encabezado de columna
 * (`small`) o como título de sección.
 */
export function LabelHelp({ label, help, small = false, className, required = false }) {
  return (
    <span className={clsx("inline-flex items-center gap-1", className)}>
      <span>
        {label}
        {required && <span className="ml-1 text-error">*</span>}
      </span>
      <HelpTip
        text={help}
        label={`Qué es: ${typeof label === "string" ? label : "este campo"}`}
        iconClassName={small ? "size-3.5" : "size-4"}
      />
    </span>
  );
}

LabelHelp.propTypes = {
  label: PropTypes.node,
  help: PropTypes.node,
  small: PropTypes.bool,
  className: PropTypes.string,
  required: PropTypes.bool,
};
