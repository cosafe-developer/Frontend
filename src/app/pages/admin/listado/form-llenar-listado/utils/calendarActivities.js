// Tipos de actividad del "Calendario de Capacitación y Actividades" del PIPC.
// Mismas claves y colores que el backend (services/document/context/calendar.js).
export const CALENDAR_ACTIVITIES = [
  { id: "primeros_auxilios", label: "Capacitación de Primeros Auxilios", color: "#E53935", colorName: "rojo" },
  { id: "busqueda_rescate", label: "Capacitación de Búsqueda y Rescate", color: "#2E9E44", colorName: "verde" },
  { id: "simulacro_mayor", label: "Simulacro Mayor", color: "#F57C00", colorName: "naranja" },
];

export const activityById = (id) => CALENDAR_ACTIVITIES.find((a) => a.id === id) || null;

/** Date | string → "YYYY-MM-DD" (fecha local, sin corrimiento por zona horaria) o "". */
export function toYmd(value) {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === null || raw === undefined || raw === "") return "";
  if (typeof raw === "string" && /^\d{4}-\d{2}-\d{2}$/.test(raw.trim())) return raw.trim();
  const d = raw instanceof Date ? raw : new Date(raw);
  if (Number.isNaN(d.getTime())) return "";
  // ISO a medianoche UTC = fecha pura; si no, la fecha local
  const utcMidnight = typeof raw === "string" && /T00:00:00(\.000)?Z$/.test(raw);
  const y = utcMidnight ? d.getUTCFullYear() : d.getFullYear();
  const m = (utcMidnight ? d.getUTCMonth() : d.getMonth()) + 1;
  const day = utcMidnight ? d.getUTCDate() : d.getDate();
  return `${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/**
 * Filas del calendario a partir de lo guardado: preventionCalendarEvents
 * ([{ date, activity }]) o, en listados viejos, preventionCalendarDate (una o
 * varias fechas sin actividad: se cargan con la actividad en blanco para elegirla).
 */
export function calendarEventsFrom(riskInfo) {
  if (Array.isArray(riskInfo?.preventionCalendarEvents)) {
    return riskInfo.preventionCalendarEvents.map((e) => ({
      date: toYmd(e?.date),
      activity: activityById(e?.activity) ? e.activity : "",
    }));
  }
  const old = riskInfo?.preventionCalendarDate;
  const dates = (Array.isArray(old) ? old : [old]).map(toYmd).filter(Boolean);
  return dates.map((date) => ({ date, activity: "" }));
}

/** Para guardar: sólo filas completas, fechas "YYYY-MM-DD". */
export function cleanCalendarEvents(events) {
  return (Array.isArray(events) ? events : [])
    .map((e) => ({ date: toYmd(e?.date), activity: e?.activity || "" }))
    .filter((e) => e.date && activityById(e.activity));
}
