/**
 * Registros del inventario de recursos materiales
 * (studyData.resourceInventory.items[].entries[]). Funciones puras.
 */

export const emptyEntry = (imageUrl = "") => ({ imageUrl, location: "", condition: "" });

/**
 * Agrega al recurso `elIdx` un registro por cada URL (cada uno con su foto y
 * ubicación/estado vacíos para llenar después). Devuelve una copia; las URLs
 * vacías se ignoran.
 */
export function addEntriesWithPhotos(items, elIdx, urls) {
  const clean = (Array.isArray(urls) ? urls : []).filter(
    (u) => typeof u === "string" && u.trim() !== "",
  );
  if (!Array.isArray(items) || clean.length === 0) return items;
  return items.map((it, i) =>
    i !== elIdx
      ? it
      : { ...it, entries: [...(Array.isArray(it.entries) ? it.entries : []), ...clean.map(emptyEntry)] },
  );
}

/** Agrega las URLs a las imágenes de una categoría de evidencias (studyData.evidencePhotos). */
export function appendCategoryImages(photos, catKey, urls) {
  const clean = (Array.isArray(urls) ? urls : []).filter(
    (u) => typeof u === "string" && u.trim() !== "",
  );
  if (clean.length === 0) return photos;
  const cat = photos?.[catKey] ?? { applies: true, images: [] };
  const current = (Array.isArray(cat.images) ? cat.images : []).filter((u) => typeof u === "string");
  return { ...photos, [catKey]: { ...cat, images: [...current, ...clean] } };
}
