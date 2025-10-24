// toastContext.ts (o .js si no usas TypeScript)
import { createSafeContext } from "utils/createSafeContext";

export const [ToastContextProviderBase, useToastContext] = createSafeContext(
  "useToastContext must be used within ToastProvider"
);
