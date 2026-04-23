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
        "card min-w-0 p-4",
        isToday && "ring-2 ring-nourish-sage ring-offset-2 ring-offset-[#fbf7f2] lg:ring-offset-white",
      )}
    >
      <div className={cn("mb-4 flex items-center gap-2", hasGap ? "justify-between" : "justify-start")}>
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <h3 className="text-xl">{day.slice(0, 3)}</h3>
          {isToday ? (
            <span className="rounded-full bg-nourish-sage/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-nourish-sage">
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

      <div className="space-y-3">
        {slots.map((slot) => (
          <MealCard
            key={slot.id}
            slot={slot}
            recipe={recipes.find((recipe) => recipe.id === slot.recipeId)}
            onSwap={() => onSlotSelect(slot.id)}
            onDidntHappen={onSkipSlot ? () => onSkipSlot(slot.id) : undefined}
          />
        ))}
      </div>

      <label className="mt-4 flex min-h-[44px] cursor-pointer items-center justify-between gap-3 rounded-2xl bg-nourish-bg px-3 py-2 text-sm text-nourish-muted sm:px-4 sm:py-3">
        <span>Eating out?</span>
        <span className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center">
          <input
            type="checkbox"
            checked={dayEatingOut}
            disabled={togglePending}
            onChange={(event) => onToggleEatingOut?.(event.target.checked)}
            className="h-5 w-5 rounded border-nourish-border text-nourish-sage focus:ring-nourish-sage"
          />
        </span>
      </label>
    </div>
  );
}
