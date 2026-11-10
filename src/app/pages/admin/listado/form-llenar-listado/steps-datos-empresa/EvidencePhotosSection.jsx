import { useRef, useState } from "react";
import PropTypes from "prop-types";
import { Checkbox } from "components/ui";
import { useLlenarListadoFormContext } from "../contexts/LlenarListadoFormContext";
import { evidencePhotoCategories } from "../steps-datos-estudio/estudio-pipc/utils/elementsTask";
import MultiFileUpload from "components/custom-ui/upload-button/MultiFileUpload";
import { HelpTip, LabelHelp } from "components/shared/HelpTip";
import uploadImageWithFirma from "api/upload/uploadImageWithFirma.service";
import updateListado from "api/listados/updateListado";
import { appendCategoryImages } from "./utils/inventoryEntries";
import { HELP } from "../../helpers/helpTexts";
import { LastChangeNotice } from "../../components/LastChangeNotice";

const onlyUrls = (images) =>
  (Array.isArray(images) ? images : []).filter((u) => typeof u === "string");

// Solo Señalizaciones se captura aquí; las demás categorías salen de los
// registros del inventario (extintores, botiquines, lámparas, detectores).
const visibleCategories = evidencePhotoCategories.filter((c) => c.key === "signage");

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

  // Última versión: varias fotos subidas seguidas no deben pisarse entre sí
  const photosRef = useRef(photos);
  const commit = (next) => {
    photosRef.current = next;
    setPhotos(next);
    persist(next);
  };

  const handleToggle = (catKey, applies) => {
    const cur = photosRef.current;
    commit({ ...cur, [catKey]: { ...cur[catKey], applies } });
  };

  const uploadPhoto = (file) => uploadImageWithFirma(file, `listado-${listado?._id}`);

  // Varias fotos a la vez: se agregan todas juntas al terminar, partiendo
  // de la última versión (photosRef) para no pisar otros cambios.
  const handleUploaded = (catKey, urls) => {
    commit(appendCategoryImages(photosRef.current, catKey, urls));
  };

  const handleRemove = (catKey, idx) => {
    const cur = photosRef.current;
    const images = onlyUrls(cur[catKey]?.images);
    images.splice(idx, 1);
    commit({ ...cur, [catKey]: { ...cur[catKey], images } });
  };

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-[15px] font-medium text-gray-800 dark:text-dark-100">
          <LabelHelp label="Evidencias Fotográficas" help={HELP.evidencePhotos.section} />
        </h4>
        <LastChangeNotice listado={listado} section="evidencePhotos" />
      </div>
      <p className="text-sm text-gray-400">
        Las fotos de extintores, botiquines, lámparas y detectores se agregan en cada
        registro del inventario. Aquí solo se suben las señalizaciones.
      </p>

      <div className="space-y-6">
        {visibleCategories.map((cat) => {
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
                  <div className="flex items-center gap-1">
                    <label className="flex items-center gap-2 text-sm text-gray-400">
                      <Checkbox
                        color="primary"
                        checked={data.applies}
                        title={HELP.evidencePhotos.applies}
                        onChange={(e) => handleToggle(cat.key, e.target.checked)}
                      />
                      Aplica
                    </label>
                    <HelpTip text={HELP.evidencePhotos.applies} label="Qué es: Aplica" />
                  </div>
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
                              title={HELP.evidencePhotos.remove}
                              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center shadow"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <MultiFileUpload
                      accept="image/*"
                      upload={uploadPhoto}
                      onUploaded={(urls) => handleUploaded(cat.key, urls)}
                      label="Seleccionar fotos"
                      hint="o arrastra varias aquí (se suben de 3 en 3)"
                      title={HELP.evidencePhotos.upload}
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
