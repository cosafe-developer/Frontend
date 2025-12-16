import deleteImage from "api/upload/deleteImage";
import getFirmaUploadImage from "api/upload/getFirmaUploadImage.service";



export const replaceImage = async ({
  previousUrl = null,
  newFile = null,
  folder = "empresa",
}) => {
  try {
    // 1. Borrar imagen previa si existe
    if (typeof previousUrl === "string" && previousUrl.length > 0) {
      const pathName = previousUrl.replace(
        "https://cosafeimg.nyc3.digitaloceanspaces.com/",
        ""
      );

      const deletingImage = await deleteImage({ pathName });

      if (deletingImage?.message !== "Archivo eliminado correctamente") {
        throw new Error("Error al borrar la imagen anterior");
      }
    }

    // 2. Subir nuevo archivo
    if (newFile) {
      const firmaResp = await getFirmaUploadImage({
        fileName: newFile.name,
        fileType: newFile.type,
        folder,
      });


      await fetch(firmaResp.signedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": newFile.type || "application/octet-stream",
          "x-amz-acl": "public-read",
          "Cache-Control": "public,max-age=31536000,immutable",
        },
        body: newFile,
      });

      // 3. Regresar nueva URL
      return firmaResp.publicUrl;
    }

    return null;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
