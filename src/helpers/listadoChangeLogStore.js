/**
 * Último changeLog conocido por listado, compartido entre todos los
 * recuadros "Último cambio" del formulario. updateListado publica aquí el
 * changeLog que trae la respuesta (data.changeLog); si la respuesta no lo
 * trae, se conserva el último conocido. Sin React: se prueba con node.
 */
import { newerChangeLog } from "helpers/changeLog";

const logs = new Map();
const listeners = new Set();

export function getKnownChangeLog(listadoId) {
  return listadoId ? logs.get(String(listadoId)) ?? null : null;
}

/** Guarda `changeLog` si es más actual que el conocido y avisa a los suscriptores. */
export function publishChangeLog(listadoId, changeLog) {
  if (!listadoId || !Array.isArray(changeLog)) return getKnownChangeLog(listadoId);
  const key = String(listadoId);
  const current = logs.get(key) ?? null;
  const next = newerChangeLog(current, changeLog);
  if (next !== current) {
    logs.set(key, next);
    listeners.forEach((fn) => fn(key, next));
  }
  return next;
}

export function subscribeChangeLog(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Sólo para pruebas. */
export function resetChangeLogStore() {
  logs.clear();
  listeners.clear();
}
