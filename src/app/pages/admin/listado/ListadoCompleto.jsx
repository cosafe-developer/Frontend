import { Page } from "components/shared/Page";
import { Avatar, Button, Card } from "components/ui";
import { FiCheck } from "react-icons/fi";

const ListadoCompleto = () => {


  return (
    <Page title="Listado de Requerimientos">
      <div className="transition-content w-full px-(--margin-x) pt-5 lg:pt-6">
        <h2 className="text-white text-2xl">Listado Completo</h2>

        <div className="mt-8 flex gap-8">

          <div className="w-full">
            <Card className="flex flex-col p-5 pt-10 ">
              <div className="px-3 text-lg font-semibold">
                <div className="flex items-center space-x-10">
                  <Avatar
                    size={30}
                    classNames={{
                      display: "mask is-squircle rounded-none text-4xl",
                    }}
                  >
                    OX
                  </Avatar>

                  <div className="flex flex-col space-y-1">
                    <p className="font-normal text-xl text-white">Oxxo</p>
                    <p className="font-light text-primary-400">PIPC</p>
                    <p className="font-light text-green-400">• Completado 08.03.25</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3 px-3 pt-4">
                <Button
                  onClick={close}
                  color="success"
                  className="h-10 text-base font-light"
                >
                  Aprobar
                </Button>

                <Button
                  color="primary"
                  className="h-10 text-base font-light"
                  disabled
                >
                  Descargar Plantilla
                </Button>
              </div>
            </Card>
          </div>


          <div className="w-[35%]">
            <ol className="steps is-vertical" style={{ borderColor: '#2a2c32' }}>
              {[
                'Riesgos por daños no estructurales',
                'Riesgos por daños estructurales',
                'Información de Riesgo',
                'Agente Perturbador Socio-Organizativo',
                'Agente Perturbador Geológico',
                'Agente Perturbador Físico-Químico',
                'Agente Perturbador Sanitario',
                'Riesgos Circundantes',
                'Medidas y Equipos de Seguridad',
                'Medidas y Equipos de Seguridad',
                'Completado',
              ].map((step, index) => (
                <li
                  className="step pb-6 before:bg-gray-200 dark:before:bg-surface-2"
                  key={index}
                >
                  <div
                    style={{
                      border: '2px solid #3cb030',
                    }}
                    className="step-header rounded-full bg-gray-200 text-gray-800 dark:bg-surface-2 dark:text-white"
                  >
                    {index === 10 ? <FiCheck /> : index + 1}
                  </div>
                  <h3 className="text-gray-600 ltr:ml-4 rtl:mr-4 dark:text-dark-100">
                    {step}
                  </h3>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </Page>
  );
}

export default ListadoCompleto;