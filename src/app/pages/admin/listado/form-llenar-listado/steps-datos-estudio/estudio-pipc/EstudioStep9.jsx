import { useForm, Controller } from "react-hook-form";
import { Button, Table, THead, TBody, Th, Tr, Td, Checkbox, Input } from "components/ui";
import EvidenceUpload from "components/custom-ui/upload-button/EvidenceUpload.component";
import { useLlenarListadoFormContext } from "../../contexts/LlenarListadoFormContext";
import { useEffect, useState } from "react";
import { resetDataEstudioStep9 } from "./utils/resetDataEstudioStep9";
import { deepMergeDefaults } from "../../utils/deepMergeDefaultsInfo";
import {
  alarmSystemElements,
  resourceInventoryElements,
  conditionOptions,
  evidencePhotoCategories,
} from "./utils/elementsTask";

import updateListado from "api/listados/updateListado";
import uploadImageWithFirma from "api/upload/uploadImageWithFirma.service";

// ─── Alarm System (existing) ───
const alarmSections = [
  { key: "alarmSystem", label: "Sistema de Alarma", elements: alarmSystemElements },
];

const buildDefaultAlarm = (elements) =>
  elements.map((el, i) => ({
    _uid: i,
    element: el,
    evidenceUrl: null,
    exists: false,
  }));

const filterAlarmForBackend = (item) => {
  const out = { element: item.element };
  if (item.evidenceUrl) out.evidenceUrl = item.evidenceUrl;
  if (typeof item.exists !== "undefined") out.exists = item.exists;
  return out;
};

// ─── Resource Inventory ───
const buildDefaultInventory = () =>
  resourceInventoryElements.map((el, i) => ({
    _uid: i,
    element: el,
    location: "",
    condition: "",
  }));

// ─── Evidence Photos ───
const buildDefaultPhotos = () => {
  const obj = { isDone: false };
  evidencePhotoCategories.forEach((cat) => {
    obj[cat.key] = { applies: true, images: [] };
  });
  return obj;
};

