import { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Button, Input } from "components/ui";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useLlenarListadoFormContext } from "../contexts/LlenarListadoFormContext";
import {
  resourceInventoryElements,
  conditionOptions,
} from "../steps-datos-estudio/estudio-pipc/utils/elementsTask";
import EvidenceUpload from "components/custom-ui/upload-button/EvidenceUpload.component";
import MultiFileUpload from "components/custom-ui/upload-button/MultiFileUpload";
import { HelpTip, LabelHelp } from "components/shared/HelpTip";
import uploadImageWithFirma from "api/upload/uploadImageWithFirma.service";
import updateListado from "api/listados/updateListado";
import { addEntriesWithPhotos, emptyEntry } from "./utils/inventoryEntries";
import { HELP } from "../../helpers/helpTexts";
import { LastChangeNotice } from "../../components/LastChangeNotice";

// Acepta shape nueva {element, entries[]} y vieja {element, location, condition}
const normalizeItems = (rawItems) =>
  resourceInventoryElements.map((element, i) => {
    const raw =
      (Array.isArray(rawItems) &&
        (rawItems.find((it) => it?.element === element) || rawItems[i])) ||
      {};
    if (Array.isArray(raw.entries)) {
      return {
        element,
        entries: raw.entries.map((e) => ({
          imageUrl: typeof e?.imageUrl === "string" ? e.imageUrl : "",
          location: e?.location ?? "",
          condition: e?.condition ?? "",
        })),
      };
    }
    if (raw.location || raw.condition) {
      return {
        element,
        entries: [{ imageUrl: "", location: raw.location || "", condition: raw.condition || "" }],
      };
    }
    return { element, entries: [] };
  });

