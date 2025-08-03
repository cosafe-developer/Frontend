// Local Imports
import { Button } from "components/ui";
import { Switch } from "components/ui";
import { Select } from "components/ui";
import { PlusIcon } from "@heroicons/react/20/solid";
import { Table, THead, TBody, Th, Tr, Td } from "components/ui";

// ----------------------------------------------------------------------

const cols = ["#", "ELEMENTOS A EVALUAR", "EVIDENCIA", "NO / SI", "GRADO DE RIESGO"];

const data = [
  {
    uid: "1",
    name: "Ventanas de vidrio",
  },
  {
    uid: "2",
    name: "Ventilas",
  },
  {
    uid: "3",
    name: "Canceles de Vidrio",
  },
  {
    uid: "4",
    name: "Lámparas",
  },
  {
    uid: "5",
    name: "Entrepaños o repisas",
  },
  {
    uid: "6",
    name: "Objetos sobre entrepaños o repisas",
  },
  {
    uid: "7",
    name: "Cuadros",
  },
  {
    uid: "8",
    name: "Plantillas",
  },
  {
    uid: "9",
    name: "Espejos",
  },
  {
    uid: "10",
    name: "Liquidos tóxicos o inflamables",
  },
  {
    uid: "11",
    name: "Macetas y otros objetos colgantes",
  },
  {
    uid: "12",
    name: "Plafones",
  },
  {
    uid: "13",
    name: "Otros",
  },
];

export function Basic() {
  return (
    <div className="hide-scrollbar min-w-full overflow-x-auto">
      <Table className="w-full text-left rtl:text-right">
        <THead>
          <Tr className="border-y border-transparent border-b-gray-200 dark:border-b-dark-500">
            {cols.map((title, index) => (
              <Th
                key={index}
                className="font-semibold uppercase text-gray-800 dark:text-dark-100"
              >
                {title}
              </Th>
            ))}
          </Tr>
        </THead>
        <TBody>
          {data.map((tr) => (
            <Tr
              key={tr.uid}
              className="border-y border-transparent border-b-gray-200 dark:border-b-dark-500"
            >
              <Td>{tr.uid}</Td>
              <Td>{tr.name}</Td>
              <Td>
                <Button
                  color="primary"
                  className="h-8 space-x-1.5 rounded-md px-3 text-xs "
                >
                  <PlusIcon className="size-5" />
                  <span>Subir Evidencia</span>
                </Button>
              </Td>
              <Td>
                <Switch />
              </Td>
              <Td>
                <Select>
                  <option value="1">Bajo</option>
                  <option value="2">Medio</option>
                  <option value="3">Alto</option>
                </Select>
              </Td>
            </Tr>
          ))}
        </TBody>
      </Table>
    </div>
  );
}
