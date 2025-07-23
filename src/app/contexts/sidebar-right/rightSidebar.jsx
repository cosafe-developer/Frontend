// provider.jsx
import { useState, useCallback } from "react";
import { RightSidebarProviderBase } from "./context";

export const RightSidebarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openSidebar = useCallback(() => setIsOpen(true), []);
  const closeSidebar = useCallback(() => setIsOpen(false), []);

  return (
    <RightSidebarProviderBase value={{ isOpen, openSidebar, closeSidebar }}>
      {children}
    </RightSidebarProviderBase>
  );
};

