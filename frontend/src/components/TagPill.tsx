import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "lib/utils";

interface TagPillProps {
  children: ReactNode;
  active?: boolean;
  tone?: "default" | "accent" | "warm" | "cuisine" | "breakfast" | "lunch" | "dinner" | "snack";
  onClick?: () => void;
}

export function TagPill({ children, active, tone = "default", onClick }: TagPillProps) {
  const inactive =
    tone === "breakfast"
      ? "border-amber-200/90 bg-amber-100 text-amber-900 hover:bg-amber-100/90 hover:text-amber-950"
      : tone === "lunch"
        ? "border-emerald-200/90 bg-emerald-100 text-emerald-900 hover:bg-emerald-100/90 hover:text-emerald-950"
        : tone === "dinner"
          ? "border-sky-200/90 bg-sky-100 text-sky-900 hover:bg-sky-100/90 hover:text-sky-950"
          : tone === "snack"
            ? "border-rose-200/90 bg-rose-100 text-rose-900 hover:bg-rose-100/90 hover:text-rose-950"
            : tone === "accent"
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
