import { cn, daysUntil } from "lib/utils";

export function ExpiryDot({ expiresAt }: { expiresAt?: string | null }) {
  const remaining = daysUntil(expiresAt);

  return (
    <span
      className={cn(
        "inline-block h-3 w-3 shrink-0 rounded-full ring-2 ring-offset-1 ring-offset-white",
        remaining === null && "bg-nourish-muted/35 ring-transparent",
        remaining !== null && remaining < 0 && "bg-red-600 ring-red-300",
        remaining !== null && remaining === 0 && "bg-orange-600 ring-orange-300 animate-pulse",
        remaining !== null && remaining === 1 && "bg-orange-500 ring-orange-200",
        remaining !== null && remaining >= 2 && remaining <= 3 && "bg-amber-500 ring-amber-200",
        remaining !== null && remaining > 3 && remaining < 7 && "bg-amber-400/90 ring-amber-100",
        remaining !== null && remaining >= 7 && "bg-nourish-sage ring-nourish-sage/30",
      )}
    />
  );
}
