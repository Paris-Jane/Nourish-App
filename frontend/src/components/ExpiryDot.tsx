import { cn, daysUntil } from "lib/utils";

export function ExpiryDot({ expiresAt }: { expiresAt?: string | null }) {
  const remaining = daysUntil(expiresAt);

  return (
    <span
      className={cn(
        "inline-block h-2.5 w-2.5 rounded-full",
        remaining === null && "bg-nourish-muted/30",
        remaining !== null && remaining >= 5 && "bg-nourish-sage",
        remaining !== null && remaining >= 2 && remaining < 5 && "bg-nourish-amber",
        remaining !== null && remaining < 2 && "bg-[#d46a4d]",
      )}
    />
  );
}
