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
  onSlotSelect: (slotId: number) => void;
  onSkipSlot?: (slotId: number) => void;
  onClearSlot?: (slotId: number) => void;
  dayEatingOut?: boolean;
  togglePending?: boolean;
  onToggleEatingOut?: (next: boolean) => void;
}

export function DayColumn({
  day,
  slots,
  recipes,
  isToday,
  onSlotSelect,
  onSkipSlot,
  onClearSlot,
  dayEatingOut = false,
  togglePending = false,
  onToggleEatingOut,
}: DayColumnProps) {
  const hasGap = slots.some((slot) => slot.mealType !== "Snack" && !slot.recipeId && !slot.isEatingOut && !slot.isSkipped);
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
        {dayEatingOut ? (
          <div
            className="pointer-events-auto absolute inset-0 z-[5] flex flex-col items-center justify-center rounded-xl bg-nourish-ink/20 px-2 text-center backdrop-blur-[1px]"
            aria-hidden
          >
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-nourish-ink shadow-sm">Eating out</span>
            <span className="mt-2 text-[11px] font-medium text-nourish-ink/90">Meals paused for this day</span>
          </div>
        ) : null}
        <div className={cn("space-y-3", dayEatingOut && "opacity-40")}>
          {slots.map((slot) => (
            <MealCard
              key={slot.id}
              slot={slot}
              recipe={recipes.find((recipe) => recipe.id === slot.recipeId)}
              onSwap={() => onSlotSelect(slot.id)}
              onDidntHappen={onSkipSlot ? () => onSkipSlot(slot.id) : undefined}
              onRemoveMeal={onClearSlot ? () => onClearSlot(slot.id) : undefined}
            />
          ))}
        </div>
      </div>

      <div className="mt-3 shrink-0 border-t border-nourish-border/60 pt-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-nourish-muted">Eating out?</span>
          <button
            type="button"
            role="switch"
            aria-checked={dayEatingOut}
            disabled={togglePending}
            onClick={() => onToggleEatingOut?.(!dayEatingOut)}
            className={cn(
              "relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nourish-sage",
              dayEatingOut ? "border-nourish-sage bg-nourish-sage" : "border-nourish-border bg-nourish-bg",
              togglePending && "pointer-events-none opacity-50",
            )}
          >
            <span
              className={cn(
                "pointer-events-none absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-[left] duration-200 ease-out",
                dayEatingOut ? "left-[calc(100%-1.625rem)]" : "left-0.5",
              )}
              aria-hidden
            />
            <span className="sr-only">{dayEatingOut ? "Eating out on" : "Eating out off"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
