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
          "absolute bottom-0 left-0 right-0 rounded-t-[28px] border border-nourish-border bg-nourish-card p-5 shadow-card transition lg:left-auto lg:right-6 lg:top-24 lg:h-fit lg:w-[420px] lg:rounded-3xl",
          open ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 lg:translate-y-4",
        )}
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-2xl">{title}</h3>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-nourish-muted hover:bg-nourish-bg">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
