// helper
export const normalizeDate = (dateString, dateType = "default") => {
  if (!dateString) return "";


  let fixed = dateString.replace(" ", "T");
  if (fixed.endsWith("Z")) fixed = fixed.slice(0, -1);

  const date = new Date(fixed);
  if (isNaN(date)) return "";

  switch (dateType) {
    case "letter": // devuelve algo como 08 Mar 2025
      return date.toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

    case "hour": // devuelve hora en formato 04:20 PM
      return date.toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

    default: // formato ISO como fallback
      return date.toISOString();
  }
};
