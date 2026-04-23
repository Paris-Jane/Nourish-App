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
}

export function DayColumn({ day, slots, recipes, isToday, onSlotSelect }: DayColumnProps) {
  const hasGap = slots.some((slot) => slot.mealType !== "Snack" && !slot.recipeId);
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
            <span className="rounded-full bg-nourish-sage/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-nourish-sage">Today</span>
          ) : null}
          {hasGap ? <span className="h-2 w-2 shrink-0 rounded-full bg-nourish-amber" title="Open meal slot" aria-hidden /> : null}
        </div>
        {hasGap ? (
          <div className="relative shrink-0" ref={infoWrapRef}>
            <button
              type="button"
              className="rounded-full p-1.5 text-nourish-amber transition hover:bg-nourish-bg"
              aria-expanded={infoOpen}
              aria-controls={infoId}
              aria-label="What does the amber dot mean?"
              onClick={() => setInfoOpen((o) => !o)}
            >
              <Info size={16} />
            </button>
            {infoOpen ? (
              <div
                id={infoId}
                role="tooltip"
                className="absolute right-0 top-full z-10 mt-1 w-56 rounded-xl border border-nourish-border bg-white p-3 text-left text-xs leading-relaxed text-nourish-ink shadow-lg"
              >
                <span className="mr-1 inline-block h-2 w-2 rounded-full bg-nourish-amber align-middle" aria-hidden />
                <strong className="text-nourish-ink">Amber on a day</strong> means there is still an open breakfast, lunch, or dinner slot that needs a recipe.
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="space-y-3">
        {slots.map((slot) => (
          <MealCard
            key={slot.id}
            slot={slot}
            recipe={recipes.find((recipe) => recipe.id === slot.recipeId)}
            onSwap={() => onSlotSelect(slot.id)}
          />
        ))}
      </div>

      <label
        className={cn(
          "mt-4 flex items-center justify-between rounded-2xl bg-nourish-bg px-4 py-3 text-sm text-nourish-muted",
        )}
      >
        Eating out?
        <input type="checkbox" className="h-4 w-4 rounded border-nourish-border text-nourish-sage focus:ring-nourish-sage" />
      </label>
    </div>
  );
}
