import { ArrowLeft, Heart, Plus, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { StepList } from "components/StepList";
import { TagPill } from "components/TagPill";
import { cn } from "lib/utils";
import { useFridgeItems, useIngredients, useRecipes } from "hooks/useAppData";
import { useToast } from "hooks/useToast";
import { useRecipePrefsStore } from "store/recipePrefsStore";

export function RecipeDetailPage() {
  const { id } = useParams();
  const { recipes } = useRecipes();
  const { ingredients } = useIngredients();
  const { items: fridgeItems } = useFridgeItems();
  const { pushToast } = useToast();
  const [tab, setTab] = useState<"Prep ahead" | "Day of">("Prep ahead");
  const [customSearch, setCustomSearch] = useState("");
  const [selectedOptionalIds, setSelectedOptionalIds] = useState<number[]>([]);
  const [customAddOns, setCustomAddOns] = useState<Array<{ id: number; name: string }>>([]);
  const [addOwnOpen, setAddOwnOpen] = useState(false);
  const isFavorite = useRecipePrefsStore((s) => s.isFavorite);
  const toggleFavorite = useRecipePrefsStore((s) => s.toggleFavorite);
  const recipe = recipes.find((entry) => String(entry.id) === id);

  const prepAheadSteps = useMemo(() => recipe?.steps.filter((step) => step.timingTag === "PrepAhead") ?? [], [recipe]);
  const dayOfSteps = useMemo(() => recipe?.steps.filter((step) => step.timingTag !== "PrepAhead") ?? [], [recipe]);
  const coreIngredients = useMemo(() => recipe?.ingredients.filter((ingredient) => !ingredient.isModifier) ?? [], [recipe]);

  const fridgeIngredientIds = useMemo(() => new Set(fridgeItems.map((f) => f.ingredientId)), [fridgeItems]);
  const coreInFridgeCount = useMemo(
    () => coreIngredients.filter((ing) => fridgeIngredientIds.has(ing.ingredientId)).length,
    [coreIngredients, fridgeIngredientIds],
  );
  const optionalIngredients = useMemo(() => recipe?.ingredients.filter((ingredient) => ingredient.isModifier || ingredient.isOptional) ?? [], [recipe]);
  const filteredCustomIngredients = useMemo(() => {
    const query = customSearch.trim().toLowerCase();
    if (!query) return [];

    const excludedIds = new Set([
      ...(recipe?.ingredients.map((ingredient) => ingredient.ingredientId) ?? []),
      ...customAddOns.map((ingredient) => ingredient.id),
    ]);

    return ingredients
      .filter((ingredient) => !excludedIds.has(ingredient.id))
      .filter((ingredient) => ingredient.name.toLowerCase().includes(query))
      .slice(0, 8);
  }, [customAddOns, customSearch, ingredients, recipe]);

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

  const handleToggleOptional = (ingredientId: number) => {
    setSelectedOptionalIds((current) =>
      current.includes(ingredientId) ? current.filter((entry) => entry !== ingredientId) : [...current, ingredientId],
    );
  };

  const handleAddCustomIngredient = (ingredientId: number, ingredientName: string) => {
    setCustomAddOns((current) => [...current, { id: ingredientId, name: ingredientName }]);
    pushToast(`${ingredientName} added as a custom add-on.`);
  };

  const handleRemoveCustomIngredient = (ingredientId: number) => {
    const ingredient = customAddOns.find((entry) => entry.id === ingredientId);
    setCustomAddOns((current) => current.filter((entry) => entry.id !== ingredientId));
    if (ingredient) pushToast(`${ingredient.name} removed.`);
  };

  const activeSteps = tab === "Prep ahead" ? prepAheadSteps : dayOfSteps;

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-32 lg:pb-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/recipes"
          className="inline-flex items-center gap-2 rounded-full border border-nourish-border bg-white px-3 py-2 text-sm font-medium text-nourish-ink shadow-sm transition hover:border-nourish-sage/40 hover:bg-nourish-bg"
        >
          <ArrowLeft size={18} aria-hidden />
          Back to recipes
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <Link to={`/recipes/${recipe.id}/edit`} className="rounded-full border border-nourish-border bg-white px-3 py-2 text-sm font-medium text-nourish-muted transition hover:border-nourish-sage/40 hover:text-nourish-ink">
            Edit recipe
          </Link>
          <button
            type="button"
            onClick={() => {
              toggleFavorite(recipe.id);
              const now = useRecipePrefsStore.getState().isFavorite(recipe.id);
              pushToast(now ? "Saved to favorites." : "Removed from favorites.");
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
      </div>

      <div className="card overflow-hidden">
        <div className="h-24 bg-gradient-to-br from-nourish-sage/20 via-[#fbf6f0] to-nourish-terracotta/20 sm:h-28 md:h-32" />
        <div className="p-6">
          <h1 className="mb-4 text-3xl font-semibold tracking-tight text-nourish-ink sm:text-4xl md:text-5xl">{recipe.name}</h1>
          <div className="flex flex-wrap gap-2">
            <TagPill tone="warm">{recipe.cuisine}</TagPill>
            <TagPill tone="accent">{recipe.timeTag}</TagPill>
            <TagPill>{recipe.scalabilityTag}</TagPill>
            {recipe.mealTypeTags.map((mealType) => (
              <TagPill key={mealType}>{mealType}</TagPill>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="mb-4 text-2xl font-semibold sm:text-3xl">Core ingredients</h2>
        {coreIngredients.length === 0 ? (
          <p className="text-sm text-nourish-muted">No ingredient list has been added to this preview recipe yet.</p>
        ) : (
          <>
            <div className="mb-4 rounded-2xl border border-amber-200/90 bg-amber-50/90 px-4 py-3 text-sm text-amber-950">
              <span className="font-semibold">Your kitchen: </span>
              {coreInFridgeCount === 0 ? (
                <span className="text-amber-900/95">
                  None of these core ingredients are on your Fridge list yet. Add them under Fridge to see matches here.
                </span>
              ) : (
                <span className="text-amber-900/95">
                  You have <strong>{coreInFridgeCount}</strong> of <strong>{coreIngredients.length}</strong> core ingredients
                  on hand. Matching rows are highlighted below.
                </span>
              )}
            </div>
            <ul className="space-y-2 text-sm">
              {coreIngredients.map((ingredient) => {
                const inFridge = fridgeIngredientIds.has(ingredient.ingredientId);
                return (
                  <li
                    key={ingredient.id}
                    className={cn(
                      "flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 rounded-xl px-3 py-2.5",
                      inFridge ? "bg-amber-50 ring-1 ring-amber-200/90" : "bg-nourish-bg/30",
                    )}
                  >
                    <span className="font-medium text-nourish-ink">{ingredient.ingredientName}</span>
                    <span className="shrink-0 text-nourish-muted">
                      {ingredient.quantity} {ingredient.unit}
                    </span>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>

      <div className="card p-6">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold sm:text-3xl">Optional add-ons</h2>
          <p className="mt-1 text-sm text-nourish-muted">Tap to include an extra, or open Add your own to search the pantry.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {optionalIngredients.map((ingredient) => {
            const active = selectedOptionalIds.includes(ingredient.ingredientId);
            return (
              <TagPill key={ingredient.id} active={active} onClick={() => handleToggleOptional(ingredient.ingredientId)}>
                {ingredient.ingredientName}
              </TagPill>
            );
          })}
          <TagPill active={addOwnOpen} onClick={() => setAddOwnOpen((o) => !o)}>
            Add your own
          </TagPill>
        </div>

        {addOwnOpen ? (
          <div className="mt-5 space-y-3 border-t border-nourish-border pt-5">
            <input
              className="input"
              placeholder="Search ingredients to add"
              value={customSearch}
              onChange={(event) => setCustomSearch(event.target.value)}
            />

            {filteredCustomIngredients.length > 0 ? (
              <div className="rounded-2xl border border-nourish-border bg-nourish-bg/40 p-2">
                <div className="space-y-1">
                  {filteredCustomIngredients.map((ingredient) => (
                    <button
                      key={ingredient.id}
                      type="button"
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm text-nourish-ink transition hover:bg-white"
                      onClick={() => handleAddCustomIngredient(ingredient.id, ingredient.name)}
                    >
                      <span>{ingredient.name}</span>
                      <Plus size={16} aria-hidden className="text-nourish-sage" />
                    </button>
                  ))}
                </div>
              </div>
            ) : customSearch.trim().length > 0 ? (
              <p className="text-sm text-nourish-muted">No matching ingredients found.</p>
            ) : null}

            {customAddOns.length > 0 ? (
              <div className="space-y-2 rounded-2xl bg-nourish-bg p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-nourish-muted">Added to this version</p>
                <div className="flex flex-wrap gap-2">
                  {customAddOns.map((ingredient) => (
                    <button
                      key={ingredient.id}
                      type="button"
                      className="inline-flex items-center gap-1 rounded-full border border-nourish-border bg-white px-3 py-1.5 text-xs font-medium text-nourish-ink"
                      onClick={() => handleRemoveCustomIngredient(ingredient.id)}
                    >
                      {ingredient.name}
                      <X size={12} aria-hidden />
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="card p-6">
        <h2 className="mb-4 text-2xl font-semibold sm:text-3xl">Steps</h2>
        <div className="mb-5 flex gap-2 rounded-2xl bg-nourish-bg p-1">
          {(["Prep ahead", "Day of"] as const).map((entry) => {
            const active = tab === entry;
            return (
              <button
                key={entry}
                type="button"
                onClick={() => setTab(entry)}
                className={cn(
                  "flex-1 rounded-2xl px-4 py-3 text-sm font-medium transition",
                  active ? "bg-nourish-sage text-white shadow-sm ring-2 ring-nourish-sage/40" : "text-nourish-muted hover:text-nourish-ink",
                )}
              >
                {entry}
              </button>
            );
          })}
        </div>
        {activeSteps.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-nourish-border bg-nourish-bg/50 px-4 py-6 text-center text-sm text-nourish-muted">
            No steps in this section yet.
          </p>
        ) : (
          <StepList steps={activeSteps} />
        )}
      </div>

      <div className="fixed bottom-[5.75rem] left-0 right-0 z-20 border-t border-nourish-border bg-nourish-card/95 px-4 py-3 shadow-[0_-4px_24px_rgba(44,36,22,0.08)] backdrop-blur-md lg:static lg:z-0 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:shadow-none lg:backdrop-blur-none">
        <div className="mx-auto max-w-4xl">
          <button type="button" className="button-primary w-full" onClick={() => pushToast("Added to this week (preview).")}>
            Add to this week
          </button>
        </div>
      </div>
    </div>
  );
}
