export function checkIfArrayIsCompletePIPC(array, requiredFields = ["riskLevel"]) {
  if (!Array.isArray(array) || array.length === 0) return false;

  return array.every((item) =>
    requiredFields.every((field) => {
      const value = item[field];
      if (value === null || value === undefined) return false;
      if (typeof value === "string") return value.trim() !== "";
      return true;
    })
  );
}
