// Función para limpiar un objeto recursivamente
export const filterNullsEmptyObject = (obj) => {
  if (!obj || typeof obj !== "object") return obj;

  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value === null || value === undefined || value === "") return acc;

    // Si es un array, filtra los elementos null/undefined
    if (Array.isArray(value)) {
      const cleanedArray = value.filter((v) => v !== null && v !== undefined && v !== "");
      if (cleanedArray.length) acc[key] = cleanedArray;
      return acc;
    }

    // Si es un objeto, limpiarlo recursivamente
    if (typeof value === "object") {
      const cleanedValue = filterNullsEmptyObject(value);
      if (Object.keys(cleanedValue).length > 0) acc[key] = cleanedValue;
      return acc;
    }

    // Si tiene un valor válido, mantenerlo
    acc[key] = value;
    return acc;
  }, {});
};
