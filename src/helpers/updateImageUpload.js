import deleteImage from "api/upload/deleteImage";
import uploadImageWithFirma from "api/upload/uploadImageWithFirma.service";
import {
  dataUrlToFile,
  isBlobLike,
  isDataUrl,
  isOwnedByListado,
  isUsableUrl,
  listadoFolder,
  storageKeyFromUrl,
} from "helpers/listadoData";

/**
 * Sube un File/Blob o un dataURL a la carpeta del listado y regresa la URL
 * pública. Si `value` ya es una URL remota la regresa tal cual (no resube).
 * Cualquier otro valor ({}, placeholder, "", null) => "".
 */
export const uploadListadoFile = async (value, { listadoId, folder, fileName = "archivo" } = {}) => {
  const targetFolder = folder || listadoFolder(listadoId);

  if (isUsableUrl(value)) return value;

  let file = null;
  if (isDataUrl(value)) {
    file = dataUrlToFile(value, fileName);
  } else if (isBlobLike(value)) {
    file =
      value instanceof File && value.name
        ? value
        : new File([value], `${fileName}.${(value.type || "/bin").split("/")[1]}`, {
            type: value.type || "application/octet-stream",
          });
  }

  if (!file) return "";

  const url = await uploadImageWithFirma(file, targetFolder);
  if (!isUsableUrl(url)) throw new Error("El servidor no regresó una URL válida para el archivo");
  return url;
};

/**
 * Borra un archivo del storage SÓLO si pertenece a este listado.
 * Nunca lanza: un fallo al borrar no debe impedir guardar.
 */
export const deleteListadoFile = async (url, listadoId) => {
  if (!isOwnedByListado(url, listadoId)) return false;
  try {
    const resp = await deleteImage({ pathName: storageKeyFromUrl(url) });
    return resp?.message === "Archivo eliminado correctamente";
  } catch (err) {
    console.warn("No se pudo borrar el archivo anterior:", err);
    return false;
  }
};

/**
 * Resuelve el valor final (URL string) de un campo de archivo:
 * - `newFile` URL existente  => se conserva, no se sube nada.
 * - `newFile` File/Blob      => se sube.
 * - `newFile` dataURL        => se convierte a File y se sube (firma).
 * - `newFile` vacío/{}       => "" (campo vacío).
 * Primero se sube y DESPUÉS se borra `previousUrl`, sólo si cambió y es un
 * archivo propio del listado (nunca el logo heredado de la empresa).
 */
export const replaceImage = async ({
  previousUrl = null,
  newFile = null,
  listadoId,
  folder,
  fileName = "archivo",
  // false => no borra; quien llama borra después de persistir (deleteListadoFile)
  deletePrevious = true,
}) => {
  // Valor desconocido (p.ej. `{}` de un File serializado): no tocar lo guardado
  const isUnknown =
    newFile !== null &&
    newFile !== undefined &&
    newFile !== "" &&
    !isBlobLike(newFile) &&
    !isDataUrl(newFile) &&
    !isUsableUrl(newFile);
  if (isUnknown) return isUsableUrl(previousUrl) ? previousUrl : "";

  const finalUrl = await uploadListadoFile(newFile, { listadoId, folder, fileName });

  if (deletePrevious && isUsableUrl(previousUrl) && previousUrl !== finalUrl) {
    await deleteListadoFile(previousUrl, listadoId);
  }

  return finalUrl;
};
