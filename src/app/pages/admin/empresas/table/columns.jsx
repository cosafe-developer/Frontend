// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";


import { RowActions } from "./RowActions";

import { EmailCell, EmpresaCell, ListAsignados } from "./rows";

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.tradeName, {
    id: "empresa",
    label: "Empresa",
    header: "Empresa",
    cell: EmpresaCell,
  }),
  /*   columnHelper.accessor((row) => row.estudio, {
      id: "estudio",
      label: "Estudio",
      header: "Estudio",
      cell: EstudioCell,
    }), */
  /*   columnHelper.accessor((row) => row.agentes, {
      id: "agentes",
      label: "Agentes",
      header: "Agentes",
      cell: AgentesCell,
    }), */
  columnHelper.accessor((row) => row.age, {
    id: "age",
    header: "List Agisnados",
    label: "Age",
    cell: ListAsignados,
  }),
  columnHelper.accessor((row) => row.phone, {
    id: "phone",
    header: "Telefono",
    label: "Phone",
    /*  cell: (props) => <CopyableCell {...props} highlight />, */
  }),
  columnHelper.accessor((row) => row.email, {
    id: "email",
    header: "Email",
    label: "Email",
    cell: EmailCell,
  }),
  /*   columnHelper.accessor((row) => row.password, {
      id: "password",
      header: "Contraseña",
      label: "Password",
      cell: PasswordCell,
    }), */
  columnHelper.display({
    id: "actions",
    label: "Acciones",
    header: "Acciones",
    cell: RowActions
  }),
]
