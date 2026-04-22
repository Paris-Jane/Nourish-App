import { AlertCircle } from "lucide-react";
import { MealCard } from "./MealCard";
import { cn } from "lib/utils";
import type { Recipe, WeekMealSlot } from "types/models";

interface DayColumnProps {
  day: string;
  slots: WeekMealSlot[];
  recipes: Recipe[];
  onSlotSelect: (slotId: number) => void;
}

export function DayColumn({ day, slots, recipes, onSlotSelect }: DayColumnProps) {
  const hasGap = slots.some((slot) => slot.mealType !== "Snack" && !slot.recipeId);

  return (
    <div className="card min-w-[260px] p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-xl">{day.slice(0, 3)}</h3>
          {hasGap && <span className="h-2 w-2 rounded-full bg-nourish-amber" />}
        </div>
        {hasGap && <AlertCircle size={14} className="text-nourish-amber" />}
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
