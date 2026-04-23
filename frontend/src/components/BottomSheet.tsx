import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "lib/utils";

interface BottomSheetProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function BottomSheet({ open, title, onClose, children }: BottomSheetProps) {
  return (
    <div className={cn("fixed inset-0 z-40 transition", open ? "pointer-events-auto" : "pointer-events-none")}>
      <div className={cn("absolute inset-0 bg-[#2c2416]/30 transition", open ? "opacity-100" : "opacity-0")} onClick={onClose} />
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 flex max-h-[88dvh] flex-col rounded-t-[28px] border border-nourish-border bg-nourish-card shadow-card transition lg:left-auto lg:right-6 lg:top-24 lg:max-h-[min(90vh,920px)] lg:w-[420px] lg:rounded-3xl",
          open
            ? "translate-y-0 opacity-100 lg:translate-x-0"
            : "translate-y-full opacity-0 lg:translate-x-full lg:translate-y-0",
        )}
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-nourish-border/70 px-5 pb-4 pt-5 lg:rounded-t-3xl lg:border-b-0 lg:bg-nourish-card lg:pb-4">
          <h3 className="text-xl font-semibold leading-tight text-nourish-ink sm:text-2xl">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full p-2.5 text-nourish-muted transition hover:bg-nourish-bg hover:text-nourish-ink"
            aria-label="Close"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6 pt-2 lg:pt-0">{children}</div>
      </div>
    </div>
  );
}
