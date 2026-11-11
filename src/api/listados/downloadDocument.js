import env from "configs/env.config";

const POLL_MS = 2000;
const MAX_WAIT_MS = 10 * 60 * 1000;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const fail = async (resp, fallback) => {
  const error = await resp.json().catch(() => ({}));
  throw new Error(error.message || fallback);
};

/**
 * Descarga el documento PIPC generado para un listado.
 * Usa fetch con cookies (misma auth que el resto de la app).
 *
 * La generación corre en segundo plano en el backend (con muchos anexos tarda
 * más de lo que el gateway deja abierta una petición): se crea un trabajo, se
 * consulta su estado y al terminar se descarga el archivo.
 *
 * @param {string} listadoId
 * @param {string} empresaName - nombre para el archivo descargado
 * @returns {Promise<void>}
 */
const downloadDocument = async (listadoId, empresaName = "Listado") => {
  const base = `${env.API_URL}/download/document`;

  const startResp = await fetch(`${base}/${listadoId}/job`, {
    method: "POST",
    credentials: "include",
  });
  if (!startResp.ok) await fail(startResp, "Error al generar el documento");
  const { jobId } = await startResp.json();

  const startedAt = Date.now();
  for (;;) {
    await sleep(POLL_MS);
    const statusResp = await fetch(`${base}/job/${jobId}`, { credentials: "include" });
    if (!statusResp.ok) await fail(statusResp, "Error al generar el documento");
    const job = await statusResp.json();
    if (job.status === "done") break;
    if (job.status === "error") throw new Error(job.message || "Error al generar el documento");
    if (Date.now() - startedAt > MAX_WAIT_MS) {
      throw new Error("La generación tardó demasiado. Intenta nuevamente");
    }
  }

  const resp = await fetch(`${base}/job/${jobId}/file`, { credentials: "include" });
  if (!resp.ok) await fail(resp, "Error al descargar el documento");

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
