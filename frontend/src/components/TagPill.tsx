import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "lib/utils";

interface TagPillProps {
  children: ReactNode;
  active?: boolean;
  tone?: "default" | "accent" | "warm";
  onClick?: () => void;
}

export function TagPill({ children, active, tone = "default", onClick }: TagPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition",
        tone === "default" && "border-nourish-border bg-white text-nourish-muted",
        tone === "accent" && "border-transparent bg-nourish-sage/10 text-nourish-sage",
        tone === "warm" && "border-transparent bg-nourish-terracotta/10 text-nourish-terracotta",
        active && "border-transparent bg-nourish-sage text-white",
      )}
    >
      {active ? <Check size={12} className="shrink-0 stroke-[3]" aria-hidden /> : null}
      {children}
    </button>
  );
}
