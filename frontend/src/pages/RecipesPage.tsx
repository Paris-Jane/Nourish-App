import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { RecipeCard } from "components/RecipeCard";
import { TagPill } from "components/TagPill";
import { useRecipes } from "hooks/useAppData";
import type { MealType } from "types/models";

const styleFilters = ["All", "Quick", "Batch-friendly", "Vegetarian", "Freezer-friendly"] as const;
const mealFilters = ["All", "Breakfast", "Lunch", "Dinner"] as const;

const meatPattern = /chicken|beef|pork|fish|salmon|turkey|lamb|bacon|sausage|shrimp|anchovy/i;

function isVegetarianRecipe(recipe: { ingredients: { ingredientName: string }[] }): boolean {
  return !recipe.ingredients.some((ing) => meatPattern.test(ing.ingredientName));
}

export function RecipesPage() {
  const { recipes } = useRecipes();
  const [query, setQuery] = useState("");
  const [styleFilter, setStyleFilter] = useState<(typeof styleFilters)[number]>("All");
  const [mealFilter, setMealFilter] = useState<(typeof mealFilters)[number]>("All");

  const filtered = useMemo(
    () =>
      recipes.filter((recipe) => {
        const matchesQuery =
          recipe.name.toLowerCase().includes(query.toLowerCase()) || recipe.cuisine.toLowerCase().includes(query.toLowerCase());
        const matchesStyle =
          styleFilter === "All" ||
          (styleFilter === "Quick" && recipe.timeTag === "Quick") ||
          (styleFilter === "Batch-friendly" && recipe.prepStyleTag === "BatchFriendly") ||
          (styleFilter === "Freezer-friendly" && recipe.isFreezerFriendly) ||
          (styleFilter === "Vegetarian" && isVegetarianRecipe(recipe));
        const matchesMeal =
          mealFilter === "All" || recipe.mealTypeTags.includes(mealFilter as MealType);
        return matchesQuery && matchesStyle && matchesMeal;
      }),
    [mealFilter, query, recipes, styleFilter],
  );

  const total = recipes.length;
  const shown = filtered.length;

  return (
    <div className="space-y-6 pb-24">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-nourish-ink sm:text-3xl md:text-4xl">Recipe Index</h1>
        <p className="text-sm text-nourish-muted">
          {shown === total ? `${total} ${total === 1 ? "recipe" : "recipes"}` : `Showing ${shown} of ${total} ${total === 1 ? "recipe" : "recipes"}`}
        </p>
        <p className="text-sm text-nourish-muted">A growing little box of dinner ideas.</p>
      </div>

      <div className="card p-4">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-nourish-muted" />
          <input className="input pl-11" placeholder="Search recipes" value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>

        <p className="mt-4 text-xs font-medium uppercase tracking-wide text-nourish-muted">Meal</p>
        <div className="-mx-1 mt-2 flex flex-nowrap gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:thin]">
          {mealFilters.map((option) => (
            <div key={option} className="shrink-0">
              <TagPill active={mealFilter === option} onClick={() => setMealFilter(option)}>
                {option}
              </TagPill>
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs font-medium uppercase tracking-wide text-nourish-muted">Filters</p>
        <div className="-mx-1 mt-2 flex flex-nowrap gap-2 overflow-x-auto px-1 pb-1">
          {styleFilters.map((option) => (
            <div key={option} className="shrink-0">
              <TagPill active={styleFilter === option} onClick={() => setStyleFilter(option)}>
                {option}
              </TagPill>
            </div>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-10 text-center">
          <h2 className="mb-2 text-2xl sm:text-3xl">No recipes yet</h2>
          <p className="text-nourish-muted">Add your first one and this page will start to feel wonderfully alive.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}

      <Link
        to="/recipes/new"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-nourish-sage text-white shadow-lg ring-2 ring-white/80 transition hover:bg-nourish-sage/90 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nourish-sage"
        style={{ marginBottom: "max(0px, env(safe-area-inset-bottom))" }}
        aria-label="Add recipe"
      >
        <Plus size={26} strokeWidth={2.25} />
      </Link>
    </div>
  );
}
