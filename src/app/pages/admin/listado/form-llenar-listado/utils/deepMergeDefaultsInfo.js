export function deepMergeDefaults(defaults, newData) {
  const result = { ...defaults };
  for (const key of Object.keys(defaults)) {
    if (Array.isArray(newData[key]) && newData[key].length > 0) {

      result[key] = newData[key];
    } else {

      result[key] = defaults[key];
    }
  }
  return result;
}
