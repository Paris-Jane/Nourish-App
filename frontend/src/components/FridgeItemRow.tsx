import { Heart, Trash2 } from "lucide-react";
import { useRef } from "react";
import { ExpiryDot } from "components/ExpiryDot";
import { cn, daysUntil } from "lib/utils";
import { formatExpiryLine, expiryUrgencyRowClass } from "lib/fridgeExpiry";
import type { FridgeItem } from "types/models";

interface FridgeItemRowProps {
  item: FridgeItem;
  deleteRevealed: boolean;
  onRevealDelete: () => void;
  onHideDelete: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function FridgeItemRow({
  item,
  deleteRevealed,
  onRevealDelete,
  onHideDelete,
  onEdit,
  onDelete,
  isFavorite = false,
  onToggleFavorite,
}: FridgeItemRowProps) {
  const remaining = daysUntil(item.expiresAt);
  const label = formatExpiryLine(remaining);
  const urgency = expiryUrgencyRowClass(remaining);
  const pointerDown = useRef<{ x: number; y: number; t: number } | null>(null);

  const handleMainPointerUp = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if (!pointerDown.current) return;
    const dx = e.clientX - pointerDown.current.x;
    const dy = e.clientY - pointerDown.current.y;
    const dt = Date.now() - pointerDown.current.t;
    pointerDown.current = null;

    if (deleteRevealed) {
      if (Math.abs(dx) < 14 && Math.abs(dy) < 14 && dt < 900) onHideDelete();
      return;
    }
    if (dx < -56) {
      onRevealDelete();
      return;
    }
    if (Math.abs(dx) < 14 && Math.abs(dy) < 14 && dt < 900) onEdit();
  };

  return (
    <>
      {/* Narrow: swipe left to reveal delete */}
      <div className={cn("relative w-full overflow-hidden rounded-2xl md:hidden", urgency)}>
        <div
          className={cn(
            "flex w-[calc(100%+4.5rem)] transition-transform duration-200 ease-out",
            deleteRevealed ? "-translate-x-[4.5rem]" : "translate-x-0",
          )}
        >
          <div className="box-border w-full min-w-0 shrink-0 basis-full">
            <button
              type="button"
              className="flex w-full items-center gap-3 p-4 text-left touch-pan-y"
              onPointerDown={(e) => {
                if (e.pointerType === "mouse" && e.button !== 0) return;
                pointerDown.current = { x: e.clientX, y: e.clientY, t: Date.now() };
              }}
              onPointerUp={handleMainPointerUp}
              onPointerCancel={() => {
                pointerDown.current = null;
              }}
            >
              <ExpiryDot expiresAt={item.expiresAt} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-nourish-ink">{item.ingredientName}</p>
                  {isFavorite ? <Heart size={14} className="fill-nourish-terracotta text-nourish-terracotta" aria-hidden /> : null}
                </div>
                <p className="text-sm text-nourish-muted">
                  {item.quantity} {item.unit}
                </p>
              </div>
              <span className={cn("max-w-[38%] shrink-0 text-right text-xs font-semibold leading-tight", remaining !== null && remaining <= 1 && "text-orange-800", remaining !== null && remaining < 0 && "text-red-800")}>
                {label}
              </span>
            </button>
          </div>
          <button
            type="button"
            className="box-border flex w-[4.5rem] shrink-0 flex-col items-center justify-center gap-0.5 bg-red-600 px-1 text-center text-xs font-semibold leading-tight text-white active:bg-red-700"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => {
              onDelete();
              onHideDelete();
            }}
          >
            <Trash2 size={18} className="shrink-0 opacity-90" aria-hidden />
            Delete
          </button>
        </div>
      </div>

      {/* Wide: tap row to edit, trash always visible */}
      <div className={cn("hidden items-center justify-between gap-3 rounded-2xl border p-4 md:flex", urgency)}>
        <button type="button" className="flex min-w-0 flex-1 items-center gap-3 text-left" onClick={onEdit}>
          <ExpiryDot expiresAt={item.expiresAt} />
          <div className="min-w-0">
            <p className="font-medium text-nourish-ink">{item.ingredientName}</p>
            <p className="text-sm text-nourish-muted">
              {item.quantity} {item.unit}
            </p>
          </div>
        </button>
        <div className="flex shrink-0 items-center gap-2">
          {onToggleFavorite ? (
            <button
              type="button"
              className="rounded-full p-2 text-nourish-muted transition hover:bg-nourish-terracotta/10 hover:text-nourish-terracotta"
              aria-label={isFavorite ? `Remove ${item.ingredientName} from favorites` : `Favorite ${item.ingredientName}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
            >
              <Heart size={18} className={cn(isFavorite && "fill-nourish-terracotta text-nourish-terracotta")} />
            </button>
          ) : null}
          <span className={cn("text-right text-xs font-semibold", remaining !== null && remaining <= 1 && "text-orange-800", remaining !== null && remaining < 0 && "text-red-800")}>{label}</span>
          <button
            type="button"
            className="rounded-full p-2 text-nourish-muted transition hover:bg-red-50 hover:text-red-700"
            aria-label={`Delete ${item.ingredientName}`}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </>
  );
}
