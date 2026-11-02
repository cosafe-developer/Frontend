// Import Dependencies
import PropTypes from "prop-types";
import { Link } from "react-router";
import Confetti from "react-confetti";
import { useState, useEffect, useRef } from "react";

// Local Imports
import { AnimatedTick } from "components/shared/AnimatedTick";
import { Button } from "components/ui";
import { useBoxSize } from "hooks";

// ----------------------------------------------------------------------

/** Pantalla final al terminar el último paso del listado. */
export function UnderReview({ listadoId }) {
  const ref = useRef(null);
  const { width, height } = useBoxSize({ ref });
  const [run, setRun] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRun(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Confetti
        width={width}
        height={height}
        recycle={run}
        style={{ zIndex: 100 }}
      />
      <div className="h-full text-center">
        <AnimatedTick
          className="mx-auto h-auto w-48 text-success dark:text-success-light"
          strokeWidth={8}
        />

        <p className="mt-6 pt-4 text-xl font-semibold text-gray-800 dark:text-dark-50">
          Listado completado
        </p>
        <p className="mx-auto mt-2 max-w-(--breakpoint-lg) text-balance">
          La información del listado se guardó correctamente. Ya puedes
          descargar el PIPC desde el detalle del listado.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {listadoId && (
            <Button
              color="primary"
              className="w-full px-10 sm:w-auto"
              to={`/admin/listado/completo/${listadoId}`}
              component={Link}
            >
              Ver detalle del listado
            </Button>
          )}
          <Button
            className="w-full px-10 sm:w-auto"
            to="/admin/listado"
            component={Link}
          >
            Ir a listados
          </Button>
        </div>
      </div>

      <div ref={ref} className="fixed inset-0 z-[-1]"></div>
    </>
  );
}

UnderReview.propTypes = {
  listadoId: PropTypes.string,
};
