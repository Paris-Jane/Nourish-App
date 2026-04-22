import { useEffect } from "react";
import { useUIStore } from "store/uiStore";

export function useToast() {
  const toasts = useUIStore((state) => state.toasts);
  const pushToast = useUIStore((state) => state.pushToast);
  const dismissToast = useUIStore((state) => state.dismissToast);

  useEffect(() => {
    if (toasts.length === 0) return;

    const timeout = window.setTimeout(() => dismissToast(toasts[0].id), 3200);
    return () => window.clearTimeout(timeout);
  }, [dismissToast, toasts]);

  return { toasts, pushToast, dismissToast };
}
