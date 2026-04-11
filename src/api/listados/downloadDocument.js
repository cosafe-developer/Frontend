import env from "configs/env.config";

/**
 * Descarga el documento PIPC generado para un listado.
 * Usa fetch con cookies (misma auth que el resto de la app).
 * Dispara la descarga del archivo en el navegador.
 *
 * @param {string} listadoId
 * @param {string} empresaName - nombre para el archivo descargado
 * @returns {Promise<void>}
 */
const downloadDocument = async (listadoId, empresaName = "Listado") => {
  const url = `${env.API_URL}/download/document/${listadoId}`;

  const resp = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!resp.ok) {
    const error = await resp.json().catch(() => ({}));
    throw new Error(error.message || "Error al descargar el documento");
  }

  // Convertir la respuesta a blob y disparar descarga
  const blob = await resp.blob();
  const blobUrl = URL.createObjectURL(blob);

  const safeName = empresaName.replace(/[^a-zA-Z0-9_-]+/g, "_").slice(0, 60);
  const filename = `PIPC_${safeName}_${listadoId}.docx`;

  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(blobUrl);
};

export default downloadDocument;
