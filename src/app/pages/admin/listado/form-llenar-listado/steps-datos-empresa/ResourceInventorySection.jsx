import { useState } from "react";
import PropTypes from "prop-types";
import { Button, Input } from "components/ui";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useLlenarListadoFormContext } from "../contexts/LlenarListadoFormContext";
import {
  resourceInventoryElements,
  conditionOptions,
} from "../steps-datos-estudio/estudio-pipc/utils/elementsTask";
import EvidenceUpload from "components/custom-ui/upload-button/EvidenceUpload.component";
import uploadImageWithFirma from "api/upload/uploadImageWithFirma.service";
import updateListado from "api/listados/updateListado";

const emptyEntry = () => ({ imageUrl: "", location: "", condition: "" });

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

  const persist = async (next) => {
    const payload = { isDone: true, items: next };
    llenarListadoFormCtx.dispatch({
      type: "SET_FORM_DATA",
      payload: { resourceInventory: payload },
    });
    try {
      await updateListado({
        requestBody: {
          listado_id: listado?._id,
          studyData: { resourceInventory: payload },
        },
      });
    } catch (err) {
      console.error("Error al guardar inventario:", err);
    }
  };

  const updateEntry = (elIdx, entryIdx, changed) => {
    const next = items.map((it, i) =>
      i !== elIdx
        ? it
        : {
            ...it,
            entries: it.entries.map((e, j) => (j === entryIdx ? { ...e, ...changed } : e)),
          },
    );
    setItems(next);
    persist(next);
  };

  const addEntry = (elIdx) => {
    const next = items.map((it, i) =>
      i !== elIdx ? it : { ...it, entries: [...it.entries, emptyEntry()] },
    );
    setItems(next);
    persist(next);
  };

  const removeEntry = (elIdx, entryIdx) => {
    const next = items.map((it, i) =>
      i !== elIdx ? it : { ...it, entries: it.entries.filter((_, j) => j !== entryIdx) },
    );
    setItems(next);
    persist(next);
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
      <p className="text-sm text-gray-400">
        Agrega un registro por cada unidad (ej. cada extintor) con su foto, ubicación y estado.
      </p>

      {items.map((item, elIdx) => (
        <div
          key={item.element}
          className="rounded-lg border border-gray-200 p-4 dark:border-dark-500"
        >
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-[15px] font-medium text-gray-800 dark:text-dark-100">
              {item.element}
              {item.entries.length > 0 && (
                <span className="ml-2 text-xs text-gray-400">
                  {item.entries.length} registro{item.entries.length !== 1 ? "s" : ""}
                </span>
              )}
            </h4>
            <Button
              type="button"
              variant="outlined"
              className="h-8 gap-1 px-2 text-xs"
              onClick={() => addEntry(elIdx)}
            >
              <PlusIcon className="size-4" />
              Agregar registro
            </Button>
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
                  <div className="w-24 shrink-0">
                    <EvidenceUpload
                      key={`${item.element}-${entryIdx}-${entry.imageUrl}`}
                      value={entry.imageUrl || null}
                      onChange={(file) => handleUpload(elIdx, entryIdx, file)}
                      onRemove={() => updateEntry(elIdx, entryIdx, { imageUrl: "" })}
                    />
                  </div>
                  <div className="min-w-40 flex-1">
                    <Input
                      value={entry.location}
                      label="Ubicación"
                      placeholder="Ej. Data Center, Nivel -1..."
                      className="h-9 text-sm"
                      onChange={(e) => updateEntry(elIdx, entryIdx, { location: e.target.value })}
                    />
                  </div>
                  <div className="w-44">
                    <label className="input-label mb-1 block text-xs">Estado de Condición</label>
                    <select
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
