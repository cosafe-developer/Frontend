// Import Dependencies
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import {
  EllipsisHorizontalIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ShareIcon
} from "@heroicons/react/24/outline";
// import clsx from "clsx";
// import { Fragment, useCallback, useState } from "react";
import PropTypes from "prop-types";

// Local Imports
// import { ConfirmModal } from "components/shared/ConfirmModal";
import { Button } from "components/ui";

// ----------------------------------------------------------------------

// const confirmMessages = {
//   pending: {
//     description:
//       "Are you sure you want to delete this order? Once deleted, it cannot be restored.",
//   },
//   success: {
//     title: "Order Deleted",
//   },
// };

export function RowActions() {
  // const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  // const [deleteSuccess, setDeleteSuccess] = useState(false);
  // const [deleteError, setDeleteError] = useState(false);

  // const closeModal = () => {
  //   setDeleteModalOpen(false);
  // };

  // const openModal = () => {
  //   setDeleteModalOpen(true);
  //   setDeleteError(false);
  //   setDeleteSuccess(false);
  // };

  // const handleDeleteRows = useCallback(() => {
  //   setConfirmDeleteLoading(true);
  //   setTimeout(() => {
  //     table.options.meta?.deleteRow(row);
  //     setDeleteSuccess(true);
  //     setConfirmDeleteLoading(false);
  //   }, 1000);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [row]);

  // const state = deleteError ? "error" : deleteSuccess ? "success" : "pending";

  return (
    <>
      <div className="flex justify-center gap-1.5">
        <Menu as="div" className="relative inline-block text-left">
          <MenuButton as={Button} isIcon className="size-8 rounded-full">
            <EllipsisHorizontalIcon className="size-4.5" />
          </MenuButton>
          <MenuItems className="absolute z-100 mt-1.5 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-hidden focus-visible:outline-hidden dark:border-dark-500 dark:bg-dark-750 dark:shadow-none ltr:right-0 rtl:left-0">
            <MenuItem>
              <button
                className="flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-hidden transition-colors cursor-pointer hover:opacity-45"
              >
                <EyeIcon className="size-4.5 stroke-1" />
                <span>Ver</span>
              </button>

            </MenuItem>
            <MenuItem>
              <button
                className="flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-hidden transition-colors cursor-pointer hover:opacity-45"
              >
                <PencilIcon className="size-4.5 stroke-1" />
                <span>Editar</span>
              </button>
            </MenuItem>
            <MenuItem>
              <button
                className="this:error flex h-9 w-full items-center space-x-3 px-3 tracking-wide text-this outline-hidden transition-colors dark:text-this-light cursor-pointer hover:opacity-45"
              >
                <TrashIcon className="size-4.5 stroke-1" />
                <span>Elimnar</span>
              </button>
            </MenuItem>
            <MenuItem>
              <button
                className="flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-hidden transition-colors cursor-pointer hover:opacity-45"
              >
                <ShareIcon className="size-4.5 stroke-1" />
                <span>Compartir</span>
              </button>
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>
    </>
  );
}

RowActions.propTypes = {
  row: PropTypes.object,
  table: PropTypes.object,
};