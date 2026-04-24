import { Info } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { MealCard } from "./MealCard";
import { cn } from "lib/utils";
import type { Recipe, WeekMealSlot } from "types/models";

interface DayColumnProps {
  day: string;
  slots: WeekMealSlot[];
  recipes: Recipe[];
  isToday?: boolean;
  planningMode?: boolean;
  onSlotPrimaryAction: (slot: WeekMealSlot) => void;
  onSlotEdit: (slot: WeekMealSlot) => void;
  onCopyMeal?: (slot: WeekMealSlot) => void;
  onSkipSlot?: (slotId: number) => void;
  onClearSlot?: (slotId: number) => void;
  onDeleteSlot?: (slotId: number) => void;
  onAddSnack?: () => void;
  dragState?: {
    draggedSlotId: number | null;
    dropTargetSlotId: number | null;
    onDragStart: (slotId: number) => void;
    onDragEnd: () => void;
    onDragOver: (slotId: number) => void;
    onDrop: (slotId: number) => void;
  };
}

export function DayColumn({
  day,
  slots,
  recipes,
  isToday,
  planningMode = false,
  onSlotPrimaryAction,
  onSlotEdit,
  onCopyMeal,
  onSkipSlot,
  onClearSlot,
  onDeleteSlot,
  onAddSnack,
  dragState,
}: DayColumnProps) {
  const hasGap = slots.some((slot) => slot.mealType !== "Snack" && !slot.recipeId && !slot.isSkipped);
  const [infoOpen, setInfoOpen] = useState(false);
  const infoId = useId();
  const infoWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!infoOpen) return;
    const close = (e: MouseEvent) => {
      if (infoWrapRef.current && !infoWrapRef.current.contains(e.target as Node)) setInfoOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [infoOpen]);

  return (
    <div
      className={cn(
        "flex min-h-0 min-w-0 flex-col overflow-visible rounded-2xl border bg-white p-3 shadow-sm sm:p-4",
        isToday ? "border-2 border-nourish-sage bg-[#f0f4f0]" : "border-nourish-border",
      )}
    >
      <div className={cn("mb-3 flex min-w-0 items-center gap-2", hasGap ? "justify-between" : "justify-start")}>
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <h3 className="text-lg font-semibold text-nourish-ink">{day.slice(0, 3)}</h3>
          {isToday ? (
            <span className="rounded-full bg-nourish-sage/20 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-nourish-sage">
              Today
            </span>
          ) : null}
          {hasGap ? <span className="h-2 w-2 shrink-0 rounded-full bg-nourish-amber" title="Nutrition gap" aria-hidden /> : null}
        </div>
        <div className="relative shrink-0" ref={infoWrapRef}>
          <button
            type="button"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-nourish-amber transition hover:bg-nourish-bg"
            aria-expanded={infoOpen}
            aria-controls={infoId}
            aria-label="Day column help"
            onClick={() => setInfoOpen((o) => !o)}
          >
            <Info size={18} />
          </button>
          {infoOpen ? (
            <div
              id={infoId}
              role="tooltip"
              className="absolute right-0 top-full z-10 mt-1 w-64 max-w-[min(18rem,calc(100vw-2rem))] rounded-xl border border-nourish-border bg-white p-3 text-left text-xs leading-relaxed text-nourish-ink shadow-lg"
            >
              <p className="font-semibold text-nourish-ink">Amber dot on a day</p>
              <p className="mt-1.5 text-nourish-muted">
                This day has a nutrition gap — a food group is missing or under-represented. Add a snack to fill it.
              </p>
              <p className="mt-3 font-semibold text-nourish-ink">Colored dots under meals</p>
              <p className="mt-1 text-nourish-muted">Each dot is a MyPlate-style food group in that recipe:</p>
              <ul className="mt-2 space-y-1 text-[11px] text-nourish-ink">
                <li>
                  <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-[#D4B483]" /> Grains
                </li>
                <li>
                  <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-[#C4714F]" /> Protein
                </li>
                <li>
                  <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-[#7C9E87]" /> Vegetable
                </li>
                <li>
                  <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-[#E69C5C]" /> Fruit
                </li>
                <li>
                  <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-[#E8D9B6]" /> Dairy
                </li>
                <li>
                  <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-[#9C7C63]" /> Legume
                </li>
              </ul>
            </div>
          ) : null}
        </div>
      </div>

      <div className="relative min-h-0 flex-1 space-y-3">
        <div className="space-y-3">
          {slots.map((slot) => (
            <MealCard
              key={slot.id}
              slot={slot}
              recipe={recipes.find((recipe) => recipe.id === slot.recipeId)}
              planningMode={planningMode}
              onPrimaryAction={() => onSlotPrimaryAction(slot)}
              onSwap={() => onSlotEdit(slot)}
              onCopyMeal={onCopyMeal ? () => onCopyMeal(slot) : undefined}
              onDidntHappen={onSkipSlot ? () => onSkipSlot(slot.id) : undefined}
              onRemoveMeal={onClearSlot ? () => onClearSlot(slot.id) : undefined}
              onDeleteSlot={slot.mealType === "Snack" && slot.position > 0 && onDeleteSlot ? () => onDeleteSlot(slot.id) : undefined}
              draggable={slot.recipeId != null}
              dropActive={dragState?.dropTargetSlotId === slot.id}
              onDragStart={dragState ? () => dragState.onDragStart(slot.id) : undefined}
              onDragEnd={dragState?.onDragEnd}
              onDragOver={dragState ? () => dragState.onDragOver(slot.id) : undefined}
              onDrop={dragState ? () => dragState.onDrop(slot.id) : undefined}
            />
          ))}
          {planningMode && onAddSnack ? (
            <button
              type="button"
              className="w-full rounded-2xl border border-dashed border-nourish-sage/40 bg-nourish-sage/5 px-4 py-3 text-left text-sm font-medium text-nourish-sage transition hover:border-nourish-sage hover:bg-nourish-sage/10"
              onClick={onAddSnack}
            >
              + Add another snack
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
