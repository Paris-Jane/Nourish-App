import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { RecipeCard } from "components/RecipeCard";
import { TagPill } from "components/TagPill";
import { useRecipes } from "hooks/useAppData";

const filters = ["All", "Quick", "Batch-friendly", "Vegetarian", "Freezer-friendly"];

export function RecipesPage() {
  const { recipes } = useRecipes();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = useMemo(
    () =>
      recipes.filter((recipe) => {
        const matchesQuery = recipe.name.toLowerCase().includes(query.toLowerCase()) || recipe.cuisine.toLowerCase().includes(query.toLowerCase());
        const matchesFilter =
          filter === "All" ||
          (filter === "Quick" && recipe.timeTag === "Quick") ||
          (filter === "Batch-friendly" && recipe.prepStyleTag === "BatchFriendly") ||
          (filter === "Freezer-friendly" && recipe.isFreezerFriendly);
        return matchesQuery && matchesFilter;
      }),
    [filter, query, recipes],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl">Recipe Index</h1>
          <p className="text-sm text-nourish-muted">A growing little box of dinner ideas.</p>
        </div>
        <Link to="/recipes/new" className="button-primary">
          Add recipe
        </Link>
      </div>

      <div className="card p-4">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-nourish-muted" />
          <input className="input pl-11" placeholder="Search recipes" value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
        <div className="mt-4 flex gap-2 overflow-x-auto">
          {filters.map((option) => (
            <TagPill key={option} active={filter === option} onClick={() => setFilter(option)}>
              {option}
            </TagPill>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-10 text-center">
          <h2 className="mb-2 text-3xl">No recipes yet</h2>
          <p className="text-nourish-muted">Add your first one and this page will start to feel wonderfully alive.</p>
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