const ResourceInventorySection = ({ listado }) => {
  const llenarListadoFormCtx = useLlenarListadoFormContext();
  const ctxItems = llenarListadoFormCtx?.state?.formData?.resourceInventory?.items;
  const dbItems = listado?.studyData?.resourceInventory?.items;

  const [items, setItems] = useState(() =>
    normalizeItems(Array.isArray(ctxItems) && ctxItems.length ? ctxItems : dbItems),
  );

  // Guardado remoto con debounce: escribir la ubicación ya no manda un
  // request por tecla. El contexto se actualiza al instante.
  const pendingRef = useRef(null);
  const timerRef = useRef(null);
  const listadoIdRef = useRef(listado?._id);
  listadoIdRef.current = listado?._id;

  const flush = useCallback(() => {
    clearTimeout(timerRef.current);
    timerRef.current = null;
    const payload = pendingRef.current;
    pendingRef.current = null;
    if (!payload || !listadoIdRef.current) return;
    updateListado({
      requestBody: {
        listado_id: listadoIdRef.current,
        studyData: { resourceInventory: payload },
      },
    }).catch((err) => console.error("Error al guardar inventario:", err));
  }, []);

  // Al desmontar (cambiar de paso) se manda lo pendiente
  useEffect(() => flush, [flush]);

  const persist = (next, { debounce = false } = {}) => {
    const payload = { isDone: true, items: next };
    llenarListadoFormCtx.dispatch({
      type: "SET_FORM_DATA",
      payload: { resourceInventory: payload },
    });
    pendingRef.current = payload;
    clearTimeout(timerRef.current);
    if (debounce) {
      timerRef.current = setTimeout(flush, 700);
    } else {
      flush();
    }
  };

  // Última versión de los registros: una subida de foto termina después de
  // otros cambios (otra foto, la ubicación) y no debe partir de un render viejo.
  const itemsRef = useRef(items);
  const commit = (next, options) => {
    itemsRef.current = next;
    setItems(next);
    persist(next, options);
  };

  const updateEntry = (elIdx, entryIdx, changed, options) => {
    const next = itemsRef.current.map((it, i) =>
      i !== elIdx
        ? it
        : {
            ...it,
            entries: it.entries.map((e, j) => (j === entryIdx ? { ...e, ...changed } : e)),
          },
    );
    commit(next, options);
  };

  const addEntry = (elIdx) => {
    const next = itemsRef.current.map((it, i) =>
      i !== elIdx ? it : { ...it, entries: [...it.entries, emptyEntry()] },
    );
    commit(next);
  };

  // "Agregar con fotos": un registro por foto, todos en un solo guardado y
  // sobre la última versión (itemsRef) para no pisar otros cambios.
  const addEntriesFromPhotos = (elIdx, urls) => {
    commit(addEntriesWithPhotos(itemsRef.current, elIdx, urls));
  };

  const uploadPhoto = (file) => uploadImageWithFirma(file, `listado-${listado?._id}`);

  const removeEntry = (elIdx, entryIdx) => {
    const next = itemsRef.current.map((it, i) =>
      i !== elIdx ? it : { ...it, entries: it.entries.filter((_, j) => j !== entryIdx) },
    );
    commit(next);
  };

  const handleUpload = async (elIdx, entryIdx, file) => {
    try {
      const url = await uploadImageWithFirma(file, `listado-${listado?._id}`);
      if (typeof url === "string" && url) updateEntry(elIdx, entryIdx, { imageUrl: url });
    } catch (err) {
      console.error("Error al subir evidencia de inventario:", err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="flex items-center gap-1 text-sm text-gray-400">
          Agrega un registro por cada unidad (ej. cada extintor) con su foto, ubicación y estado.
          <HelpTip text={HELP.resourceInventory.section} label="Qué es: inventario" />
        </p>
        <LastChangeNotice listado={listado} section="resourceInventory" />
      </div>

      {items.map((item, elIdx) => (
        <div
          key={item.element}
          className="rounded-lg border border-gray-200 p-4 dark:border-dark-500"
        >
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-[15px] font-medium text-gray-800 dark:text-dark-100">
              {item.element}
              {item.entries.length > 0 && (
                <span className="ml-2 text-xs text-gray-400">
                  {item.entries.length} registro{item.entries.length !== 1 ? "s" : ""}
                </span>
              )}
            </h4>
            <div className="flex flex-wrap items-start justify-end gap-2">
              <MultiFileUpload
                variant="button"
                size="sm"
                accept="image/*"
                upload={uploadPhoto}
                onUploaded={(urls) => addEntriesFromPhotos(elIdx, urls)}
                label="Agregar con fotos"
                title={HELP.resourceInventory.addWithPhotos}
                className="max-w-64 items-end"
              />
              <Button
                type="button"
                variant="outlined"
                className="h-8 gap-1 px-2 text-xs"
                title={HELP.resourceInventory.addRecord}
                onClick={() => addEntry(elIdx)}
              >
                <PlusIcon className="size-4" />
                Agregar registro
              </Button>
            </div>
          </div>

          {item.entries.length === 0 ? (
            <p className="text-sm italic text-gray-500">Sin registros</p>
          ) : (
            <div className="space-y-3">
              {item.entries.map((entry, entryIdx) => (
                <div
                  key={entryIdx}
                  className="flex flex-wrap items-start gap-3 rounded-lg bg-gray-50 p-3 dark:bg-dark-600"
                >
                  <div className="w-24 shrink-0" title={HELP.resourceInventory.photo}>
                    <EvidenceUpload
                      key={`${item.element}-${entryIdx}-${entry.imageUrl}`}
                      value={entry.imageUrl || null}
                      onChange={(file) => handleUpload(elIdx, entryIdx, file)}
                      onRemove={() => updateEntry(elIdx, entryIdx, { imageUrl: "" })}
                      compact
                    />
                  </div>
                  <div className="min-w-40 flex-1">
                    <Input
                      value={entry.location}
                      label={<LabelHelp label="Ubicación" help={HELP.resourceInventory.location} small />}
                      placeholder="Ej. Data Center, Nivel -1..."
                      className="h-9 text-sm"
                      onChange={(e) =>
                        updateEntry(elIdx, entryIdx, { location: e.target.value }, { debounce: true })
                      }
                      onBlur={flush}
                    />
                  </div>
                  <div className="w-44">
                    <label className="input-label mb-1 block text-xs">
                      <LabelHelp label="Estado de Condición" help={HELP.resourceInventory.condition} small />
                    </label>
                    <select
                      aria-label="Estado de Condición"
                      title={HELP.resourceInventory.condition}
                      value={entry.condition}
                      onChange={(e) => updateEntry(elIdx, entryIdx, { condition: e.target.value })}
                      className="h-9 w-full rounded-lg border border-gray-300 bg-white px-2 text-sm text-gray-800 dark:border-dark-450 dark:bg-dark-700 dark:text-dark-100"
                    >
                      <option value="" className="bg-white text-gray-800 dark:bg-dark-700 dark:text-dark-100">
                        Seleccionar...
                      </option>
                      {conditionOptions.map((opt) => (
                        <option
                          key={opt.value}
                          value={opt.value}
                          className="bg-white text-gray-800 dark:bg-dark-700 dark:text-dark-100"
                        >
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    aria-label="Eliminar registro"
                    title={HELP.resourceInventory.removeRecord}
                    onClick={() => removeEntry(elIdx, entryIdx)}
                    className="mt-6 text-error hover:text-red-400"
                  >
                    <TrashIcon className="size-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

ResourceInventorySection.propTypes = {
  listado: PropTypes.object,
};

export default ResourceInventorySection;
