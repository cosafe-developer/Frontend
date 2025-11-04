// Import Dependencies
import PropTypes from "prop-types";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";

// Local Imports
import { ScrollShadow } from "components/ui";
import { useRightSidebarContext } from "app/contexts/sidebar-right/context";

// ----------------------------------------------------------------------

export function RightSidebar() {
  const { isOpen, closeSidebar, header, body, data } = useRightSidebarContext();

  return (
    <>
      <RightSidebarContent isOpen={isOpen} close={closeSidebar} SideBarHeader={header} SideBarBody={body} sideBarData={data} />
    </>
  );
}

function RightSidebarContent({ isOpen, close, SideBarHeader, SideBarBody, sideBarData }) {
  return (
    <Transition show={isOpen}>
      <Dialog open={true} onClose={close} static autoFocus>
        <TransitionChild
          as="div"
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          className="fixed inset-0 z-60 bg-gray-900/50 backdrop-blur-sm transition-opacity dark:bg-black/40"
        />

        <TransitionChild
          as={DialogPanel}
          enter="ease-out transform-gpu transition-transform duration-200"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="ease-in transform-gpu transition-transform duration-200"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
          className="fixed inset-y-0 right-0 z-61 flex w-screen transform-gpu flex-col bg-white transition-transform duration-200 dark:bg-[#1c1d21] sm:inset-y-2 sm:mx-2 sm:w-[38rem] sm:rounded-xl"
        >
          {SideBarHeader &&
            <SideBarHeader
              close={close}
              data={sideBarData}
            />
          }

          {SideBarBody && (
            <ScrollShadow
              size={4}
              className="hide-scrollbar overflow-y-auto overscroll-contain pb-5"
            >
              <div >
                <SideBarBody
                  close={close}
                  data={sideBarData}
                />
              </div>
            </ScrollShadow>
          )}
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}

RightSidebarContent.propTypes = {
  isOpen: PropTypes.bool,
  close: PropTypes.func,
};