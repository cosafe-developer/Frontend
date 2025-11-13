// checkIfArrayIsComplete.js
export function checkIfArrayIsCompletePIPC(array, requiredFields = ["riskLevel"], mode = "all") {
  if (!Array.isArray(array) || array.length === 0) return false;

  // Cada item del array debe cumplir su regla según el modo
  return array.every((item) => {
    if (mode === "all") {
      return requiredFields.every((field) => {
        const value = item[field];
        if (value === null || value === undefined) return false;
        if (typeof value === "boolean") return value === true;
        if (typeof value === "string") return value.trim() !== "";
        return Boolean(value);
      });
    }

    if (mode === "some") {
      return requiredFields.some((field) => {
        const value = item[field];
        if (value === null || value === undefined) return false;
        if (typeof value === "boolean") return value === true;
        if (typeof value === "string") return value.trim() !== "";
        return Boolean(value);
      });
    }

    return false;
  });
}
