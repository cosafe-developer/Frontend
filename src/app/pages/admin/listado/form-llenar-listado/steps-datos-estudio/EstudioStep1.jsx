// EstudioStep1.jsx
import { useForm, Controller } from "react-hook-form";
import { Button, Select, Switch, Table, THead, TBody, Th, Tr, Td } from "components/ui";
import { PlusIcon } from "@heroicons/react/20/solid";
import { useLlenarListadoFormContext } from "../LlenarListadoFormContext";

const cols = ["#", "ELEMENTOS A EVALUAR", "EVIDENCIA", "NO / SI", "GRADO DE RIESGO"];

const data = [
  { uid: "1", name: "Ventanas de vidrio" },
  { uid: "2", name: "Ventilas" },
  { uid: "3", name: "Canceles de Vidrio" },
  { uid: "4", name: "Lámparas" },
  { uid: "5", name: "Entrepaños o repisas" },
  { uid: "6", name: "Objetos sobre entrepaños o repisas" },
  { uid: "7", name: "Cuadros" },
  { uid: "8", name: "Plantillas" },
  { uid: "9", name: "Espejos" },
  { uid: "10", name: "Líquidos tóxicos o inflamables" },
  { uid: "11", name: "Macetas y otros objetos colgantes" },
  { uid: "12", name: "Plafones" },
  { uid: "13", name: "Otros" },
];

const EstudioStep1 = ({ onNext }) => {
  const llenarListadoFormCtx = useLlenarListadoFormContext();

  const { control, handleSubmit } = useForm({
    defaultValues:
      llenarListadoFormCtx.state.formData.estudio_evaluacion ||
      Object.fromEntries(data.map((item) => [item.uid, { evidencia: null, switch: false, riesgo: "1" }])),
  });

  const onSubmit = (formValues) => {
    llenarListadoFormCtx.dispatch({
      type: "SET_FORM_DATA",
      payload: { estudio_evaluacion: formValues },
    });

    llenarListadoFormCtx.dispatch({
      type: "SET_STEP_STATUS",
      payload: { estudio_evaluacion: { isDone: true } },
    });

    onNext(); // avanza al siguiente paso dentro de Estudio
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex grow flex-col space-y-4">
      <div className="hide-scrollbar min-w-full overflow-x-auto">
        <Table className="w-full text-left rtl:text-right">
          <THead>
            <Tr className="border-y border-transparent border-b-gray-200 dark:border-b-dark-500">
              {cols.map((title, index) => (
                <Th key={index} className="font-semibold uppercase text-gray-800 dark:text-dark-100">
                  {title}
                </Th>
              ))}
            </Tr>
          </THead>
          <TBody>
            {data.map((tr) => (
              <Tr key={tr.uid} className="border-b border-gray-200 dark:border-b-dark-500">
                <Td>{tr.uid}</Td>
                <Td>{tr.name}</Td>
                <Td>
                  <Button
                    color="primary"
                    className="h-8 space-x-1.5 rounded-md px-3 text-xs"
                  >
                    <PlusIcon className="size-5" />
                    <span>Subir Evidencia</span>
                  </Button>
                </Td>
                <Td>
                  <Controller
                    name={`${tr.uid}.switch`}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Switch checked={value} onChange={onChange} />
                    )}
                  />
                </Td>
                <Td>
                  <Controller
                    name={`${tr.uid}.riesgo`}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Select value={value} onChange={onChange}>
                        <option value="1">Bajo</option>
                        <option value="2">Medio</option>
                        <option value="3">Alto</option>
                      </Select>
                    )}
                  />
                </Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </div>

      <div className="mt-6 flex justify-end space-x-3 pb-4">
        <Button type="submit" color="primary" className="min-w-[7rem]">
          Siguiente
        </Button>
      </div>
    </form>
  );
};

export default EstudioStep1;
