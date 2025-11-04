import { checkIfArrayIsCompletePIPC } from "./checkIfArrayIsComplete";

export function checkIfSectionIsDone(sectionObj, valuesCompletesRules) {
  const keys = Object.keys(sectionObj);
  return keys.every((key) => {
    const arr = sectionObj[key];
    return checkIfArrayIsCompletePIPC(arr, valuesCompletesRules);
  });
}
