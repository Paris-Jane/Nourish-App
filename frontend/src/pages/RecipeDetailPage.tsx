import { ArrowLeft, Heart } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { StepList } from "components/StepList";
import { TagPill } from "components/TagPill";
import { cn } from "lib/utils";
import { useRecipes } from "hooks/useAppData";
import { useToast } from "hooks/useToast";
import { useRecipePrefsStore } from "store/recipePrefsStore";

export function RecipeDetailPage() {
  const { id } = useParams();
  const { recipes } = useRecipes();
  const { pushToast } = useToast();
  const [tab, setTab] = useState<"Prep ahead" | "Day of">("Prep ahead");
  const isFavorite = useRecipePrefsStore((s) => s.isFavorite);
  const toggleFavorite = useRecipePrefsStore((s) => s.toggleFavorite);
  const recipe = recipes.find((entry) => String(entry.id) === id);

  const prepAheadSteps = useMemo(() => recipe?.steps.filter((step) => step.timingTag === "PrepAhead") ?? [], [recipe]);
  const dayOfSteps = useMemo(() => recipe?.steps.filter((step) => step.timingTag !== "PrepAhead") ?? [], [recipe]);

  if (!recipe) {
    return (
      <div className="card p-8">
        <p className="mb-4">Recipe not found.</p>
        <Link to="/recipes" className="inline-flex items-center gap-2 text-sm font-medium text-nourish-sage underline-offset-4 hover:underline">
          <ArrowLeft size={16} aria-hidden />
          Back to recipes
        </Link>
      </div>
    );
  }

  const favorited = isFavorite(recipe.id);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/recipes"
          className="inline-flex items-center gap-2 rounded-full border border-nourish-border bg-white px-3 py-2 text-sm font-medium text-nourish-ink shadow-sm transition hover:border-nourish-sage/40 hover:bg-nourish-bg"
        >
          <ArrowLeft size={18} aria-hidden />
          Back to recipes
        </Link>
        <button
          type="button"
          onClick={() => {
            toggleFavorite(recipe.id);
            pushToast(favorited ? "Removed from favorites." : "Saved to favorites.");
          }}
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition",
            favorited
              ? "border-nourish-terracotta/40 bg-nourish-terracotta/10 text-nourish-terracotta"
              : "border-nourish-border bg-white text-nourish-muted hover:border-nourish-sage/40 hover:text-nourish-ink",
          )}
          aria-pressed={favorited}
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart size={18} className={favorited ? "fill-current" : ""} aria-hidden />
          {favorited ? "Favorited" : "Favorite"}
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="h-36 bg-gradient-to-br from-nourish-sage/20 via-[#fbf6f0] to-nourish-terracotta/20 sm:h-44 md:h-52" />
        <div className="p-6">
          <h1 className="mb-4 text-3xl font-semibold tracking-tight text-nourish-ink sm:text-4xl md:text-5xl">{recipe.name}</h1>
          <div className="mb-5 flex flex-wrap gap-2">
            <TagPill tone="warm">{recipe.cuisine}</TagPill>
            <TagPill tone="accent">{recipe.timeTag}</TagPill>
            <TagPill>{recipe.scalabilityTag}</TagPill>
            {recipe.mealTypeTags.map((mealType) => (
              <TagPill key={mealType}>{mealType}</TagPill>
            ))}
          </div>
          <div className="flex gap-2 rounded-2xl bg-nourish-bg p-1">
            {(["Prep ahead", "Day of"] as const).map((entry) => (
              <button
                key={entry}
                type="button"
                onClick={() => setTab(entry)}
                className={`rounded-2xl px-4 py-3 text-sm ${tab === entry ? "bg-white shadow-sm" : "text-nourish-muted"}`}
              >
                {entry}
              </button>
            ))}
          </div>
          <div className="mt-5">{tab === "Prep ahead" ? <StepList steps={prepAheadSteps} /> : <StepList steps={dayOfSteps} />}</div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="card p-6">
          <h2 className="mb-4 text-2xl font-semibold sm:text-3xl">Ingredients</h2>
          {recipe.ingredients.length === 0 ? (
            <p className="text-sm text-nourish-muted">No ingredient list has been added to this preview recipe yet.</p>
          ) : (
            <ul className="divide-y divide-nourish-border text-sm">
              {recipe.ingredients.map((ingredient) => (
                <li key={ingredient.id} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 py-2.5 first:pt-0">
                  <span className="font-medium text-nourish-ink">{ingredient.ingredientName}</span>
                  <span className="shrink-0 text-nourish-muted">
                    {ingredient.quantity} {ingredient.unit}
                    {ingredient.isOptional ? " · optional" : ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card p-6">
          <h2 className="mb-4 text-2xl font-semibold sm:text-3xl">This week</h2>
          <button className="button-primary mb-3 w-full" onClick={() => pushToast("Adding into the week grid is the next small wiring step.")}>
            Add to this week
          </button>
          <Link to={`/recipes/${recipe.id}/edit`} className="text-sm text-nourish-muted underline underline-offset-4">
            Edit recipe
          </Link>
        </div>
      </div>
    </div>
  );
}
