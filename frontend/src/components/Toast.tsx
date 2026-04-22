import { useToast } from "hooks/useToast";

export function ToastViewport() {
  const { toasts } = useToast();

  return (
    <div className="pointer-events-none fixed bottom-24 right-4 z-50 space-y-3 lg:bottom-6">
      {toasts.map((toast) => (
        <div key={toast.id} className="card pointer-events-auto min-w-[240px] px-4 py-3 text-sm text-nourish-ink">
          {toast.message}
        </div>
      ))}
    </div>
  );
}
