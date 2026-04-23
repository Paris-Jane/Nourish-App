import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { RecipeCard } from "components/RecipeCard";
import { TagPill } from "components/TagPill";
import { recipeMatchesSearch } from "lib/recipeSearch";
import { useRecipes } from "hooks/useAppData";
import { useRecipePrefsStore } from "store/recipePrefsStore";
import type { MealType, Recipe } from "types/models";

const mealFilters = ["All", "Breakfast", "Lunch", "Dinner", "Snack"] as const;

const extraFilters = [
  "All",
  "Favorites",
  "Quick",
  "Medium",
  "Involved",
  "Batch-friendly",
  "Vegetarian",
  "Freezer-friendly",
] as const;

const meatPattern = /chicken|beef|pork|fish|salmon|turkey|lamb|bacon|sausage|shrimp|anchovy/i;

function isVegetarianRecipe(recipe: Recipe): boolean {
  return !recipe.ingredients.some((ing) => meatPattern.test(ing.ingredientName));
}

function matchesExtraFilter(recipe: Recipe, filter: (typeof extraFilters)[number], isFavorite: (id: number) => boolean): boolean {
  if (filter === "All") return true;
  if (filter === "Favorites") return isFavorite(recipe.id);
  if (filter === "Quick") return recipe.timeTag === "Quick";
  if (filter === "Medium") return recipe.timeTag === "Medium";
  if (filter === "Involved") return recipe.timeTag === "Involved";
  if (filter === "Batch-friendly") return recipe.prepStyleTag === "BatchFriendly";
  if (filter === "Vegetarian") return isVegetarianRecipe(recipe);
  if (filter === "Freezer-friendly") return recipe.isFreezerFriendly;
  return true;
}

export function RecipesPage() {
  const { recipes } = useRecipes();
  const isFavorite = useRecipePrefsStore((s) => s.isFavorite);
  const [query, setQuery] = useState("");
  const [mealFilter, setMealFilter] = useState<(typeof mealFilters)[number]>("All");
  const [extraFilter, setExtraFilter] = useState<(typeof extraFilters)[number]>("All");

  const filtered = useMemo(
    () =>
      recipes.filter((recipe) => {
        const matchesQuery = recipeMatchesSearch(recipe, query);
        const matchesMeal = mealFilter === "All" || recipe.mealTypeTags.includes(mealFilter as MealType);
        const matchesExtra = matchesExtraFilter(recipe, extraFilter, isFavorite);
        return matchesQuery && matchesMeal && matchesExtra;
      }),
    [extraFilter, isFavorite, mealFilter, query, recipes],
  );

  const total = recipes.length;
  const shown = filtered.length;

  const hasActiveFilters = query.trim() !== "" || mealFilter !== "All" || extraFilter !== "All";

  const filterSummary = useMemo(() => {
    const parts: string[] = [];
    if (query.trim()) parts.push(`search “${query.trim()}”`);
    if (mealFilter !== "All") parts.push(`meal ${mealFilter}`);
    if (extraFilter !== "All") parts.push(extraFilter.toLowerCase());
    return parts.join(", ");
  }, [extraFilter, mealFilter, query]);

  return (
    <div className="space-y-6 pb-24">
      <Link
        to="/recipes/new"
        className="fixed right-4 top-[max(5.25rem,env(safe-area-inset-top,0px))] z-30 inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-nourish-sage px-4 py-2.5 text-sm font-semibold text-white shadow-lg ring-2 ring-white/90 transition hover:bg-nourish-sage/90 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nourish-sage lg:right-8 lg:top-28"
      >
        <Plus size={18} aria-hidden />
        Add recipes
      </Link>

      <div className="pr-[11.5rem] sm:pr-[12.5rem] lg:pr-0">
        <h1 className="text-2xl font-semibold tracking-tight text-nourish-ink sm:text-3xl md:text-4xl">Recipe Index</h1>
        <p className="mt-1 text-sm text-nourish-muted">
          {shown === total ? `${total} ${total === 1 ? "recipe" : "recipes"}` : `Showing ${shown} of ${total} ${total === 1 ? "recipe" : "recipes"}`}
        </p>
      </div>

      <div className="sticky top-0 z-10 -mx-1 rounded-2xl border border-transparent bg-[#fbf7f2]/95 px-1 py-2 backdrop-blur-sm lg:static lg:z-0 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
        <div className="card p-4 shadow-sm lg:shadow-none">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-nourish-muted" />
            <input
              className="input pl-11"
              placeholder="Search titles, ingredients, meals, tags…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          <p className="mt-4 text-xs font-medium uppercase tracking-wide text-nourish-muted">Meal</p>
          <div className="-mx-1 mt-2 flex flex-nowrap gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:thin]">
            {mealFilters.map((option) => (
              <div key={`meal-${option}`} className="shrink-0">
                <TagPill active={mealFilter === option} onClick={() => setMealFilter(option)}>
                  {option}
                </TagPill>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs font-medium uppercase tracking-wide text-nourish-muted">Filters</p>
          <div className="-mx-1 mt-2 flex flex-nowrap gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:thin]">
            {extraFilters.map((option) => (
              <div key={`extra-${option}`} className="shrink-0">
                <TagPill active={extraFilter === option} onClick={() => setExtraFilter(option)}>
                  {option}
                </TagPill>
              </div>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-10 text-center">
          <h2 className="mb-2 text-2xl sm:text-3xl">{hasActiveFilters ? "No recipes match" : "No recipes yet"}</h2>
          <p className="text-nourish-muted">
            {hasActiveFilters ? (
              <>
                Nothing matches {filterSummary}. Try clearing search or choosing <strong className="text-nourish-ink">All</strong> in Filters.
              </>
            ) : (
              "Add your first one and this page will start to feel wonderfully alive."
            )}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}
