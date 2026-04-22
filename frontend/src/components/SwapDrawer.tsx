import { useMemo, useState } from "react";
import { ArrowRightLeft, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { mockRecipePrefs } from "lib/mockData";
import { cn } from "lib/utils";
import { RecipeCard } from "./RecipeCard";
import { TagPill } from "./TagPill";
import type { FridgeItem, Recipe, WeekMealSlot } from "types/models";

const filters = ["Expiring soon", "In your fridge", "Ingredient overlap", "Favorites", "Recent"];

interface SwapDrawerProps {
  open: boolean;
  slot?: WeekMealSlot;
  recipes: Recipe[];
  fridgeItems?: FridgeItem[];
  weekSlots?: WeekMealSlot[];
  onClose: () => void;
}

export function SwapDrawer({ open, slot, recipes, fridgeItems = [], weekSlots = [], onClose }: SwapDrawerProps) {
  const currentRecipe = recipes.find((recipe) => recipe.id === slot?.recipeId);
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const [query, setQuery] = useState("");

  const visibleRecipes = useMemo(() => {
    const fridgeIngredientIds = new Set(fridgeItems.map((item) => item.ingredientId));
    const usedIngredientIds = new Set(
      weekSlots
        .filter((entry) => entry.id !== slot?.id && entry.recipeId)
        .flatMap((entry) => recipes.find((recipe) => recipe.id === entry.recipeId)?.ingredients.map((ingredient) => ingredient.ingredientId) ?? []),
    );

    const filteredByTab = recipes.filter((recipe, index) => {
      const matchesMealType = slot ? recipe.mealTypeTags.includes(slot.mealType) || (slot.mealType === "Dinner" && recipe.mealTypeTags.includes("Lunch")) || (slot.mealType === "Lunch" && recipe.mealTypeTags.includes("Dinner")) : true;
      if (!matchesMealType) return false;

      switch (activeFilter) {
        case "Expiring soon":
        case "In your fridge":
          return recipe.ingredients.some((ingredient) => fridgeIngredientIds.has(ingredient.ingredientId));
        case "Ingredient overlap":
          return recipe.ingredients.some((ingredient) => usedIngredientIds.has(ingredient.ingredientId));
        case "Favorites":
          return mockRecipePrefs[recipe.id]?.isFavorite ?? false;
        case "Recent":
          return index < 4;
        default:
          return true;
      }
    });

    const searched = filteredByTab.filter((recipe) =>
      `${recipe.name} ${recipe.cuisine}`.toLowerCase().includes(query.toLowerCase()),
    );

    return searched.length > 0 ? searched : filteredByTab;
  }, [activeFilter, fridgeItems, query, recipes, slot, weekSlots]);

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
          {slot && <p className="mt-2 text-sm text-nourish-muted">{slot.dayOfWeek} {slot.mealType}</p>}
        </div>
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {filters.map((filter, index) => (
            <TagPill key={filter} active={activeFilter === filter} onClick={() => setActiveFilter(filter)}>
              {filter}
            </TagPill>
          ))}
        </div>
        <div className="relative mb-4">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-nourish-muted" />
          <input className="input pl-10" placeholder="Search or add a recipe" value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3 overflow-y-auto pb-4">
          {visibleRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} compact />
          ))}
        </div>
        <Link to="/recipes/new" className="button-secondary mt-2 w-full" onClick={onClose}>
          Add a new recipe
        </Link>
        <button type="button" onClick={onClose} className="button-secondary mt-4 w-full">
          Keep current
        </button>
      </aside>
    </div>
  );
}
