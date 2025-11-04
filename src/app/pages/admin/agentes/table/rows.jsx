// Import Dependencies
import { useState } from "react";
import { toast } from "sonner";
import { CheckIcon } from "@heroicons/react/20/solid";
import PropTypes from "prop-types";

// Local Imports
import { Avatar,/*  Badge, */ Swap, SwapOff, SwapOn } from "components/ui";
import { StyledSwitch } from "components/shared/form/StyledSwitch";

import { Highlight } from "components/shared/Highlight";
import { ensureString } from "utils/ensureString";
import updateAgente from "api/agente/updateAgente";

// ----------------------------------------------------------------------

export function NameCell({ row, column, table }) {
  const globalQuery = ensureString(table.getState().globalFilter);
  const columnQuery = ensureString(column.getFilterValue());

  return (
    <div className="flex items-center space-x-3 ltr:-ml-1 rtl:-mr-1 ">
      <Swap
        effect="flip"
        disabled={!row.getCanSelect()}
        onChange={(val) => row.toggleSelected(val === "on")}
        value={row.getIsSelected() ? "on" : "off"}
      >
        <SwapOn className="flex size-10 items-center justify-center p-1">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-primary-500">
            <CheckIcon className="size-5 text-white" />
          </div>
        </SwapOn>
        <SwapOff>
          <Avatar
            size={11}
            classNames={{
              root: "rounded-full border-2 border-dashed border-transparent p-0.5 transition-colors group-hover/tr:border-gray-400 dark:group-hover/tr:border-dark-300",
              display: "text-xs-plus",
            }}
            /*  src={row?.original?.logoUrl ?? ""} */
            name={row?.original?.firstName + row?.original?.lastName || ""}
          />
        </SwapOff>
      </Swap>

      <div className="font-medium text-gray-800 dark:text-dark-100 text-[15px]">
        <Highlight query={[globalQuery, columnQuery]}>{row?.original?.firstName + " " + row?.original?.lastName || ""}</Highlight>
      </div>
    </div>
  );
}

export function ListAsignados({ row }) {
  const estudios = row?.original?.studies;
  return (
    <p className="text-[15px]">{estudios?.length}</p>
  )

}


export function StatusCell({
  getValue,
  row: { index },
  column: { id },
  table,
}) {
  const val = getValue();
  const [loading, setLoading] = useState(false);

  const onChange = async (checked) => {
    setLoading(true);
    try {
      ;
      // 👇 El row.original tiene toda la data del usuario
      const { _id } = table.getRowModel().rows[index].original;

      // Llamar API
      const response = await updateAgente({
        requestBody: {
          agente_id: _id,
          status: checked === true ? "active" : "inactive",
        },
      });

      if (response?.ok) {
        table?.options.meta?.updateData(index, id, checked);
        toast.success("Estatus de usuario actualizado");
      } else {
        toast.error("Error al actualizar estatus");
      }
    } catch (error) {
      console.error("Error actualizando usuario:", error);
      toast.error("Error en la comunicación con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledSwitch
      className="mx-auto"
      checked={val === "active" ? true : false}
      onChange={onChange}
      loading={loading}
    />
  );
}


NameCell.propTypes = {
  getValue: PropTypes.func,
  row: PropTypes.object,
  column: PropTypes.object,
  table: PropTypes.object,
};

/* RoleCell.propTypes = {
  getValue: PropTypes.func,
}; */

StatusCell.propTypes = {
  getValue: PropTypes.func,
  row: PropTypes.object,
  column: PropTypes.object,
  table: PropTypes.object,
};
