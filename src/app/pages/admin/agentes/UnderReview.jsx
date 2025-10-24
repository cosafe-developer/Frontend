// Import Dependencies
import { Link } from "react-router";
import { useRef } from "react";

// Local Imports
import { AnimatedTick } from "components/shared/AnimatedTick";
import { Button } from "components/ui";


// ----------------------------------------------------------------------

export function UnderReview() {
  const ref = useRef(null);

  return (
    <>
      <div className="h-full text-center">
        <AnimatedTick
          className="mx-auto h-auto w-48 text-success dark:text-success-light"
          strokeWidth={8}
        />

        <p className="mt-6 pt-4 text-xl font-semibold text-gray-800 dark:text-dark-50">
          El agente se ha creado con exito
        </p>
        <p className="mx-auto mt-2 max-w-(--breakpoint-lg) text-balance">
          Gracias por enviar el formulario. Hemos recibido sus datos personales.
        </p>
        <Button
          color="primary"
          className="mt-8 w-full px-10 sm:w-auto"
          to="/admin/agentes"
          component={Link}
        >
          Volver Inicio
        </Button>
      </div>

      <div ref={ref} className="fixed inset-0 z-[-1]"></div>
    </>
  );
}
