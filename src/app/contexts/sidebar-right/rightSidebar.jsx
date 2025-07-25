import { useState, useCallback } from "react";
import { RightSidebarProviderBase } from "./context";

export const RightSidebarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [header, setHeader] = useState(null);
  const [body, setBody] = useState(null);
  const [data, setData] = useState(null);

  const openSidebar = useCallback(({ header = null, body = null, data = null }) => {
    setHeader(() => header);
    setBody(() => body);
    setData(data);
    setIsOpen(true);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsOpen(false);
    setHeader(null);
    setBody(null);
    setData(null);
  }, []);

  return (
    <RightSidebarProviderBase
      value={{
        isOpen,
        openSidebar,
        closeSidebar,
        header,
        body,
        data,
      }}
    >
      {children}
    </RightSidebarProviderBase>
  );
};