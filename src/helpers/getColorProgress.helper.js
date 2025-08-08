export function getColorProgress(val) {
  if (val === 0) return "neutral";
  if (val === 100) return "success";
  if (val < 10) return "warning";
  if (val < 50) return "info";
  return "primary";
}