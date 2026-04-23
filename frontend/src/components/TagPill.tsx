import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "lib/utils";

interface TagPillProps {
  children: ReactNode;
  active?: boolean;
  tone?: "default" | "accent" | "warm" | "cuisine";
  onClick?: () => void;
}

export function TagPill({ children, active, tone = "default", onClick }: TagPillProps) {
  const inactive =
    tone === "accent"
      ? "border-transparent bg-nourish-sage/12 text-nourish-sage hover:bg-nourish-sage/20 hover:text-nourish-sage"
      : tone === "warm"
        ? "border-transparent bg-nourish-terracotta/12 text-nourish-terracotta hover:bg-nourish-terracotta/20 hover:text-nourish-terracotta"
        : tone === "cuisine"
          ? "border-orange-200/90 bg-orange-100 text-orange-800 hover:bg-orange-100/90 hover:text-orange-900"
          : "border-nourish-border bg-white text-nourish-muted hover:border-nourish-sage/35 hover:bg-nourish-bg/80 hover:text-nourish-ink";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
        active
          ? "border-nourish-sage bg-nourish-sage text-white shadow-sm ring-2 ring-nourish-sage/35 [&_svg]:text-white"
          : inactive,
      )}
    >
      {active ? <Check size={12} className="shrink-0 stroke-[2.5]" aria-hidden /> : null}
      {children}
    </button>
  );
}
