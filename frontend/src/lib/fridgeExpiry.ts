import { daysUntil } from "lib/utils";
import type { FridgeItem } from "types/models";

/** Human-readable expiry line with correct singular/plural. */
export function formatExpiryLine(remaining: number | null): string {
  if (remaining === null) return "No expiry set";
  if (remaining < 0) {
    const n = Math.abs(remaining);
    return n === 1 ? "Expired 1 day ago" : `Expired ${n} days ago`;
  }
  if (remaining === 0) return "Expires today";
  if (remaining === 1) return "1 day left";
  return `${remaining} days left`;
}

/** Row surface: border, background, optional ring for urgency. */
export function expiryUrgencyRowClass(remaining: number | null): string {
  if (remaining === null) return "border-nourish-border/90 bg-white";
  if (remaining < 0) return "border-red-500 bg-red-50 text-red-950 ring-2 ring-red-400/50 shadow-[0_0_0_1px_rgba(220,38,38,0.15)]";
  if (remaining <= 1) return "border-orange-500 bg-orange-50 text-orange-950 ring-2 ring-orange-400/45 shadow-sm";
  if (remaining <= 3) return "border-amber-400 bg-amber-50 text-amber-950 ring-1 ring-amber-300/60";
  return "border-nourish-border bg-white";
}

/** Items that should surface in the expiring-soon banner (today through ~2 days). */
export function getExpiringSoonItems(items: FridgeItem[], withinDays = 2): FridgeItem[] {
  return items.filter((item) => {
    const d = daysUntil(item.expiresAt);
    return d !== null && d >= 0 && d <= withinDays;
  });
}

export function countExpiringWithin(items: FridgeItem[], withinDays = 3): number {
  return items.filter((item) => {
    const d = daysUntil(item.expiresAt);
    return d !== null && d >= 0 && d <= withinDays;
  }).length;
}
