/**
 * Devuelve un nuevo objeto con solo los campos que cambiaron respecto al original.
 * - Si ambos son objetos, compara recursivamente.
 * - Si son iguales (=== o JSON.stringify iguales), los elimina.
 */
export function filterUnchangedFields(newData, originalData) {
  if (typeof newData !== "object" || newData === null) return newData;

  const result = Array.isArray(newData) ? [] : {};

  for (const key in newData) {
    const newValue = newData[key];
    const originalValue = originalData?.[key];

    // Si ambos son objetos, comparar recursivamente
    if (
      typeof newValue === "object" &&
      newValue !== null &&
      !Array.isArray(newValue)
    ) {
      const nested = filterUnchangedFields(newValue, originalValue);
      if (Object.keys(nested).length > 0) {
        result[key] = nested;
      }
    }
    // Si es array, comparar JSON.stringify (simple pero efectivo)
    else if (Array.isArray(newValue)) {
      if (JSON.stringify(newValue) !== JSON.stringify(originalValue)) {
        result[key] = newValue;
      }
    }
    // Comparación simple de valores primitivos
    else if (newValue !== originalValue) {
      result[key] = newValue;
    }
  }

  return result;
}
