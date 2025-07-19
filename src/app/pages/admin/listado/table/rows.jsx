// Import Dependencies
import dayjs from "dayjs";
import PropTypes from "prop-types";

// Local Imports
import { Highlight } from "components/shared/Highlight";
import { Circlebar } from "components/ui";
import { Avatar, Badge } from "components/ui";
import { useLocaleContext } from "app/contexts/locale/context";
import { ensureString } from "utils/ensureString";
import { orderStatusOptions } from "./data";

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
    case "Urgente":
      return "error";
    case "Media":
      return "warning";
    case "Baja":
      return "success";
    default:
      return "neutral";
  }
}

function getColorProgress(val) {
  if (val === 0) return "neutral";
  if (val === 100) return "success";
  if (val < 10) return "warning";
  if (val < 50) return "info";
  return "primary";
}

export function EmpresaCell({ row, getValue, column, table }) {
  const globalQuery = ensureString(table.getState().globalFilter);
  const columnQuery = ensureString(column.getFilterValue());

  const name = getValue();

  return (
    <div className="flex items-center space-x-2">
      <Avatar
        size={9}
        name={name}
        src={row?.original?.customer?.avatar_img}
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

export function EstudioCell({ getValue }) {
  return (
    <span className="font-medium text-primary-600 dark:text-primary-400">
      {getValue()}
    </span>
  );
}

export function AgentesCell({ row }) {
  return (
    <div className="flex -space-x-2 ">
      {row.original.agentes.map((item, i) => (
        <Avatar
          key={i}
          data-tooltip
          data-tooltip-content={item.name}
          size={8}
          name={item.name}
          src={item.avatar || ""}
          initialColor="auto"
          classNames={{
            root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
            display: "text-xs ring-3 ring-white dark:ring-dark-700",
          }}
        />
      ))}
    </div>
  );
}

export function FechaDeInicioCell({ row }) {
  const { locale } = useLocaleContext();

  return (
    <div>
      <p>{dayjs(row.original.fecha_inicio).locale(locale).format("DD MMM YYYY")}</p>
      <p className="mt-1 text-xs">
        <span className="font-semibold text-gray-700 dark:text-error-darker">
          Entrega:
        </span>{" "}
        {dayjs(row.original.fecha_entrega).locale(locale).format("DD MMM YYYY")}
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
  const prioridad = row.original.prioridad;
  return (
    <div className="flex">
      <Badge
        className="rounded-sm border border-white/10 capitalize"
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
  const option = orderStatusOptions.find((item) => item.value === val);

  return (
    <Badge color={option.color} className="space-x-1.5 ">
      {option.icon && <option.icon className="h-4 w-4" />}

      <span>{option.label}</span>
    </Badge>
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
