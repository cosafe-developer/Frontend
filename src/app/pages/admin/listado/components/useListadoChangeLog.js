import { useEffect, useState } from "react";
import { newerChangeLog } from "helpers/changeLog";
import { getKnownChangeLog, publishChangeLog, subscribeChangeLog } from "helpers/listadoChangeLogStore";

/**
 * changeLog más actual del listado: el que trajo el GET (prop `listado`) o
 * el último que devolvió un guardado (updateListado lo publica en el store).
 * Listados viejos sin changeLog => null.
 */
export function useListadoChangeLog(listado) {
  const listadoId = listado?._id ? String(listado._id) : null;
  const fromProp = Array.isArray(listado?.changeLog) ? listado.changeLog : null;

  const [log, setLog] = useState(() => newerChangeLog(getKnownChangeLog(listadoId), fromProp));

  useEffect(() => {
    // El GET también cuenta como versión conocida (p.ej. al recargar el listado)
    const merged = fromProp ? publishChangeLog(listadoId, fromProp) : getKnownChangeLog(listadoId);
    setLog((prev) => newerChangeLog(prev, merged));
    return subscribeChangeLog((id, next) => {
      if (id === listadoId) setLog((prev) => newerChangeLog(prev, next));
    });
  }, [listadoId, fromProp]);

  return log;
}