const EstudioStep9 = ({ onNext, onPrev, listado }) => {
  const llenarListadoFormCtx = useLlenarListadoFormContext();
  const securityMeasuresCtx = llenarListadoFormCtx?.state?.formData?.securityMeasures ?? {};

  // Resource inventory from backend or default
  const backendInventory = listado?.studyData?.resourceInventory?.items || [];
  const [inventoryItems, setInventoryItems] = useState(() => {
    if (backendInventory.length > 0) {
      return backendInventory.map((item, i) => ({
        _uid: i,
        element: item.element || resourceInventoryElements[i] || "",
        location: item.location || "",
        condition: item.condition || "",
      }));
    }
    return buildDefaultInventory();
  });

  // Evidence photos from backend or default
  const backendPhotos = listado?.studyData?.evidencePhotos || {};
  const [evidencePhotos, setEvidencePhotos] = useState(() => {
    const defaults = buildDefaultPhotos();
    evidencePhotoCategories.forEach((cat) => {
      if (backendPhotos[cat.key]) {
        defaults[cat.key] = {
          applies: backendPhotos[cat.key].applies ?? true,
          images: backendPhotos[cat.key].images || [],
        };
      }
    });
    return defaults;
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // ─── Alarm System form (existing logic) ───
  const defaultValues = {};
  alarmSections.forEach((section) => {
    defaultValues[section.key] =
      Array.isArray(securityMeasuresCtx[section.key]) && securityMeasuresCtx[section.key].length > 0
        ? securityMeasuresCtx[section.key].map((item, i) => ({
            _uid: i,
            element: item.element ?? section.elements[i] ?? `Elemento ${i + 1}`,
            evidenceUrl: item.evidenceUrl ?? null,
            exists: typeof item.exists === "boolean" ? item.exists : false,
          }))
        : buildDefaultAlarm(section.elements);
  });

  const { control, handleSubmit, watch, reset, setValue } = useForm({ defaultValues });

  useEffect(() => {
    if (listado && securityMeasuresCtx) {
      const newData = resetDataEstudioStep9({ listado, securityMeasuresCtx });
      const merged = deepMergeDefaults(defaultValues, newData);
      reset(merged);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset, listado]);

  // ─── Alarm field change handler ───
  const handleAlarmChange = async (sectionKey, rowIndex, changedFields) => {
    try {
      const currentArray = watch(sectionKey) || [];
      const updatedArray = [...currentArray];
      updatedArray[rowIndex] = { ...updatedArray[rowIndex], ...changedFields };
      setValue(sectionKey, updatedArray);

      const newSecurityMeasures = { ...securityMeasuresCtx, [sectionKey]: updatedArray };

      llenarListadoFormCtx.dispatch({
        type: "SET_FORM_DATA",
        payload: { securityMeasures: { ...newSecurityMeasures, isDone: true } },
      });

      const backendData = listado?.studyData?.securityMeasures ?? {};
      const merged = { ...backendData, ...newSecurityMeasures };
      const cleaned = Object.fromEntries(
        Object.entries(merged).map(([key, arr]) => [
          key,
          Array.isArray(arr) ? arr.map(filterAlarmForBackend) : arr,
        ])
      );

      await updateListado({
        requestBody: {
          listado_id: listado?._id,
          studyData: { securityMeasures: { ...cleaned, isDone: true } },
        },
      });
    } catch (err) {
      console.error("Error al actualizar alarma:", err);
    }
  };

  // ─── Inventory field change handler ───
  const handleInventoryChange = async (rowIndex, changedFields) => {
    try {
      const updated = [...inventoryItems];
      updated[rowIndex] = { ...updated[rowIndex], ...changedFields };
      setInventoryItems(updated);

      const items = updated.map((item) => ({
        element: item.element,
        location: item.location || "",
        condition: item.condition || "",
      }));

      await updateListado({
        requestBody: {
          listado_id: listado?._id,
          studyData: { resourceInventory: { isDone: true, items } },
        },
      });
    } catch (err) {
      console.error("Error al actualizar inventario:", err);
    }
  };

  // ─── Evidence photos handler ───
  const handlePhotoToggle = async (catKey, applies) => {
    const updated = { ...evidencePhotos, [catKey]: { ...evidencePhotos[catKey], applies } };
    setEvidencePhotos(updated);
    await savePhotos(updated);
  };

  const handlePhotoUpload = async (catKey, file) => {
    try {
      const url = await uploadImageWithFirma(file);
      if (!url) return;
      const updated = {
        ...evidencePhotos,
        [catKey]: {
          ...evidencePhotos[catKey],
          images: [...(evidencePhotos[catKey]?.images || []), url],
        },
      };
      setEvidencePhotos(updated);
      await savePhotos(updated);
    } catch (err) {
      console.error("Error al subir foto:", err);
    }
  };

  const handlePhotoRemove = async (catKey, index) => {
    const images = [...(evidencePhotos[catKey]?.images || [])];
    images.splice(index, 1);
    const updated = { ...evidencePhotos, [catKey]: { ...evidencePhotos[catKey], images } };
    setEvidencePhotos(updated);
    await savePhotos(updated);
  };

  const savePhotos = async (photos) => {
    try {
      const payload = { isDone: true };
      evidencePhotoCategories.forEach((cat) => {
        payload[cat.key] = {
          applies: photos[cat.key]?.applies ?? true,
          images: photos[cat.key]?.images || [],
        };
      });
      await updateListado({
        requestBody: {
          listado_id: listado?._id,
          studyData: { evidencePhotos: payload },
        },
      });
    } catch (err) {
      console.error("Error al guardar fotos:", err);
    }
  };

  const onSubmit = async () => {
    onNext();
  };

  // Previous step handler
  const handlePrev = () => {
    llenarListadoFormCtx.dispatch({
      type: "SET_STEP_STATUS",
      payload: {
        securityMeasures: {
          ...securityMeasuresCtx,
          isDone: listado?.studyData?.securityMeasures?.isDone ?? false,
        },
      },
    });
    onPrev();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex grow flex-col space-y-10">

      {/* ═══ INVENTARIO DE RECURSOS MATERIALES ═══ */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-white">
          Inventario de Recursos Materiales (Ubicación y Condición)
        </h3>
        <div className="overflow-x-auto">
          <Table className="w-full text-left rtl:text-right">
            <THead>
              <Tr className="border-b border-gray-200 dark:border-dark-500">
                <Th className="w-[5%] text-center">#</Th>
                <Th className="w-[35%]">Elemento a Evaluar</Th>
                <Th className="w-[35%]">Ubicación</Th>
                <Th className="w-[25%]">Estado de Condición</Th>
              </Tr>
            </THead>
            <TBody>
              {inventoryItems.map((item, idx) => (
                <Tr key={item._uid} className="border-b border-gray-200 dark:border-dark-500">
                  <Td className="text-center">{idx + 1}</Td>
                  <Td className="text-[15px]">{item.element}</Td>
                  <Td>
                    <Input
                      value={item.location}
                      placeholder="Ubicación..."
                      className="h-9 text-sm"
                      onChange={(e) =>
                        handleInventoryChange(idx, { location: e.target.value })
                      }
                    />
                  </Td>
                  <Td>
                    <select
                      value={item.condition}
                      onChange={(e) =>
                        handleInventoryChange(idx, { condition: e.target.value })
                      }
                      className="h-9 w-full rounded-lg border border-gray-300 bg-transparent px-2 text-sm dark:border-dark-450 dark:text-dark-100"
                    >
                      <option value="">Seleccionar...</option>
                      {conditionOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        </div>
      </div>

      {/* ═══ SISTEMA DE ALARMA (existing) ═══ */}
      {alarmSections.map((section) => {
        const rows = watch(section.key) || [];
        return (
          <div key={section.key} className="space-y-3">
            <h3 className="text-lg font-medium text-white">{section.label}</h3>
            <div className="overflow-x-auto">
              <Table className="w-full text-left rtl:text-right">
                <THead>
                  <Tr className="border-b border-gray-200 dark:border-dark-500">
                    <Th className="w-[5%] text-center">#</Th>
                    <Th className="w-[45%] min-w-[250px]">Elemento a Evaluar</Th>
                    <Th className="w-[20%] text-center">Evidencia</Th>
                    <Th className="w-[10%] text-center">Existencia</Th>
                  </Tr>
                </THead>
                <TBody>
                  {rows.map((row, rowIndex) => (
                    <Tr key={row._uid ?? rowIndex} className="border-b border-gray-200 dark:border-dark-500">
                      <Td>{rowIndex + 1}</Td>
                      <Td className="text-[15px]">{row.element}</Td>
                      <Td className="text-center">
                        <EvidenceUpload
                          value={row.evidenceUrl}
                          onChange={async (file) => {
                            const url = await uploadImageWithFirma(file);
                            await handleAlarmChange(section.key, rowIndex, { evidenceUrl: url });
                          }}
                          onRemove={() => handleAlarmChange(section.key, rowIndex, { evidenceUrl: null })}
                        />
                      </Td>
                      <Td className="text-center">
                        <Controller
                          name={`${section.key}.${rowIndex}.exists`}
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              color="success"
                              checked={field.value || false}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                field.onChange(checked);
                                handleAlarmChange(section.key, rowIndex, { exists: checked });
                              }}
                            />
                          )}
                        />
                      </Td>
                    </Tr>
                  ))}
                </TBody>
              </Table>
            </div>
          </div>
        );
      })}

      {/* ═══ EVIDENCIAS FOTOGRÁFICAS ═══ */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-white">Evidencias Fotográficas</h3>
        <p className="text-sm text-gray-400">
          Sube imágenes de evidencia para cada categoría. Cada una puede aplicar o no de forma independiente.
        </p>

        <div className="space-y-6">
          {evidencePhotoCategories.map((cat) => {
            const catData = evidencePhotos[cat.key] || { applies: true, images: [] };
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
                      checked={catData.applies}
                      onChange={(e) => handlePhotoToggle(cat.key, e.target.checked)}
                    />
                    Aplica
                  </label>
                </div>

                {catData.applies && (
                  <div className="space-y-3">
                    {/* Imágenes existentes */}
                    {catData.images.length > 0 && (
                      <div className="flex flex-wrap gap-3">
                        {catData.images.map((url, imgIdx) => (
                          <div key={imgIdx} className="relative group">
                            <img
                              src={url}
                              alt={`${cat.label} ${imgIdx + 1}`}
                              className="h-24 w-24 object-cover rounded-lg border border-dark-500"
                            />
                            <button
                              type="button"
                              onClick={() => handlePhotoRemove(cat.key, imgIdx)}
                              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Botón subir */}
                    <EvidenceUpload
                      value={null}
                      onChange={(file) => handlePhotoUpload(cat.key, file)}
                      onRemove={() => {}}
                    />
                  </div>
                )}

                {!catData.applies && (
                  <p className="text-sm text-gray-500 italic">No aplica</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══ NAVEGACIÓN ═══ */}
      <div className="flex justify-end pt-4 space-x-3">
        <Button type="button" className="min-w-[7rem]" onClick={handlePrev}>
          Atrás
        </Button>
        <Button type="submit" color="primary" className="min-w-[7rem]">
          Siguiente
        </Button>
      </div>
    </form>
  );
};

export default EstudioStep9;
