// Import Dependencies
import PropTypes from "prop-types";

// ----------------------------------------------------------------------

export function PreviewImg({ file, alt, className }) {

  // Si es string, es una URL real
  if (typeof file === "string") {
    return <img src={file} alt={alt} className={className} />;
  }

  // Si tiene preview, úsalo (viene de una URL o dropzone)
  if (file?.preview) {
    return <img src={file.preview} alt={alt} className={className} />;
  }

  // Si es un File real → crear URL
  if (file instanceof File || file instanceof Blob) {
    const url = URL.createObjectURL(file);
    return <img src={url} alt={alt} className={className} />;
  }

  // Si llega algo inesperado → no crashea
  console.warn("PreviewImg recibió un archivo inválido:", file);
  return null;
}


PreviewImg.propTypes = {
  file: PropTypes.object,
  src: PropTypes.string,
  alt: PropTypes.string,
};
