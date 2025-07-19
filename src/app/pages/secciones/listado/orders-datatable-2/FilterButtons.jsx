// Import Dependencies
// import clsx from "clsx";

// Local Imports
import { Button } from "components/ui";
// import { createScopedKeydownHandler } from "utils/dom/createScopedKeydownHandler";

// ----------------------------------------------------------------------

const opciones = [
  {
    label: "Todos",
  },
  {
    label: "Activos",
  },
  {
    label: "Inactivos",
  }
]

export function FilterButtons() {
  return (
    <div
      data-tab
      className="w-max flex rounded-md bg-gray-200 px-1 py-1 text-xs-plus text-gray-800 dark:bg-dark-700 dark:text-dark-200"
    >
      {
        opciones.map((item, index) => {
          return (
            <Button
              data-tab-item
              key={index}
              unstyled
              className="shrink-0 whitespace-nowrap rounded-sm px-2.5 py-1 font-medium"
            >
              {item?.label}
            </Button>
          )
        })
      }
      {/* <Button
        data-tab-item
        className="shrink-0 whitespace-nowrap rounded-sm px-2.5 py-1 font-medium hover:text-gray-900 focus:text-gray-900 dark:hover:text-dark-100 dark:focus:text-dark-100"
        // onClick={() => column.setFilterValue("")}
        // className={clsx(
        //   "shrink-0 whitespace-nowrap rounded-sm px-2.5 py-1 font-medium hover:text-gray-900 focus:text-gray-900 dark:hover:text-dark-100 dark:focus:text-dark-100",
        //   selectedValue === ""
        //     ? "bg-white shadow-sm dark:bg-dark-500 dark:text-dark-100"
        //     : "hover:text-gray-900 focus:text-gray-900 dark:hover:text-dark-100 dark:focus:text-dark-100",
        // )}
        unstyled
        onKeyDown={createScopedKeydownHandler({
          siblingSelector: "[data-tab-item]",
          parentSelector: "[data-tab]",
          activateOnFocus: true,
          loop: false,
          orientation: "horizontal",
        })}
      >
        Todos
      </Button> */}
      {/* {options.map((option) => (
        <Button
          data-tab-item
          onClick={() => column.setFilterValue(option.value)}
          key={option.value}
          className={clsx(
            "shrink-0 whitespace-nowrap rounded-sm px-2.5 py-1 font-medium",
            selectedValue === option.value
              ? "bg-white shadow-sm dark:bg-dark-500 dark:text-dark-100"
              : "hover:text-gray-900 focus:text-gray-900 dark:hover:text-dark-100 dark:focus:text-dark-100",
          )}
          unstyled
          onKeyDown={createScopedKeydownHandler({
            siblingSelector: "[data-tab-item]",
            parentSelector: "[data-tab]",
            activateOnFocus: true,
            loop: false,
            orientation: "horizontal",
          })}
        >
          {option.label}
        </Button>
      ))} */}
    </div>
  );
}