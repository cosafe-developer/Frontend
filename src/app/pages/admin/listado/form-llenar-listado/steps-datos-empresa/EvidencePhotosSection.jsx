import { useState } from "react";
import PropTypes from "prop-types";
import { Checkbox } from "components/ui";
import { useLlenarListadoFormContext } from "../contexts/LlenarListadoFormContext";
import { evidencePhotoCategories } from "../steps-datos-estudio/estudio-pipc/utils/elementsTask";
import EvidenceUpload from "components/custom-ui/upload-button/EvidenceUpload.component";
import uploadImageWithFirma from "api/upload/uploadImageWithFirma.service";
import updateListado from "api/listados/updateListado";

const onlyUrls = (images) =>
  (Array.isArray(images) ? images : []).filter((u) => typeof u === "string");

const buildDefaultPhotos = () => {
  const obj = { isDone: false };
  evidencePhotoCategories.forEach((cat) => {
    obj[cat.key] = { applies: true, images: [] };
  });
  return obj;
};

const EvidencePhotosSection = ({ listado }) => {
  const llenarListadoFormCtx = useLlenarListadoFormContext();
  const photosCtx = llenarListadoFormCtx?.state?.formData?.evidencePhotos ?? {};
  const backendPhotos = listado?.studyData?.evidencePhotos || {};

  const [photos, setPhotos] = useState(() => {
    const defaults = buildDefaultPhotos();
    evidencePhotoCategories.forEach((cat) => {
      const source = photosCtx?.[cat.key] ?? backendPhotos?.[cat.key];
      if (source) {
        defaults[cat.key] = {
          applies: source.applies ?? true,
          images: onlyUrls(source.images),
        };
      }
    });
    return defaults;
  });

  const persist = async (next) => {
    const payload = { isDone: true };
    evidencePhotoCategories.forEach((cat) => {
      payload[cat.key] = {
        applies: next[cat.key]?.applies ?? true,
        images: onlyUrls(next[cat.key]?.images),
      };
    });

    llenarListadoFormCtx.dispatch({
      type: "SET_FORM_DATA",
      payload: { evidencePhotos: payload },
    });

    try {
      await updateListado({
        requestBody: {
          listado_id: listado?._id,
          studyData: { evidencePhotos: payload },
        },
      });
    } catch (err) {
      console.error("Error al guardar evidencias:", err);
    }
  };

  const handleToggle = (catKey, applies) => {
    const next = { ...photos, [catKey]: { ...photos[catKey], applies } };
    setPhotos(next);
    persist(next);
  };

  const handleUpload = async (catKey, file) => {
    try {
      const url = await uploadImageWithFirma(file, `listado-${listado?._id}`);
      if (typeof url !== "string" || !url) return;
      const next = {
        ...photos,
        [catKey]: {
          ...photos[catKey],
          images: [...onlyUrls(photos[catKey]?.images), url],
        },
      };
      setPhotos(next);
      persist(next);
    } catch (err) {
      console.error("Error al subir evidencia:", err);
    }
  };

  const handleRemove = (catKey, idx) => {
    const images = onlyUrls(photos[catKey]?.images);
    images.splice(idx, 1);
    const next = { ...photos, [catKey]: { ...photos[catKey], images } };
    setPhotos(next);
    persist(next);
  };

  return (
    <div className="flex flex-col gap-y-3">
      <h4 className="text-[15px] font-medium text-gray-800 dark:text-dark-100">
        Evidencias Fotográficas
      </h4>
      <p className="text-sm text-gray-400">
        Sube imágenes para cada categoría. Cada una puede aplicar o no de forma independiente.
      </p>

      <div className="space-y-6">
        {evidencePhotoCategories.map((cat) => {
            const data = photos[cat.key] ?? { applies: true, images: [] };
            return (
              <div
                key={cat.key}
                className="rounded-lg border border-gray-200 p-4 dark:border-dark-500"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-[15px] font-medium text-gray-800 dark:text-dark-100">
                    {cat.label}
                  </h4>
                  <label className="flex items-center gap-2 text-sm text-gray-400">
                    <Checkbox
                      color="primary"
                      checked={data.applies}
                      onChange={(e) => handleToggle(cat.key, e.target.checked)}
                    />
                    Aplica
                  </label>
                </div>

                {data.applies ? (
                  <div className="space-y-3">
                    {data.images.length > 0 && (
                      <div className="flex flex-wrap gap-3">
                        {data.images.map((url, idx) => (
                          <div key={idx} className="relative">
                            <img
                              src={url}
                              alt={`${cat.label} ${idx + 1}`}
                              className="h-24 w-24 object-cover rounded-lg border border-gray-200 dark:border-dark-500"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemove(cat.key, idx)}
                              aria-label="Eliminar imagen"
                              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center shadow"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <EvidenceUpload
                      key={`${cat.key}-${data.images.length}`}
                      value={null}
                      onChange={(file) => handleUpload(cat.key, file)}
                      onRemove={() => {}}
                    />
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No aplica</p>
                )}
              </div>
            );
        })}
      </div>
    </div>
  );
};

EvidencePhotosSection.propTypes = {
  listado: PropTypes.object,
};

export default EvidencePhotosSection;
