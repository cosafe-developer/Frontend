// Import Dependencies
import PropTypes from "prop-types";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useForm, Controller } from "react-hook-form";

// Local Imports
import { Button, Input, Textarea } from "components/ui";
import { Listbox } from "components/shared/form/Listbox";

// ----------------------------------------------------------------------

const agents = [
  { id: "1", label: "Agente 1" },
  { id: "2", label: "Agente 2" },
  { id: "3", label: "Agente 3" },
];

export function ContentNotificarAlerta({ close }) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      agent: "",
      message: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Data:", data);
    close();
  };

  return (
    <div>
      <div className="flex items-center justify-between bg-[#15161a] px-4 py-3">
        <h2 className="font-normal text-xl px-4 text-white">Nueva Alerta</h2>
        <Button onClick={close} variant="flat" isIcon className="size-10 rounded-full">
          <XMarkIcon className="size-8" />
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-6 text-[16px] mt-5">
        <Input
          label="Título"
          placeholder="Escribe un título"
          {...register("title", { required: "El título es requerido" })}
          error={errors?.title?.message}
        />

        <Controller
          name="agent"
          control={control}
          rules={{ required: "Selecciona un agente" }}
          render={({ field }) => (
            <Listbox
              label="Agente"
              placeholder="Selecciona un agente"
              data={agents}
              displayField="label"
              value={agents.find((a) => a.id === field.value) || null}
              onChange={(val) => field.onChange(val?.id)}
              error={errors?.agent?.message}
            />
          )}
        />

        <Textarea
          label="Mensaje"
          placeholder="Escribir mensaje..."
          rows={5}
          {...register("message", { required: "El mensaje es requerido" })}
          error={errors?.message?.message}
        />

        <div className="flex justify-end space-x-5">
          <Button
            onClick={close}
            color="neutral"
            className="h-10 text-base font-light"
          >
            Cerrar
          </Button>

          <Button className="h-10 text-base font-light" type="submit" color="primary">
            Enviar
          </Button>
        </div>
      </form>
    </div>
  );
}

ContentNotificarAlerta.propTypes = {
  close: PropTypes.func,
};
