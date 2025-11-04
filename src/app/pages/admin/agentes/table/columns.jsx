// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";
import { ListAsignados, NameCell, StatusCell } from "./rows";
import { RowActions } from "./RowActions";


// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor((row) => row.status, {
    id: "status",
    header: "Estatus",
    label: "Status",
    cell: StatusCell,
  }),
  columnHelper.accessor((row) => row.name, {
    id: "name",
    header: "Nombre",
    label: "Name",
    cell: NameCell,
  }),
  columnHelper.accessor(
    (row) => row.positionLabel,
    {
      id: "role",
      header: "Cargo",
      label: "Rol",
      cell: (info) => (
        <p className="text-[15px] ">
          {info.getValue()}
        </p>
      ),
    }
  ),
  columnHelper.accessor((row) => row?.studies?.length, {
    id: "age",
    header: "List Agisnados",
    label: "Age",
    cell: ListAsignados,
  }),
  columnHelper.accessor((row) => row.phone, {
    id: "phone",
    header: "Telefono",
    label: "Phone",
    /*   cell: (props) => <CopyableCell {...props} highlight />, */
  }),
  columnHelper.accessor((row) => row.email, {
    id: "email",
    header: "Email",
    label: "Email",
    /*  cell: (props) => <CopyableCell {...props} highlight />, */
  }),
  /*  columnHelper.accessor((row) => row.password, {
     id: "password",
     header: "Contraseña",
     label: "Password",
     cell: PasswordCell,
   }), */
  columnHelper.display({
    id: "actions",
    header: "Acciones",
    label: "Row Actions",
    cell: RowActions,
  }),
];
