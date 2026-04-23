import * as React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { cn } from "lib/utils";
import type { GroceryListItem } from "types/models";

interface GroceryListItemRowProps {
  item: GroceryListItem;
  checked: boolean;
  recipeNote: string;
  actualQty: number;
  qtyStatus: "idle" | "saved";
  deleteRevealed: boolean;
  onToggleChecked: () => void;
  onQtyDelta: (delta: number) => void;
  onDelete: () => void;
  onRevealDelete: () => void;
  onHideDelete: () => void;
}

export function GroceryListItemRow({
  item,
  checked,
  recipeNote,
  actualQty,
  qtyStatus,
  deleteRevealed,
  onToggleChecked,
  onQtyDelta,
  onDelete,
  onRevealDelete,
  onHideDelete,
}: GroceryListItemRowProps) {
  const pointerDown = React.useRef<{ x: number; y: number; t: number } | null>(null);

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
    if (Math.abs(dx) < 14 && Math.abs(dy) < 14 && dt < 900) onToggleChecked();
  };

  return (
    <>
      {/* Mobile swipe */}
      <div className="relative w-full overflow-hidden rounded-2xl md:hidden">
        <div
          className={cn(
            "flex w-[calc(100%+4.5rem)] transition-transform duration-200 ease-out",
            deleteRevealed ? "-translate-x-[4.5rem]" : "translate-x-0",
          )}
        >
          <div className="box-border w-full min-w-0 shrink-0 basis-full">
            <div
              role="checkbox"
              tabIndex={0}
              aria-checked={checked}
              className={cn(
                "w-full px-4 py-3 text-left outline-none ring-nourish-sage focus-visible:ring-2",
                checked ? "bg-[#f0ebe4]" : "bg-[#fcfaf7]",
              )}
              onPointerDown={(e) => {
                if (e.pointerType === "mouse" && e.button !== 0) return;
                if ((e.target as HTMLElement).closest("[data-grocery-stepper]")) return;
                pointerDown.current = { x: e.clientX, y: e.clientY, t: Date.now() };
              }}
              onPointerUp={(e) => {
                if ((e.target as HTMLElement).closest("[data-grocery-stepper]")) {
                  pointerDown.current = null;
                  return;
                }
                handleMainPointerUp(e);
              }}
              onPointerCancel={() => {
                pointerDown.current = null;
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onToggleChecked();
                }
              }}
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition",
                    checked ? "border-nourish-sage bg-nourish-sage text-white" : "border-nourish-border bg-white",
                  )}
                  aria-hidden
                >
                  {checked ? "✓" : ""}
                </span>
                <div className="min-w-0 flex-1">
                  <p className={cn("font-medium transition", checked ? "text-nourish-muted line-through" : "text-nourish-ink")}>{item.ingredientName}</p>
                  <p className="text-sm text-nourish-muted">
                    {item.plannedQuantity} {item.plannedUnit} planned
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-nourish-muted">
                    <span className="font-medium text-nourish-ink/70">For recipes: </span>
                    {recipeNote}
                  </p>
                  {checked ? (
                    <div
                      data-grocery-stepper
                      className="mt-3 flex flex-wrap items-center gap-2 rounded-2xl bg-white px-3 py-2 text-sm shadow-sm"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="text-nourish-muted">How many did you get?</span>
                      <div className="flex items-center gap-2">
                        <button type="button" className="button-secondary h-8 w-8 shrink-0 p-0" aria-label="Decrease quantity" onClick={() => onQtyDelta(-0.5)}>
                          <Minus size={16} className="mx-auto" />
                        </button>
                        <span className="min-w-[2.5rem] text-center font-medium tabular-nums">{Number.isInteger(actualQty) ? actualQty : actualQty.toFixed(1)}</span>
                        <button type="button" className="button-secondary h-8 w-8 shrink-0 p-0" aria-label="Increase quantity" onClick={() => onQtyDelta(0.5)}>
                          <Plus size={16} className="mx-auto" />
                        </button>
                      </div>
                      {qtyStatus === "saved" ? <span className="text-xs font-medium text-nourish-sage">Saved</span> : null}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
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

      {/* Desktop */}
      <div className={cn("hidden items-stretch gap-3 rounded-2xl md:flex", checked ? "bg-[#f0ebe4]" : "bg-[#fcfaf7]")}>
        <button
          type="button"
          aria-checked={checked}
          role="checkbox"
          className="flex flex-1 items-start gap-3 px-4 py-3 text-left outline-none ring-nourish-sage focus-visible:ring-2"
          onClick={onToggleChecked}
        >
          <span
            className={cn(
              "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition",
              checked ? "border-nourish-sage bg-nourish-sage text-white" : "border-nourish-border bg-white",
            )}
            aria-hidden
          >
            {checked ? "✓" : ""}
          </span>
          <div className="min-w-0 flex-1">
            <p className={cn("font-medium transition", checked ? "text-nourish-muted line-through" : "text-nourish-ink")}>{item.ingredientName}</p>
            <p className="text-sm text-nourish-muted">
              {item.plannedQuantity} {item.plannedUnit} planned
            </p>
            <p className="mt-1 text-xs leading-relaxed text-nourish-muted">
              <span className="font-medium text-nourish-ink/70">For recipes: </span>
              {recipeNote}
            </p>
          </div>
        </button>
        <div className="flex shrink-0 flex-col items-end justify-between gap-2 py-3 pr-3">
          <button
            type="button"
            className="rounded-full p-2 text-nourish-muted transition hover:bg-red-50 hover:text-red-700"
            aria-label={`Remove ${item.ingredientName}`}
            onClick={onDelete}
          >
            <Trash2 size={18} />
          </button>
          {checked ? (
            <div data-grocery-stepper className="flex flex-wrap items-center justify-end gap-2 text-sm">
              <div className="flex items-center gap-2 rounded-2xl bg-white px-2 py-1 shadow-sm">
                <button type="button" className="button-secondary h-8 w-8 shrink-0 p-0" aria-label="Decrease quantity" onClick={() => onQtyDelta(-0.5)}>
                  <Minus size={16} className="mx-auto" />
                </button>
                <span className="min-w-[2.5rem] text-center font-medium tabular-nums">{Number.isInteger(actualQty) ? actualQty : actualQty.toFixed(1)}</span>
                <button type="button" className="button-secondary h-8 w-8 shrink-0 p-0" aria-label="Increase quantity" onClick={() => onQtyDelta(0.5)}>
                  <Plus size={16} className="mx-auto" />
                </button>
              </div>
              {qtyStatus === "saved" ? <span className="text-xs font-medium text-nourish-sage">Saved</span> : null}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
