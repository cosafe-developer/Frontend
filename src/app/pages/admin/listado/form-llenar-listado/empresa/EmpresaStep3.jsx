import { Button } from "components/ui";
const EmpresaStep3 = ({
  setCurrentEmpresaStep
}) => {
  return (
    <div>
      <p>paso 3</p>
      <div className="mt-4 flex justify-end space-x-3 ">
        <Button className="min-w-[7rem]" onClick={() => setCurrentEmpresaStep(1)}>
          Atrás
        </Button>
        <Button className="min-w-[7rem]" color="primary">
          Guardar
        </Button>
      </div>
    </div>
  )
};

export default EmpresaStep3;