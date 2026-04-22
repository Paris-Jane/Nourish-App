import { ArrowRightLeft, X } from "lucide-react";
import { cn } from "lib/utils";
import { RecipeCard } from "./RecipeCard";
import { TagPill } from "./TagPill";
import type { Recipe, WeekMealSlot } from "types/models";

const filters = ["Expiring soon", "In your fridge", "Ingredient overlap", "Favorites", "Recent"];

interface SwapDrawerProps {
  open: boolean;
  slot?: WeekMealSlot;
  recipes: Recipe[];
  onClose: () => void;
}

export function SwapDrawer({ open, slot, recipes, onClose }: SwapDrawerProps) {
  const currentRecipe = recipes.find((recipe) => recipe.id === slot?.recipeId);

  return (
    <div className={cn("fixed inset-0 z-40 transition", open ? "pointer-events-auto" : "pointer-events-none")}>
      <div className={cn("absolute inset-0 bg-[#2c2416]/30 transition", open ? "opacity-100" : "opacity-0")} onClick={onClose} />
      <aside
        className={cn(
          "absolute bottom-0 left-0 right-0 rounded-t-[28px] border border-nourish-border bg-nourish-card p-5 transition lg:bottom-4 lg:left-auto lg:right-4 lg:top-4 lg:w-[420px] lg:rounded-[28px]",
          open ? "translate-y-0" : "translate-y-full lg:translate-x-full lg:translate-y-0",
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl">Swap this meal</h2>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-nourish-muted hover:bg-nourish-bg">
            <X size={18} />
          </button>
        </div>
        <div className="mb-4 rounded-2xl bg-nourish-bg p-4">
          <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-nourish-muted">
            <ArrowRightLeft size={14} />
            Current pick
          </div>
          <h3 className="text-lg">{currentRecipe?.name ?? "Open slot"}</h3>
        </div>
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {filters.map((filter, index) => (
            <TagPill key={filter} active={index === 0}>
              {filter}
            </TagPill>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 overflow-y-auto pb-4">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} compact />
          ))}
        </div>
        <button type="button" onClick={onClose} className="button-secondary mt-4 w-full">
          Keep current
        </button>
      </aside>
    </div>
  );
}
