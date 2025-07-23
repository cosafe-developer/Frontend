import { useState, useCallback } from "react";
import { createSafeContext } from "utils/createSafeContext";

// Creamos el contexto seguro
export const [RightSidebarProviderBase, useRightSidebarContext] = createSafeContext(
  "useRightSidebarContext must be used within RightSidebarProvider"
);

// Creamos un componente Provider con lógica y estado
export const RightSidebarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openSidebar = useCallback(() => setIsOpen(true), []);
  const closeSidebar = useCallback(() => setIsOpen(false), []);

  // Pasamos el estado y funciones al Provider base
  return (
    <RightSidebarProviderBase
      value={{
        isOpen,
        openSidebar,
        closeSidebar,
      }}
    >
      {children}
    </RightSidebarProviderBase>
  );
};

