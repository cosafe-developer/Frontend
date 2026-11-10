import PropTypes from "prop-types";
import { Card } from "components/ui";
import { LabelHelp } from "components/shared/HelpTip";
import {
  changeAuthor,
  changeSectionLabel,
  formatChangeAt,
  recentChanges,
  summarizeFields,
} from "helpers/changeLog";
import { useListadoChangeLog } from "./useListadoChangeLog";
import { HELP } from "../helpers/helpTexts";

/**
 * Bloque "Historial de cambios" del detalle del listado: últimas entradas de
 * listado.changeLog (sección, quién, cuándo, qué). Listados viejos sin
 * changeLog muestran "Sin cambios registrados".
 */
export function ChangeHistory({ listado, limit = 15 }) {
  const log = useListadoChangeLog(listado);
  const entries = recentChanges(log, limit);

  return (
    <Card className="p-5">
      <h3 className="mb-3 text-lg font-medium text-gray-800 dark:text-dark-50">
        <LabelHelp label="Historial de cambios" help={HELP.detail.history} />
      </h3>
      {entries.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-dark-300">Sin cambios registrados</p>
      ) : (
        <ol className="divide-y divide-gray-200 dark:divide-dark-500">
          {entries.map((entry, i) => {
            const what = summarizeFields(entry.fields, 6);
            return (
              <li key={`${entry.section}-${entry.at ?? ""}-${i}`} className="py-2.5 text-sm">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                  <span className="font-medium text-gray-800 dark:text-dark-100">
                    {changeSectionLabel(entry)}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-dark-300">
                    {formatChangeAt(entry.at) || "Fecha desconocida"}
                  </span>
                </div>
                <div className="text-xs text-gray-500 dark:text-dark-300">
                  {changeAuthor(entry)}
                  {entry?.by?.role ? ` (${entry.by.role})` : ""}
                  {what ? ` — ${what}` : ""}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </Card>
  );
}

ChangeHistory.propTypes = {
  listado: PropTypes.object,
  limit: PropTypes.number,
};
