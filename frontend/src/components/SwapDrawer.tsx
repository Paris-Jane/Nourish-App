import { useEffect, useMemo, useState } from "react";
import { ArrowRightLeft, Search, X } from "lucide-react";
import { useRecipePrefsStore } from "store/recipePrefsStore";
import { cn, daysUntil } from "lib/utils";
import { RecipeCard } from "./RecipeCard";
import { TagPill } from "./TagPill";
import type { FridgeItem, Recipe, WeekMealSlot } from "types/models";

const filters = ["All suggestions", "Expiring soon", "In your fridge", "Ingredient overlap", "Favorites", "Recent"] as const;

interface SwapDrawerProps {
  open: boolean;
  slot?: WeekMealSlot;
  recipes: Recipe[];
  fridgeItems?: FridgeItem[];
  weekSlots?: WeekMealSlot[];
  onClose: () => void;
}

function matchesSlotMealType(recipe: Recipe, slot: WeekMealSlot | undefined): boolean {
  if (!slot) return true;
  return (
    recipe.mealTypeTags.includes(slot.mealType) ||
    (slot.mealType === "Dinner" && recipe.mealTypeTags.includes("Lunch")) ||
    (slot.mealType === "Lunch" && recipe.mealTypeTags.includes("Dinner"))
  );
}

export function SwapDrawer({ open, slot, recipes, fridgeItems = [], weekSlots = [], onClose }: SwapDrawerProps) {
  const currentRecipe = recipes.find((recipe) => recipe.id === slot?.recipeId);
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("All suggestions");
  const [query, setQuery] = useState("");
  const isFavorite = useRecipePrefsStore((s) => s.isFavorite);

  useEffect(() => {
    if (open) {
      setActiveFilter("All suggestions");
      setQuery("");
    }
  }, [open, slot?.id]);

  const visibleRecipes = useMemo(() => {
    const fridgeIngredientIds = new Set(fridgeItems.map((item) => item.ingredientId));
    const expiringIngredientIds = new Set(
      fridgeItems
        .filter((fi) => {
          const d = daysUntil(fi.expiresAt);
          return d !== null && d >= 0 && d <= 2;
        })
        .map((fi) => fi.ingredientId),
    );
    const usedIngredientIds = new Set(
      weekSlots
        .filter((entry) => entry.id !== slot?.id && entry.recipeId)
        .flatMap(
          (entry) => recipes.find((recipe) => recipe.id === entry.recipeId)?.ingredients.map((ingredient) => ingredient.ingredientId) ?? [],
        ),
    );

    const filteredByTab = recipes.filter((recipe, index) => {
      if (!matchesSlotMealType(recipe, slot)) return false;

      switch (activeFilter) {
        case "All suggestions":
          return true;
        case "Expiring soon":
          return recipe.ingredients.some((ingredient) => expiringIngredientIds.has(ingredient.ingredientId));
        case "In your fridge":
          return recipe.ingredients.some((ingredient) => fridgeIngredientIds.has(ingredient.ingredientId));
        case "Ingredient overlap":
          return recipe.ingredients.some((ingredient) => usedIngredientIds.has(ingredient.ingredientId));
        case "Favorites":
          return isFavorite(recipe.id);
        case "Recent":
          return index < 4;
        default:
          return true;
      }
    });

    const q = query.trim().toLowerCase();
    if (!q) return filteredByTab;
    return filteredByTab.filter((recipe) => `${recipe.name} ${recipe.cuisine}`.toLowerCase().includes(q));
  }, [activeFilter, fridgeItems, isFavorite, query, recipes, slot, weekSlots]);

  return (
    <div className={cn("fixed inset-0 z-40 transition", open ? "pointer-events-auto" : "pointer-events-none")}>
      <div className={cn("absolute inset-0 bg-[#2c2416]/30 transition", open ? "opacity-100" : "opacity-0")} onClick={onClose} />
      <aside
        className={cn(
          "absolute bottom-0 left-0 right-0 flex max-h-[90dvh] flex-col rounded-t-[28px] border border-nourish-border bg-nourish-card transition lg:bottom-4 lg:left-auto lg:right-4 lg:top-4 lg:max-h-[min(92vh,800px)] lg:w-[440px] lg:rounded-[28px]",
          open ? "translate-y-0" : "translate-y-full lg:translate-x-full lg:translate-y-0",
        )}
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-nourish-border/70 px-5 pb-4 pt-5 lg:rounded-t-[28px] lg:border-b-0">
          <h2 className="text-xl font-semibold text-nourish-ink sm:text-2xl">Swap this meal</h2>
          <button type="button" onClick={onClose} className="shrink-0 rounded-full p-2.5 text-nourish-muted hover:bg-nourish-bg hover:text-nourish-ink" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6">
          <div className="mb-4 rounded-2xl bg-nourish-bg p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-nourish-muted">
              <ArrowRightLeft size={14} aria-hidden />
              Current pick
            </div>
            <h3 className="text-lg text-nourish-ink">{currentRecipe?.name ?? "Open slot"}</h3>
            {slot ? <p className="mt-2 text-sm text-nourish-muted">{slot.dayOfWeek} · {slot.mealType}</p> : null}
          </div>

          <div className="-mx-1 mb-4 flex gap-2 overflow-x-auto px-1 pb-1">
            {filters.map((filter) => (
              <div key={filter} className="shrink-0">
                <TagPill active={activeFilter === filter} onClick={() => setActiveFilter(filter)}>
                  {filter}
                </TagPill>
              </div>
            ))}
          </div>

          <div className="relative mb-4">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-nourish-muted" />
            <input className="input pl-10" placeholder="Search recipes" value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>

          {visibleRecipes.length === 0 ? (
            <p className="mb-4 rounded-2xl border border-dashed border-nourish-border bg-nourish-bg/60 px-4 py-6 text-center text-sm text-nourish-muted">
              No recipes match this filter for this slot. Try <strong className="text-nourish-ink">All suggestions</strong> or another tab.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {visibleRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} compact />
              ))}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
