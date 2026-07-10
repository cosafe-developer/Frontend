import { useState } from "react";
import PropTypes from "prop-types";
import { Input, Table, THead, TBody, Th, Tr, Td } from "components/ui";
import { useLlenarListadoFormContext } from "../contexts/LlenarListadoFormContext";
import {
  resourceInventoryElements,
  conditionOptions,
} from "../steps-datos-estudio/estudio-pipc/utils/elementsTask";
import updateListado from "api/listados/updateListado";

const buildDefaultInventory = () =>
  resourceInventoryElements.map((el, i) => ({
    _uid: i,
    element: el,
    location: "",
    condition: "",
  }));

const ResourceInventorySection = ({ listado }) => {
  const llenarListadoFormCtx = useLlenarListadoFormContext();
  const inventoryCtx = llenarListadoFormCtx?.state?.formData?.resourceInventory ?? {};
  const backendInventory = listado?.studyData?.resourceInventory?.items || [];

  const [inventoryItems, setInventoryItems] = useState(() => {
    if (Array.isArray(inventoryCtx?.items) && inventoryCtx.items.length > 0) {
      return inventoryCtx.items.map((it, i) => ({
        _uid: i,
        element: it.element ?? resourceInventoryElements[i] ?? "",
        location: it.location ?? "",
        condition: it.condition ?? "",
      }));
    }
    if (backendInventory.length > 0) {
      return backendInventory.map((it, i) => ({
        _uid: i,
        element: it.element ?? resourceInventoryElements[i] ?? "",
        location: it.location ?? "",
        condition: it.condition ?? "",
      }));
    }
    return buildDefaultInventory();
  });

  const persist = async (items) => {
    const payloadItems = items.map((it) => ({
      element: it.element,
      location: it.location || "",
      condition: it.condition || "",
    }));

    llenarListadoFormCtx.dispatch({
      type: "SET_FORM_DATA",
      payload: {
        resourceInventory: {
          items: payloadItems,
          isDone: true,
        },
      },
    });

    try {
      await updateListado({
        requestBody: {
          listado_id: listado?._id,
          studyData: { resourceInventory: { items: payloadItems, isDone: true } },
        },
      });
    } catch (err) {
      console.error("Error al guardar inventario:", err);
    }
  };

  const handleChange = (rowIndex, changedFields) => {
    const updated = [...inventoryItems];
    updated[rowIndex] = { ...updated[rowIndex], ...changedFields };
    setInventoryItems(updated);
    persist(updated);
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-400">
        Indica para cada elemento su ubicación y estado de condición.
      </p>
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
                    onChange={(e) => handleChange(idx, { location: e.target.value })}
                  />
                </Td>
                <Td>
                  <select
                    value={item.condition}
                    onChange={(e) => handleChange(idx, { condition: e.target.value })}
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
  );
};

ResourceInventorySection.propTypes = {
  listado: PropTypes.object,
};

export default ResourceInventorySection;
