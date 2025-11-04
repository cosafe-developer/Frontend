// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";
import { RowActions } from "./RowActions";
import { AgentesCell, /* CreadorCell, */ EmpresaCell, EstudioCell, FechaDeInicioCell, OrderStatusCell, PrioridadCell, ProgressCell } from "../../listado/table/rows";
import { SelectCell, SelectHeader } from "components/shared/table/SelectCheckbox";

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row._id, {
    id: "listado_id",
    label: "Persona Id",
    header: "Persona Id",
    isHiddenColumn: true
  }),
  columnHelper.display({
    id: "select",
    label: "Row Selection",
    header: SelectHeader,
    cell: SelectCell,
  }),
  columnHelper.accessor((row) => row?.companyId?.tradeName, {
    id: "empresa",
    label: "Empresa",
    header: "Empresa",
    cell: EmpresaCell,
  }),
  columnHelper.accessor((row) => row.status, {
    id: "status",
    header: "Estatus",
    label: "Status",
    cell: OrderStatusCell,
  }),
  columnHelper.accessor((row) => row?.studyId?.studyName, {
    id: "estudio",
    label: "Estudio",
    header: "Estudio",
    cell: EstudioCell,
  }),
  columnHelper.accessor((row) => row.agents, {
    id: "agentes",
    label: "Agentes",
    header: "Agentes",
    cell: AgentesCell,
  }),
  columnHelper.accessor((row) => row.startDate, {
    id: "fecha_inicio",
    label: "Fecha de Inicio",
    header: "Fecha de Inicio",
    cell: FechaDeInicioCell,
    filterFn: "inNumberRange",
  }),
  /*  columnHelper.accessor((row) => row.creador, {
     id: "creador",
     label: "Creador",
     header: "Creador",
     cell: CreadorCell,
   }), */
  columnHelper.accessor((row) => row.priority, {
    id: "prioridad",
    label: "Prioridad",
    header: "Prioridad",
    cell: PrioridadCell,
  }),
  columnHelper.accessor((row) => row.progressPercentage, {
    id: "progress",
    header: "progress",
    label: 'Progress',
    cell: ProgressCell,
  }),
  columnHelper.display({
    id: "actions",
    label: "Acciones",
    header: "Acciones",
    cell: RowActions
  }),
]

