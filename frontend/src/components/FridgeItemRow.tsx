import { Trash2 } from "lucide-react";
import { ExpiryDot } from "components/ExpiryDot";
import { cn, daysUntil } from "lib/utils";
import { formatExpiryLine, expiryUrgencyRowClass } from "lib/fridgeExpiry";
import type { FridgeItem } from "types/models";

interface FridgeItemRowProps {
  item: FridgeItem;
  rowId?: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function FridgeItemRow({ item, rowId, onEdit, onDelete }: FridgeItemRowProps) {
  const remaining = daysUntil(item.expiresAt);
  const label = formatExpiryLine(remaining);
  const urgency = expiryUrgencyRowClass(remaining);

  return (
    <div id={rowId} className={cn("flex min-w-0 items-stretch gap-1 rounded-2xl border p-3 sm:gap-2 sm:p-4", urgency)}>
      <button
        type="button"
        className="flex min-w-0 flex-1 items-center gap-3 rounded-xl py-0.5 text-left touch-manipulation"
        onClick={onEdit}
      >
        <ExpiryDot expiresAt={item.expiresAt} />
        <div className="min-w-0 flex-1 pr-1">
          <p className="truncate font-medium text-nourish-ink">{item.ingredientName}</p>
          <p className="truncate text-sm text-nourish-muted">
            {item.quantity} {item.unit}
          </p>
        </div>
      </button>
      <div className="flex shrink-0 flex-col items-end justify-center gap-1 pl-1 pr-2 sm:flex-row sm:items-center sm:gap-2 sm:pr-3">
        <span
          className={cn(
            "max-w-[9.5rem] text-right text-xs font-semibold leading-snug sm:max-w-[11rem]",
            remaining !== null && remaining <= 1 && "text-orange-800",
            remaining !== null && remaining < 0 && "text-red-800",
          )}
        >
          {label}
        </span>
        <button
          type="button"
          className="shrink-0 rounded-full p-2 text-nourish-muted transition hover:bg-red-50 hover:text-red-700 active:bg-red-100"
          aria-label={`Delete ${item.ingredientName}`}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 size={18} aria-hidden />
        </button>
      </div>
    </div>
  );
}
