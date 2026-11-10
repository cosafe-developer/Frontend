import PropTypes from "prop-types";
import clsx from "clsx";
import { ClockIcon } from "@heroicons/react/24/outline";
import { describeLastChange, lastChangeFor } from "helpers/changeLog";
import { useListadoChangeLog } from "./useListadoChangeLog";
import { HelpTip } from "components/shared/HelpTip";
import { HELP } from "../helpers/helpTexts";

/**
 * Recuadro discreto "Último cambio: {name} · {fecha y hora} — {campos}" de
 * una sección del listado (o "Sin cambios registrados").
 */
export function LastChangeNotice({ listado, section, className }) {
  const log = useListadoChangeLog(listado);
  const entry = lastChangeFor(log, section);
  const text = describeLastChange(entry);

  return (
    <div
      className={clsx(
        "flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-500 dark:border-dark-500 dark:bg-dark-750 dark:text-dark-300",
        className,
      )}
      title={entry?.by?.role ? `${text} (${entry.by.role})` : text}
    >
      <ClockIcon className="size-4 shrink-0" aria-hidden="true" />
      <span className="min-w-0 flex-1 truncate">{text}</span>
      <HelpTip text={HELP.lastChange} label="Qué es: último cambio" iconClassName="size-3.5" />
    </div>
  );
}

LastChangeNotice.propTypes = {
  listado: PropTypes.object,
  section: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired,
  className: PropTypes.string,
};
