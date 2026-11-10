import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

import { Button } from "components/ui";
import { DatePicker } from "components/shared/form/Datepicker";
import { LabelHelp } from "components/shared/HelpTip";
import { HELP } from "../../helpers/helpTexts";
import { CALENDAR_ACTIVITIES, activityById, toYmd } from "../utils/calendarActivities";

/**
 * Calendario de fechas del subprograma de prevención: una o más filas
 * { fecha, tipo de actividad }. Cada actividad sale en el calendario del PIPC
 * con su color (Primeros Auxilios rojo, Búsqueda y Rescate verde, Simulacro
 * Mayor naranja). Las fechas pueden repetirse entre actividades.
 */
export default function PreventionCalendarField({ value, onChange, error }) {
  const rows = Array.isArray(value) ? value : [];
  const rowErrors = Array.isArray(error) ? error : [];
  const listError = !Array.isArray(error) ? error?.message : null;

  const update = (idx, patch) => onChange(rows.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  const add = () => onChange([...rows, { date: "", activity: "" }]);
  const remove = (idx) => onChange(rows.filter((_, i) => i !== idx));

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="input-label">
          <LabelHelp
            label="Calendario de fechas destinadas al subprograma de prevención de riesgos"
            help={HELP.riskInfo.preventionCalendar}
            required
          />
        </span>
        <Button
          type="button"
          variant="outlined"
          className="h-8 gap-1 px-2 text-xs"
          title={HELP.riskInfo.preventionCalendarAdd}
          onClick={add}
        >
          <PlusIcon className="size-4" />
          Agregar fecha
        </Button>
      </div>

      {/* leyenda de colores (igual que en el PIPC) */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600 dark:text-dark-200">
        {CALENDAR_ACTIVITIES.map((a) => (
          <span key={a.id} className="inline-flex items-center gap-1.5">
            <span className="inline-block size-3 rounded-sm" style={{ backgroundColor: a.color }} />
            {a.label}
          </span>
        ))}
      </div>

      {rows.length === 0 ? (
        <p className="text-sm italic text-gray-500">Sin fechas registradas. Usa “Agregar fecha”.</p>
      ) : (
        <div className="space-y-2">
          {rows.map((row, idx) => {
            const act = activityById(row.activity);
            const err = rowErrors[idx] || {};
            return (
              <div
                key={idx}
                className="flex flex-wrap items-start gap-3 rounded-lg border border-gray-200 p-3 dark:border-dark-500"
                style={act ? { borderLeft: `4px solid ${act.color}` } : undefined}
              >
                <div className="w-48">
                  <label className="input-label mb-1 block text-xs">
                    <LabelHelp label="Fecha" help={HELP.riskInfo.preventionCalendarDate} small />
                  </label>
                  <DatePicker
                    value={row.date || ""}
                    options={{ dateFormat: "Y-m-d" }}
                    placeholder="Seleccionar fecha..."
                    error={err?.date?.message}
                    onChange={(dates) => update(idx, { date: toYmd(dates) })}
                  />
                </div>
                <div className="min-w-56 flex-1">
                  <label className="input-label mb-1 block text-xs">
                    <LabelHelp label="Tipo de actividad" help={HELP.riskInfo.preventionCalendarActivity} small />
                  </label>
                  <select
                    aria-label="Tipo de actividad"
                    title={HELP.riskInfo.preventionCalendarActivity}
                    value={row.activity || ""}
                    onChange={(e) => update(idx, { activity: e.target.value })}
                    className="h-9 w-full rounded-lg border border-gray-300 bg-white px-2 text-sm text-gray-800 dark:border-dark-450 dark:bg-dark-700 dark:text-dark-100"
                  >
                    <option value="" className="bg-white text-gray-800 dark:bg-dark-700 dark:text-dark-100">
                      ¿Qué actividad es?
                    </option>
                    {CALENDAR_ACTIVITIES.map((a) => (
                      <option key={a.id} value={a.id} className="bg-white text-gray-800 dark:bg-dark-700 dark:text-dark-100">
                        {a.label} ({a.colorName})
                      </option>
                    ))}
                  </select>
                  {err?.activity?.message && <p className="mt-1 text-xs text-error">{err.activity.message}</p>}
                </div>
                <button
                  type="button"
                  aria-label="Eliminar fecha"
                  title={HELP.riskInfo.preventionCalendarRemove}
                  onClick={() => remove(idx)}
                  className="mt-6 text-error hover:text-red-400"
                >
                  <TrashIcon className="size-5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
      {listError && <p className="text-xs text-error">{listError}</p>}
    </div>
  );
}
