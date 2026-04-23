import { ArrowUpDown, Plus } from "lucide-react";
import { cn } from "lib/utils";
import { NutritionDots } from "./NutritionDots";
import type { MealType, Recipe, WeekMealSlot } from "types/models";

interface MealCardProps {
  slot: WeekMealSlot;
  recipe?: Recipe;
  onSwap: () => void;
}

function mealLabel(mealType: MealType) {
  return mealType === "Snack" ? "Snack" : mealType;
}

export function MealCard({ slot, recipe, onSwap }: MealCardProps) {
  const empty = !recipe;

  return (
    <button
      type="button"
      onClick={onSwap}
      className={cn(
        "group w-full rounded-2xl border p-3 text-left transition",
        empty ? "border-dashed border-nourish-border bg-[#fdfaf6]" : "border-nourish-border bg-white hover:shadow-sm",
        slot.mealType === "Snack" && "bg-[#fffaf5]",
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <span className="text-xs uppercase tracking-[0.18em] text-nourish-muted">{mealLabel(slot.mealType)}</span>
        <ArrowUpDown size={14} className="text-nourish-muted opacity-0 transition group-hover:opacity-100" />
      </div>

      {empty ? (
        <div className="flex items-center gap-2 text-sm text-nourish-muted">
          <Plus size={14} />
          Add something gentle here
        </div>
      ) : (
        <>
          <h4 className="mb-2 text-sm leading-5 text-nourish-ink">{recipe.name}</h4>
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full bg-nourish-bg px-2 py-1 text-[11px] text-nourish-muted">
              {recipe.timeTag === "Quick" ? "25 min" : recipe.timeTag === "Medium" ? "45 min" : "No limit"}
            </span>
          </div>
          <NutritionDots foodGroups={Object.keys(recipe.foodGroupServings)} />
        </>
      )}
    </button>
  );
}
