/**
 * Anexos del estudio (studyData.attachments.documents[]).
 *
 * Cada fila admite varios archivos (imágenes o PDF):
 *   { element, fileUrls: [url, ...], fileUrl: fileUrls[0] }
 * `fileUrl` se conserva (= primer archivo) para compatibilidad con los
 * listados viejos y con el backend que sólo conocía un archivo por fila.
 */
import { isUsableUrl } from "helpers/listadoData";

const uniqueUsable = (urls) => {
  const out = [];
  for (const u of urls) if (isUsableUrl(u) && !out.includes(u)) out.push(u);
  return out;
};

/** URLs de una fila: `fileUrls` si trae alguna; si no, el `fileUrl` viejo. */
export function attachmentFiles(row) {
  const list = Array.isArray(row?.fileUrls) ? uniqueUsable(row.fileUrls) : [];
  if (list.length > 0) return list;
  return isUsableUrl(row?.fileUrl) ? [row.fileUrl] : [];
}

/** Fila con la lista de archivos dada (fileUrl = primero, o null si no hay). */
export function withAttachmentFiles(row, urls) {
  const fileUrls = uniqueUsable(Array.isArray(urls) ? urls : []);
  return { ...row, fileUrls, fileUrl: fileUrls[0] ?? null };
}

/** Agrega archivos al final de la lista de la fila (sin duplicar). */
export function addAttachmentFiles(row, urls) {
  return withAttachmentFiles(row, [...attachmentFiles(row), ...(Array.isArray(urls) ? urls : [])]);
}

/** Quita el archivo `index` de la fila. */
export function removeAttachmentFile(row, index) {
  return withAttachmentFiles(
    row,
    attachmentFiles(row).filter((_, i) => i !== index),
  );
}

/**
 * Forma que se manda al backend por fila:
 *   { element, fileUrls: string[], fileUrl?: string }
 * `fileUrls` siempre va (vacío = sin archivos); `fileUrl` sólo si hay archivo.
 */
export function attachmentForBackend(item) {
  const fileUrls = attachmentFiles(item);
  const out = { element: item?.element, fileUrls };
  if (fileUrls.length > 0) out.fileUrl = fileUrls[0];
  return out;
}
