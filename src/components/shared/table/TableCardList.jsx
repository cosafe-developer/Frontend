// Import Dependencies
import PropTypes from "prop-types";
import clsx from "clsx";
import { MdSearchOff } from "react-icons/md";

// ----------------------------------------------------------------------

const SKIP = new Set(["select", "actions"]);

const labelOf = (column) => {
  const def = column.columnDef;
  return typeof def.header === "string" ? def.header : def.label || column.id;
};

/**
 * Vista de tarjetas de una tabla (react-table) para teléfono: en vez de una
 * tabla ancha con scroll horizontal, cada fila es una tarjeta con la columna
 * principal arriba (junto al menú de acciones) y el resto como "etiqueta: valor".
 *
 * @param titleColumn  id de la columna que encabeza la tarjeta
 * @param onOpen       (row) => void al tocar la tarjeta (fuera de las acciones)
 */
export function TableCardList({ rows, flexRender, titleColumn, onOpen, emptyText = "Sin resultados" }) {
  if (!rows.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-10 text-gray-400 dark:text-dark-300">
        <MdSearchOff size={40} />
        <p className="font-medium">{emptyText}</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200 dark:divide-dark-500">
      {rows.map((row) => {
        const cells = row
          .getVisibleCells()
          .filter((cell) => !cell.column.columnDef.isHiddenColumn);
        const title = cells.find((cell) => cell.column.id === titleColumn);
        const actions = cells.find((cell) => cell.column.id === "actions");
        const rest = cells.filter(
          (cell) => cell.column.id !== titleColumn && !SKIP.has(cell.column.id),
        );
        return (
          <li key={row.id} className="px-4 py-3">
            <div className="flex items-start justify-between gap-2">
              <div
                className={clsx("min-w-0 flex-1", onOpen && "cursor-pointer")}
                onClick={onOpen ? () => onOpen(row) : undefined}
              >
                {title && flexRender(title.column.columnDef.cell, title.getContext())}
              </div>
              {actions && (
                <div className="shrink-0">
                  {flexRender(actions.column.columnDef.cell, actions.getContext())}
                </div>
              )}
            </div>
            {rest.length > 0 && (
              <dl
                className={clsx(
                  "mt-2 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-1.5 text-sm",
                  onOpen && "cursor-pointer",
                )}
                onClick={onOpen ? () => onOpen(row) : undefined}
              >
                {rest.map((cell) => (
                  <div key={cell.id} className="contents">
                    <dt className="text-xs text-gray-500 dark:text-dark-300">
                      {labelOf(cell.column)}
                    </dt>
                    <dd className="min-w-0 [&_*]:max-w-full">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </li>
        );
      })}
    </ul>
  );
}

TableCardList.propTypes = {
  rows: PropTypes.array.isRequired,
  flexRender: PropTypes.func.isRequired,
  titleColumn: PropTypes.string.isRequired,
  onOpen: PropTypes.func,
  emptyText: PropTypes.string,
};
