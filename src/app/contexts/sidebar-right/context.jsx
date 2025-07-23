import { createSafeContext } from "utils/createSafeContext";


export const [RightSidebarProviderBase, useRightSidebarContext] = createSafeContext(
  "useRightSidebarContext must be used within RightSidebarProvider"
);
