import { toast } from "sonner";

/**
 * Muestra un toast.promise con estilos personalizados y manejo de errores del backend.
 * @param {Function} promiseFn - Función async que será ejecutada.
 * @param {string} successMessage - Mensaje de éxito a mostrar.
 */
const mostrarToastPromise= (promiseFn, successMessage = "✅ Operación exitosa")=>{
  return toast.promise(promiseFn, {
    loading: "Procesando...",
    success: () => ({
      description: successMessage,
      style: {
        background: "#007b5a",
        color: "#fff",
        borderRadius: "8px",
        border: "none",
        boxShadow: "none",
      },
      iconTheme: {
        primary: "#fff",
        secondary: "#007b5a",
      },
      duration: 4000,
    }),
    error: (err) => {
      const msg =
        err?.response?.data?.errores?.join(", ") ||
        err?.response?.data?.mensaje ||
        "❌ Error desconocido";

      return {
        description: msg,
        style: {
          background: "#e53935",
          color: "#fff",
          borderRadius: "8px",
          border: "none",
          boxShadow: "none",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#e53935",
        },
        duration: 4000,
      };
    },
  });
}

export default mostrarToastPromise;