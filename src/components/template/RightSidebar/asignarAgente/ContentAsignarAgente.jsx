import PropTypes from "prop-types";
import { Table, TBody, Tr, Td, Button } from "components/ui";
import { truncateText } from "helpers/truncateText.helper";

export function ContentAsignarAgente({ data = [], close }) {
  return (
    <div className="min-w-full">

      <div className="hide-scrollbar max-h-[550px] overflow-y-auto">
        <Table className="w-full text-left rtl:text-right">
          <TBody>
            {data.map((item, index) => (
              <Tr
                key={index}
                className={`border-y border-transparent border-b-gray-200 dark:border-b-dark-500 ${index === 0 ? "border-t-gray-200 dark:border-t-dark-500" : ""
                  }`}
              >
                <Td>{truncateText(item?.item?.name || item.name, 50)}</Td>

                <Td className="text-center">
                  <Button
                    variant="outlined"
                    onClick={close}
                    color="neutral"
                    className="h-10 text-base font-light mx-auto rounded-2xl"
                  >
                    Asignar
                  </Button>
                </Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </div>


      <div className="mt-14 flex justify-end space-x-3">
        <Button
          onClick={close}
          color="neutral"
          className="h-10 text-base font-light"
        >
          Cerrar
        </Button>

        <Button color="primary" className="h-10 text-base font-light">
          Guardar
        </Button>
      </div>
    </div>
  );
}

ContentAsignarAgente.propTypes = {
  data: PropTypes.array,
  close: PropTypes.func,
};
