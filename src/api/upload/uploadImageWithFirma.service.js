import getFirmaUploadImage from "api/upload/getFirmaUploadImage.service";

/**
 * Sube una imagen a DigitalOcean Spaces usando URL firmada y regresa la URL pública.
 * @param {File} file - Archivo a subir
 * @param {string} [folder] - Carpeta destino en el storage
 * @returns {Promise<string>} URL pública del archivo subido
 */
const uploadImageWithFirma = async (file, folder = "listado-formulario") => {
  try {
    const { signedUrl, publicUrl } = await getFirmaUploadImage({
      fileName: file.name,
      fileType: file.type,
      folder,
    });

    const upload = await fetch(signedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type || "application/octet-stream",
        "x-amz-acl": "public-read",
        "Cache-Control": "public,max-age=31536000,immutable",
      },
      body: file,
    });

    if (!upload.ok) {
      throw new Error("Error al subir la imagen al storage");
    }

    return publicUrl;
  } catch (error) {
    console.error("Error al subir imagen con firma:", error);
    throw error;
  }
};

export default uploadImageWithFirma;
