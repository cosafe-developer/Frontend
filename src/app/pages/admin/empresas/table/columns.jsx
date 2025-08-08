// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";

// Local Imports
import { CopyableCell } from "components/shared/table/CopyableCell";


import { HighlightableCell } from "components/shared/table/HighlightableCell";
import { RowActions } from "./RowActions";
import { PasswordCell } from "components/shared/table/PasswordCell";

import { SelectCell, SelectHeader } from "components/shared/table/SelectCheckbox";
import { AgentesCell, EmpresaCell, EstudioCell, OrderStatusCell } from "./rows";

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.display({
    id: "select",
    label: "Row Selection",
    header: SelectHeader,
    cell: SelectCell,
  }),
  columnHelper.accessor((row) => row.empresa.name, {
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
  columnHelper.accessor((row) => row.estudio, {
    id: "estudio",
    label: "Estudio",
    header: "Estudio",
    cell: EstudioCell,
  }),
  columnHelper.accessor((row) => row.agentes, {
    id: "agentes",
    label: "Agentes",
    header: "Agentes",
    cell: AgentesCell,
  }),
  columnHelper.accessor((row) => row.age, {
    id: "age",
    header: "List Agisnados",
    label: "Age",
    cell: HighlightableCell,
  }),
  columnHelper.accessor((row) => row.phone, {
    id: "phone",
    header: "Telefono",
    label: "Phone",
    cell: (props) => <CopyableCell {...props} highlight />,
  }),
  columnHelper.accessor((row) => row.email, {
    id: "email",
    header: "Email",
    label: "Email",
    cell: (props) => <CopyableCell {...props} highlight />,
  }),
  columnHelper.accessor((row) => row.password, {
    id: "password",
    header: "Contraseña",
    label: "Password",
    cell: PasswordCell,
  }),
  columnHelper.display({
    id: "actions",
    label: "Acciones",
    header: "Acciones",
    cell: RowActions
  }),
]
