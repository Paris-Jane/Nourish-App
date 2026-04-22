import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { StepList } from "components/StepList";
import { TagPill } from "components/TagPill";
import { useRecipes } from "hooks/useAppData";
import { useToast } from "hooks/useToast";

export function RecipeDetailPage() {
  const { id } = useParams();
  const { recipes } = useRecipes();
  const { pushToast } = useToast();
  const [tab, setTab] = useState<"Prep ahead" | "Day of">("Prep ahead");
  const recipe = recipes.find((entry) => String(entry.id) === id);

  const prepAheadSteps = useMemo(() => recipe?.steps.filter((step) => step.timingTag === "PrepAhead") ?? [], [recipe]);
  const dayOfSteps = useMemo(() => recipe?.steps.filter((step) => step.timingTag !== "PrepAhead") ?? [], [recipe]);

  if (!recipe) {
    return <div className="card p-8">Recipe not found.</div>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="card overflow-hidden">
        <div className="h-56 bg-gradient-to-br from-nourish-sage/20 via-[#fbf6f0] to-nourish-terracotta/20" />
        <div className="p-6">
          <h1 className="mb-4 text-5xl">{recipe.name}</h1>
          <div className="mb-5 flex flex-wrap gap-2">
            <TagPill tone="warm">{recipe.cuisine}</TagPill>
            <TagPill tone="accent">{recipe.timeTag}</TagPill>
            <TagPill>{recipe.scalabilityTag}</TagPill>
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
          <h2 className="mb-4 text-3xl">Ingredients</h2>
          <div className="space-y-3">
            {recipe.ingredients.length === 0 ? (
              <p className="text-sm text-nourish-muted">No ingredient list has been added to this preview recipe yet.</p>
            ) : (
              recipe.ingredients.map((ingredient) => (
                <div key={ingredient.id} className="rounded-2xl bg-nourish-bg px-4 py-3">
                  <p>{ingredient.ingredientName}</p>
                  <p className="text-sm text-nourish-muted">
                    {ingredient.quantity} {ingredient.unit} {ingredient.isOptional ? "(optional)" : ""}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="mb-4 text-3xl">This week</h2>
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
