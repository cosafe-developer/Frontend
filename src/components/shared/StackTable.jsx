// Import Dependencies
import PropTypes from "prop-types";
import { useLayoutEffect, useRef } from "react";
import clsx from "clsx";

// Local Imports
import { Table } from "components/ui";

// ----------------------------------------------------------------------

/**
 * Tabla que en teléfono se apila como tarjetas (ver `.is-stacked-sm` en
 * table.css). Copia el texto de cada encabezado al `data-label` de las celdas
 * de su columna para mostrarlo como etiqueta.
 */
export function StackTable({ className, children, ...rest }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const table = ref.current;
    if (!table) return;
    const labels = [...table.querySelectorAll("thead th")].map((th) => th.innerText.trim());
    table.querySelectorAll("tbody tr").forEach((tr) => {
      [...tr.children].forEach((td, i) => {
        if (labels[i] && td.getAttribute("data-label") !== labels[i]) td.setAttribute("data-label", labels[i]);
      });
    });
  });

  return (
    <Table ref={ref} className={clsx("is-stacked-sm", className)} {...rest}>
      {children}
    </Table>
  );
}

StackTable.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};
