// Import Dependencies
import dayjs from "dayjs";
import PropTypes from "prop-types";

// Local Imports
import { Highlight } from "components/shared/Highlight";
import { Circlebar } from "components/ui";
import { Avatar, Badge } from "components/ui";
import { useLocaleContext } from "app/contexts/locale/context";
import { ensureString } from "utils/ensureString";
import { statusOptions } from "./data";
import { getColorProgress } from "helpers/getColorProgress.helper";
import { useState } from "react";
import { toast } from "sonner";
import { StyledSwitch } from "components/shared/form/StyledSwitch";
import { normalizeDate } from "helpers/normalizeDate.helper";

// ----------------------------------------------------------------------

const getColor = ({ rol }) => {
  switch (rol) {
    case "Administrador":
      return "success";
    case "Agente":
      return "warning";
    case "Empresa":
      return "primary";
    default:
      return "neutral";
  }
}

const getColorPrioridad = ({ prioridad }) => {
  switch (prioridad) {
    case "alta":
      return "error";
    case "media":
      return "warning";
    case "baja":
      return "success";
    default:
      return "neutral";
  }
}


export function EmpresaCell({ row, getValue, column, table }) {
  const globalQuery = ensureString(table.getState().globalFilter);
  const columnQuery = ensureString(column.getFilterValue());

  const name = getValue();

  return (
    <div className="flex items-center space-x-3">
      <Avatar
        size={12}
        name={name}
        src={row?.original?.customer?.avatar_img}
        classNames={{
          display: "mask is-squircle rounded-none text-sm",
        }}
      />
      <span className="font-medium text-gray-800 dark:text-dark-100 text-[16px]">
        <Highlight query={[globalQuery, columnQuery]}>{name}</Highlight>
      </span>
    </div>
  );
}

export function EstudioCell({ getValue }) {
  return (
    <span className="font-medium text-primary-600 dark:text-primary-400 text-[16px]">
      {getValue()}
    </span>
  );
}

export function AgentesCell({ row }) {

  return (
    <div className="flex -space-x-2 ">
      {row?.original?.agents.map((item, i) => {
        const fullName = `${item.firstName} ${item.lastName}`

        return (
          <Avatar
            key={i}
            data-tooltip
            data-tooltip-content={fullName}
            size={10}
            name={fullName}
            src={item?.avatar || ""}
            initialColor="auto"
            classNames={{
              root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
              display: "text-xs ring-3 ring-white dark:ring-dark-700",
            }}
          />
        )
      })}
    </div>
  );
}

export function FechaDeInicioCell({ row }) {
  const { locale } = useLocaleContext();

  const startDateFormated = normalizeDate(row?.original?.startDate);
  const endDateFormated = normalizeDate(row?.original?.endDate)

  return (
    <div>
      <p className="text-[16px]">{dayjs(startDateFormated).locale(locale).format("DD MMM YYYY")}</p>
      <p className="mt-1 text-[15px]">
        <span className="font-semibold text-gray-700 dark:text-error-darker">
          Entrega:
        </span>{" "}
        {dayjs(endDateFormated).locale(locale).format("DD MMM YYYY")}
      </p>
    </div>
  );
}

export function CreadorCell({ row }) {
  const creador = row.original.creador;
  return (
    <div className="flex">
      <Badge
        className="rounded-full border border-white/10 capitalize"
        color={getColor({ rol: creador.rol })}
        variant="soft"
      >
        {creador.rol}
      </Badge>
    </div>
  );
}

export function PrioridadCell({ row }) {
  const prioridad = row.original.priority;
  return (
    <div className="flex">
      <Badge
        className="rounded-sm border border-white/10 capitalize text-[16px]"
        color={getColorPrioridad({ prioridad: prioridad })}
        variant="filled"
      >
        {prioridad}
      </Badge>
    </div>
  );
}

export function ProgressCell({ getValue }) {
  const val = getValue();

  return (
    <Circlebar
      size={13}
      strokeWidth={9}
      value={val}
      color={getColorProgress(val)}
    >
      <div className="text-tiny-plus font-semibold text-gray-800 dark:text-dark-100">
        {val}%
      </div>
    </Circlebar>
  );
}

