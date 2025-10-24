// Import Dependencies
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import {
  EllipsisHorizontalIcon,
  /*   EyeIcon, */
  PencilIcon,
  TrashIcon,
  /*  ClipboardIcon */
} from "@heroicons/react/24/outline";
/* import { FiBell } from "react-icons/fi";   */
import clsx from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

// Local Imports
import { ConfirmModal } from "components/shared/ConfirmModal";
import { Button } from "components/ui";
/* import { useRightSidebarContext } from "app/contexts/sidebar-right/context";
import { HeaderAdministrarAgente } from "components/template/RightSidebar/administrarAgente/HeaderAdministrarAgente";
import { ContentAdministrarAgente } from "components/template/RightSidebar/administrarAgente/ContentAdministrarAgente"; */
import { useNavigate } from "react-router";

// ----------------------------------------------------------------------

const confirmMessages = {
  pending: {
    description:
      "Estas seguro que deseas borrar este usuario? Una vez borrado no se podra recuperar",
  },
  success: {
    title: "Usuario Borrado",
  },
};

export function RowActions({ row, table }) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const [menuPosition, setMenuPosition] = useState("bottom");
  /*   const { openSidebar } = useRightSidebarContext(); */
  const navigate = useNavigate();
  const menuRef = useRef();

  const closeModal = () => {
    setDeleteModalOpen(false);
  };

  useEffect(() => {
    if (row.index === 0) {
      setMenuPosition("left");
    } else {
      const rect = menuRef.current?.getBoundingClientRect();
      if (rect) {
        const spaceBelow = window.innerHeight - rect.bottom;
        setMenuPosition(spaceBelow < 600 ? "above" : "bottom");
      }
    }
  }, [row.index]);

  const openModal = () => {
    setDeleteModalOpen(true);
    setDeleteError(false);
    setDeleteSuccess(false);
  };

  const handleDeleteRows = useCallback(() => {
    setConfirmDeleteLoading(true);
    setTimeout(() => {
      table.options.meta?.deleteRow(row);
      setDeleteSuccess(true);
      setConfirmDeleteLoading(false);
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row]);

  const state = deleteError ? "error" : deleteSuccess ? "success" : "pending";

  return (
    <>
      <div className="flex justify-center">
        {/*  <Button variant="flat" isIcon className="size-7 rounded-full">
          <FiBell className="size-4.5" />
        </Button>
        <Button variant="flat" isIcon className="size-7 rounded-full">
          <ClipboardIcon className="size-4.5" />
        </Button> */}
        <Menu ref={menuRef} as="div" className="relative inline-block text-left">
          <MenuButton
            as={Button}
            variant="flat"
            isIcon
            className="size-7 rounded-full"
          >
            <EllipsisHorizontalIcon className="size-4.5" />
          </MenuButton>
          <Transition
            as={MenuItems}
            enter="transition ease-out"
            enterFrom="opacity-0 translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-2"
            className={clsx(
              "absolute z-50 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg outline-hidden focus-visible:outline-hidden dark:border-dark-500 dark:bg-dark-750",
              menuPosition === "left" && "top-0 right-full mr-1",
              menuPosition === "above" && "bottom-full mb-1 right-full",
              menuPosition === "bottom" && "top-full mt-1 right-full"
            )}
          >
            {/*  <MenuItem>
              {({ focus }) => (
                <button
                  onClick={() => {
                    openSidebar({
                      header: HeaderAdministrarAgente,
                      body: ContentAdministrarAgente
                    })
                  }}
                  className={clsx(
                    "flex h-9 w-full items-center  hover:cursor-pointer space-x-3 px-3 tracking-wide outline-hidden transition-colors ",
                    focus &&
                    "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                  )}
                >
                  <EyeIcon className="size-4.5 stroke-1" />
                  <span>View</span>
                </button>
              )}
            </MenuItem> */}
            <MenuItem>
              {({ focus }) => (
                <button
                  onClick={() => navigate(`/admin/agentes/editar/${row?.original?._id}`)}
                  className={clsx(
                    "flex h-9 w-full hover:cursor-pointer items-center space-x-3 px-3 tracking-wide outline-hidden transition-colors ",
                    focus &&
                    "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                  )}
                >
                  <PencilIcon className="size-4.5 stroke-1" />
                  <span>Editar</span>
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ focus }) => (
                <button
                  onClick={openModal}
                  className={clsx(
                    "this:error flex h-9  hover:cursor-pointer w-full items-center space-x-3 px-3 tracking-wide text-this outline-hidden transition-colors dark:text-this-light ",
                    focus && "bg-this/10 dark:bg-this-light/10",
                  )}
                >
                  <TrashIcon className="size-4.5 stroke-1" />
                  <span>Borrar</span>
                </button>
              )}
            </MenuItem>
          </Transition>
        </Menu>
      </div>

      <ConfirmModal
        show={deleteModalOpen}
        onClose={closeModal}
        messages={confirmMessages}
        onOk={handleDeleteRows}
        confirmLoading={confirmDeleteLoading}
        state={state}
      />
    </>
  );
}

RowActions.propTypes = {
  row: PropTypes.object,
  table: PropTypes.object,
};
