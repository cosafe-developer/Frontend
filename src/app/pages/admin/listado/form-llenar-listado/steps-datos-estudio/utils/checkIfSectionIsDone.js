// checkIfSectionIsDone.js
import { checkIfArrayIsCompletePIPC } from "./checkIfArrayIsComplete";

export function checkIfSectionIsDone(sectionObj, requiredFields, mode = "all") {
  const arrayKeys = Object.keys(sectionObj).filter(
    (key) => Array.isArray(sectionObj[key])
  );

  return arrayKeys.every((key) => {
    const arr = sectionObj[key];
    return checkIfArrayIsCompletePIPC(arr, requiredFields, mode);
  });
}