// old


export function OrderIdCell({ getValue }) {
  return (
    <span className="font-medium text-primary-600 dark:text-primary-400">
      {getValue()}
    </span>
  );
}

export function DateCell({ getValue }) {
  const { locale } = useLocaleContext();
  const timestapms = getValue();
  const date = dayjs(timestapms).locale(locale).format("DD MMM YYYY");
  const time = dayjs(timestapms).locale(locale).format("hh:mm A");
  return (
    <>
      <p className="font-medium">{date}</p>
      <p className="mt-0.5 text-xs text-gray-400 dark:text-dark-300">{time}</p>
    </>
  );
}

export function CustomerCell({ row, getValue, column, table }) {
  const globalQuery = ensureString(table.getState().globalFilter);
  const columnQuery = ensureString(column.getFilterValue());

  const name = getValue();

  return (
    <div className="flex items-center space-x-4">
      <Avatar
        size={9}
        name={name}
        src={row.original.customer.avatar_img}
        classNames={{
          display: "mask is-squircle rounded-none text-sm",
        }}
      />
      <span className="font-medium text-gray-800 dark:text-dark-100">
        <Highlight query={[globalQuery, columnQuery]}>{name}</Highlight>
      </span>
    </div>
  );
}

export function TotalCell({ getValue }) {
  return (
    <p className="text-sm-plus font-medium text-gray-800 dark:text-dark-100">
      ${getValue().toFixed(1)}
    </p>
  );
}

export function ProfitCell({ getValue, row }) {
  return (
    <div className="flex items-center space-x-2 ">
      <p className="text-gray-800 dark:text-dark-100">
        ${getValue().toFixed(1)}
      </p>
      <Badge className="rounded-full" color="success" variant="soft">
        {((row.original.profit / row.original.total) * 100).toFixed(0)}%
      </Badge>
    </div>
  );
}



export function OrderStatusCell({ getValue }) {
  const val = getValue();
  const option = statusOptions.find((item) => item.value === val) || {};

  return (
    <Badge color={option.color || "neutral"} className="space-x-1.5 text-[15px]">
      <span>{option.label || "Desconocido"}</span>
    </Badge>
  );
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
    setTimeout(() => {
      table.options.meta?.updateData(index, id, checked);
      toast.success("User status updated");
      setLoading(false);
    }, 1000);
  };

  return (
    <StyledSwitch
      className="mx-auto"
      checked={val}
      onChange={onChange}
      loading={loading}
    />
  );
}

export function AddressCell({ getValue, column, table }) {
  const globalQuery = ensureString(table.getState().globalFilter);
  const columnQuery = ensureString(column.getFilterValue());
  const val = getValue();

  return (
    <p className="w-48 truncate text-xs-plus xl:w-56 2xl:w-64">
      <Highlight query={[globalQuery, columnQuery]}>{val}</Highlight>
    </p>
  );
}

OrderIdCell.propTypes = {
  getValue: PropTypes.func,
};

DateCell.propTypes = {
  getValue: PropTypes.func,
};

TotalCell.propTypes = {
  getValue: PropTypes.func,
};

ProfitCell.propTypes = {
  getValue: PropTypes.func,
  row: PropTypes.object,
};

OrderStatusCell.propTypes = {
  getValue: PropTypes.func,
};

AddressCell.propTypes = {
  getValue: PropTypes.func,
  column: PropTypes.object,
  table: PropTypes.object,
};

EmpresaCell.propTypes = {
  row: PropTypes.object,
  column: PropTypes.object,
  table: PropTypes.object,
  getValue: PropTypes.func,
};

CustomerCell.propTypes = {
  row: PropTypes.object,
  column: PropTypes.object,
  table: PropTypes.object,
  getValue: PropTypes.func,
};

StatusCell.propTypes = {
  getValue: PropTypes.func,
  row: PropTypes.object,
  column: PropTypes.object,
  table: PropTypes.object,
};
