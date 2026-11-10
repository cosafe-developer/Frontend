/**
 * Subida de varios archivos a la vez (fotos de evidencias, inventario, anexos).
 *
 * Funciones puras (sin React ni API; la función que sube un archivo se
 * inyecta) para poder probarlas con node.
 */

/** Cuántos archivos se suben en paralelo como máximo. */
export const DEFAULT_UPLOAD_CONCURRENCY = 3;

const fileNameOf = (file) =>
  (file && typeof file.name === "string" && file.name) || "archivo";

/**
 * ¿El archivo cumple el `accept` de un <input type="file">?
 * Acepta tipos exactos ("application/pdf"), comodines ("image/*") y
 * extensiones (".pdf"). Sin `accept` todo pasa.
 */
export function matchesAccept(file, accept) {
  if (!accept) return true;
  const type = String(file?.type || "").toLowerCase();
  const name = fileNameOf(file).toLowerCase();
  return accept
    .split(",")
    .map((rule) => rule.trim().toLowerCase())
    .filter(Boolean)
    .some((rule) => {
      if (rule.startsWith(".")) return name.endsWith(rule);
      if (rule.endsWith("/*")) return type.startsWith(rule.slice(0, -1));
      return type === rule;
    });
}

/**
 * Separa los archivos (FileList, array o archivo suelto) en aceptados y
 * rechazados según `accept` (al arrastrar, el navegador no filtra por tipo).
 */
export function splitAccepted(files, accept) {
  const list = Array.from(files ?? []).filter(Boolean);
  const accepted = [];
  const rejected = [];
  for (const file of list) (matchesAccept(file, accept) ? accepted : rejected).push(file);
  return { accepted, rejected };
}

/**
 * Sube `files` con `upload(file) => Promise<url>` respetando un máximo de
 * `concurrency` subidas simultáneas. Una falla no detiene a las demás.
 *
 * `onProgress({ done, total, failed })` se llama al terminar cada archivo.
 *
 * Devuelve:
 *  - results: [{ index, file, url } | { index, file, error }] en el orden original
 *  - urls:    URLs subidas con éxito, en el orden en que se eligieron
 *  - failed:  [{ index, file, name, error }]
 */
export async function uploadMany(files, upload, { concurrency = DEFAULT_UPLOAD_CONCURRENCY, onProgress } = {}) {
  const list = Array.from(files ?? []).filter(Boolean);
  const total = list.length;
  const results = new Array(total);
  const limit = Math.max(1, Math.floor(concurrency) || 1);
  let next = 0;
  let done = 0;
  let failedCount = 0;

  const worker = async () => {
    while (next < total) {
      const index = next++;
      const file = list[index];
      try {
        const url = await upload(file);
        if (typeof url !== "string" || url.trim() === "") {
          throw new Error("El servidor no regresó una URL válida");
        }
        results[index] = { index, file, url };
      } catch (error) {
        failedCount++;
        results[index] = { index, file, error };
      }
      done++;
      onProgress?.({ done, total, failed: failedCount });
    }
  };

  await Promise.all(Array.from({ length: Math.min(limit, total) }, worker));

  return {
    results,
    urls: results.filter((r) => r.url).map((r) => r.url),
    failed: results
      .filter((r) => r.error)
      .map((r) => ({ index: r.index, file: r.file, name: fileNameOf(r.file), error: r.error })),
  };
}

/** "Subiendo 2 de 5…" */
export function formatUploadProgress({ done = 0, total = 0 } = {}) {
  if (!total) return "";
  const current = Math.min(done + 1, total);
  return `Subiendo ${current} de ${total}…`;
}

/** Mensaje para el usuario con los archivos que no se pudieron subir. */
export function describeUploadFailures(failed = [], total = 0) {
  if (!failed.length) return "";
  const names = failed.map((f) => f.name || fileNameOf(f.file)).join(", ");
  const ok = Math.max(0, total - failed.length);
  const prefix =
    failed.length === 1 ? "No se pudo subir 1 archivo" : `No se pudieron subir ${failed.length} archivos`;
  const kept = total ? ` (se guardaron ${ok} de ${total})` : "";
  return `${prefix}${kept}: ${names}. Vuelve a intentarlo con esos archivos.`;
}
