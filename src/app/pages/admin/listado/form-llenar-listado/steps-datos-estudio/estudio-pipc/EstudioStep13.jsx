import { useEffect, useState } from "react";
import { Button, Checkbox } from "components/ui";
import { useLlenarListadoFormContext } from "../../contexts/LlenarListadoFormContext";
import { evidencePhotoCategories } from "./utils/elementsTask";
import EvidenceUpload from "components/custom-ui/upload-button/EvidenceUpload.component";
import uploadImageWithFirma from "api/upload/uploadImageWithFirma.service";
import updateListado from "api/listados/updateListado";

const buildDefaultPhotos = () => {
  const obj = { isDone: false };
  evidencePhotoCategories.forEach((cat) => {
    obj[cat.key] = { applies: true, images: [] };
  });
  return obj;
};

const EstudioStep13 = ({ onPrev, setFinished, listado }) => {
  const llenarListadoFormCtx = useLlenarListadoFormContext();
  const photosCtx = llenarListadoFormCtx?.state?.formData?.evidencePhotos ?? {};
  const backendPhotos = listado?.studyData?.evidencePhotos || {};

  const [photos, setPhotos] = useState(() => {
    const defaults = buildDefaultPhotos();
    evidencePhotoCategories.forEach((cat) => {
      const ctxCat = photosCtx?.[cat.key];
      const dbCat = backendPhotos?.[cat.key];
      if (ctxCat) {
        defaults[cat.key] = {
          applies: ctxCat.applies ?? true,
          images: Array.isArray(ctxCat.images) ? ctxCat.images : [],
        };
      } else if (dbCat) {
        defaults[cat.key] = {
          applies: dbCat.applies ?? true,
          images: Array.isArray(dbCat.images) ? dbCat.images : [],
        };
      }
    });
    return defaults;
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const persist = async (next) => {
    const payload = { isDone: true };
    evidencePhotoCategories.forEach((cat) => {
      payload[cat.key] = {
        applies: next[cat.key]?.applies ?? true,
        images: next[cat.key]?.images ?? [],
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
      const url = await uploadImageWithFirma(file);
      if (!url) return;
      const next = {
        ...photos,
        [catKey]: {
          ...photos[catKey],
          images: [...(photos[catKey]?.images ?? []), url],
        },
      };
      setPhotos(next);
      persist(next);
    } catch (err) {
      console.error("Error al subir evidencia:", err);
    }
  };

  const handleRemove = (catKey, idx) => {
    const images = [...(photos[catKey]?.images ?? [])];
    images.splice(idx, 1);
    const next = { ...photos, [catKey]: { ...photos[catKey], images } };
    setPhotos(next);
    persist(next);
  };

  const handleFinalize = async () => {
    await persist(photos);
    setFinished?.(true);
  };

  return (
    <div className="flex grow flex-col space-y-8">
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-white">Evidencias Fotográficas</h3>
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
                  <h4 className="text-[15px] font-medium text-white">{cat.label}</h4>
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
                              className="h-24 w-24 object-cover rounded-lg border border-dark-500"
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

      <div className="flex justify-end pt-4 space-x-3">
        <Button type="button" className="min-w-[7rem]" onClick={onPrev}>Atrás</Button>
        <Button type="button" color="primary" className="min-w-[7rem]" onClick={handleFinalize}>
          Finalizar
        </Button>
      </div>
    </div>
  );
};

export default EstudioStep13;
