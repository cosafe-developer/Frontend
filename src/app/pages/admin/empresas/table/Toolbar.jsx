// Import Dependencies
import {
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { TbGridDots, TbList } from "react-icons/tb";
import clsx from "clsx";

import PropTypes from "prop-types";

// Local Imports
import { Button, Input } from "components/ui";
import { createScopedKeydownHandler } from "utils/dom/createScopedKeydownHandler";
import { useBreakpointsContext } from "app/contexts/breakpoint/context";
import { TableConfig } from "./TableConfig";
import { statusOptions } from "./data";
import { RoleFilter } from "./RoleFilter";

// ----------------------------------------------------------------------

export function Toolbar({ table }) {
  const { isXs } = useBreakpointsContext();
  const isFullScreenEnabled = table.getState().tableSettings.enableFullScreen;

  return (
    <div className="table-toolbar">
      <div
        className={clsx(
          "transition-content flex items-center justify-between space-x-4 ",
          isFullScreenEnabled ? "px-4 sm:px-5" : "px-(--margin-x) pt-4",
        )}
      >
      </div>

      {isXs ? (
        <>
          <div
            className={clsx(
              "flex space-x-2 pt-4  [&_.input-root]:flex-1",
              isFullScreenEnabled ? "px-4 sm:px-5" : "px-(--margin-x)",
            )}
          >
            <SearchInput table={table} />
            <TableConfig table={table} />
          </div>
          <div
            className={clsx(
              "hide-scrollbar flex shrink-0 space-x-2 overflow-x-auto pb-1 pt-4 ",
              isFullScreenEnabled ? "px-4 sm:px-5" : "px-(--margin-x)",
            )}
          >
            {table.getColumn("status") && (
              <RoleFilter
                column={table.getColumn("status")}
                options={statusOptions}
              />
            )}
          </div>
        </>
      ) : (
        <div
          className={clsx(
            "custom-scrollbar transition-content flex justify-between space-x-4 overflow-x-auto pb-1 pt-4 ",
            isFullScreenEnabled ? "px-4 sm:px-5" : "px-(--margin-x)",
          )}
          style={{
            "--margin-scroll": isFullScreenEnabled
              ? "1.25rem"
              : "var(--margin-x)",
          }}
        >
          {table.getColumn("status") && (
            <RoleFilter
              column={table.getColumn("status")}
              options={statusOptions}
            />
          )}

          <div className="flex shrink-0 space-x-2 ">
            <SearchInput table={table} />
            <TableConfig table={table} />
          </div>
        </div>
      )}
    </div>
  );
}

function SearchInput({ table }) {
  return (
    <Input
      value={table.getState().globalFilter}
      onChange={(e) => table.setGlobalFilter(e.target.value)}
      prefix={<MagnifyingGlassIcon className="size-4" />}
      classNames={{
        root: "shrink-0",
        input: "text-xs ring-primary-500/50 focus:ring-3",
      }}
      placeholder="Busca email, telefono, etc..."
    />
  );
}

function ViewTypeSelect({ table }) {
  const setViewType = table.options.meta.setViewType;
  const viewType = table.getState().viewType;

  return (
    <div
      data-tab
      className="flex rounded-md bg-gray-200 px-1 py-1 text-xs-plus text-gray-800 dark:bg-dark-700 dark:text-dark-200"
    >
      <Button
        data-tooltip
        data-tooltip-content="List View"
        data-tab-item
        className={clsx(
          "shrink-0 whitespace-nowrap rounded-sm px-1.5 py-1 font-medium",
          viewType === "list"
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
        onClick={() => setViewType("list")}
      >
        <TbList className="size-4.5" />
      </Button>

      <Button
        data-tooltip
        data-tooltip-content="Grid View"
        data-tab-item
        className={clsx(
          "shrink-0 whitespace-nowrap rounded-sm px-1.5 py-1 font-medium",
          viewType === "grid"
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
        onClick={() => setViewType("grid")}
      >
        <TbGridDots className="size-4.5" />
      </Button>
    </div>
  );
}

Toolbar.propTypes = {
  table: PropTypes.object,
};

SearchInput.propTypes = {
  table: PropTypes.object,
};

ViewTypeSelect.propTypes = {
  table: PropTypes.object,
};
