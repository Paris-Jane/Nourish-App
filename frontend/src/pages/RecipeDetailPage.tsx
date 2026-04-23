import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Heart, Plus, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { addRecipeModifier, getRecipePreference, removeRecipeModifier, upsertRecipePreference } from "api/recipes";
import { StepList } from "components/StepList";
import { TagPill } from "components/TagPill";
import { useIngredients, useRecipes } from "hooks/useAppData";
import { useToast } from "hooks/useToast";
import { mockRecipePrefs } from "lib/mockData";
import { cn } from "lib/utils";
import { useRecipePrefsStore } from "store/recipePrefsStore";
import type { UserRecipePref } from "types/models";

const emptyPreference = (recipeId: number): UserRecipePref => ({
  id: 0,
  recipeId,
  isFavorite: false,
  isDisliked: false,
  selectedModifierIngredientIds: [],
  lastUsedAt: null,
});

export function RecipeDetailPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { recipes } = useRecipes();
  const { ingredients } = useIngredients();
  const { pushToast } = useToast();
  const [tab, setTab] = useState<"Prep ahead" | "Day of">("Prep ahead");
  const [customSearch, setCustomSearch] = useState("");
  const [selectedOptionalIds, setSelectedOptionalIds] = useState<number[]>([]);
  const isFavorite = useRecipePrefsStore((s) => s.isFavorite);
  const toggleFavorite = useRecipePrefsStore((s) => s.toggleFavorite);
  const recipe = recipes.find((entry) => String(entry.id) === id);

  const prefQuery = useQuery({
    queryKey: ["recipe-preferences", recipe?.id],
    queryFn: () => getRecipePreference(recipe!.id),
    enabled: !!recipe,
    retry: false,
  });

  const preference = recipe ? prefQuery.data ?? mockRecipePrefs[recipe.id] ?? emptyPreference(recipe.id) : null;

  useEffect(() => {
    if (!preference) return;
    setSelectedOptionalIds(preference.selectedModifierIngredientIds ?? []);
  }, [preference]);

  const prepAheadSteps = useMemo(() => recipe?.steps.filter((step) => step.timingTag === "PrepAhead") ?? [], [recipe]);
  const dayOfSteps = useMemo(() => recipe?.steps.filter((step) => step.timingTag !== "PrepAhead") ?? [], [recipe]);
  const coreIngredients = useMemo(() => recipe?.ingredients.filter((ingredient) => !ingredient.isModifier) ?? [], [recipe]);
  const optionalIngredients = useMemo(() => recipe?.ingredients.filter((ingredient) => ingredient.isModifier || ingredient.isOptional) ?? [], [recipe]);
  const customAddedModifiers = useMemo(
    () =>
      optionalIngredients.filter((ingredient) =>
        (ingredient.notes ?? "").toLowerCase().includes("added from recipe detail add-ons"),
      ),
    [optionalIngredients],
  );

  const filteredCustomIngredients = useMemo(() => {
    const query = customSearch.trim().toLowerCase();
    if (!query) return [];

    const excludedIds = new Set(recipe?.ingredients.map((ingredient) => ingredient.ingredientId) ?? []);

    return ingredients
      .filter((ingredient) => !excludedIds.has(ingredient.id))
      .filter((ingredient) => ingredient.name.toLowerCase().includes(query))
      .slice(0, 8);
  }, [customSearch, ingredients, recipe]);

  const saveSelectionMutation = useMutation({
    mutationFn: (nextSelectedIds: number[]) =>
      upsertRecipePreference(recipe!.id, { selectedModifierIngredientIds: nextSelectedIds }),
    onSuccess: (data) => {
      queryClient.setQueryData(["recipe-preferences", recipe?.id], data);
    },
  });

  const addModifierMutation = useMutation({
    mutationFn: ({ ingredientId, ingredientName }: { ingredientId: number; ingredientName: string }) =>
      addRecipeModifier(recipe!.id, { ingredientId, notes: "Added from recipe detail add-ons" }).then((result) => ({
        result,
        ingredientName,
      })),
    onSuccess: async ({ result, ingredientName }) => {
      await queryClient.invalidateQueries({ queryKey: ["recipes"] });
      const nextSelectedIds = Array.from(new Set([...selectedOptionalIds, result.ingredientId]));
      setSelectedOptionalIds(nextSelectedIds);
      try {
        const data = await upsertRecipePreference(recipe!.id, { selectedModifierIngredientIds: nextSelectedIds });
        queryClient.setQueryData(["recipe-preferences", recipe?.id], data);
      } catch {
        // preview/local fallback
      }
      setCustomSearch("");
      pushToast(`${ingredientName} added to optional add-ons.`);
    },
  });

  const removeModifierMutation = useMutation({
    mutationFn: ({ recipeIngredientId, ingredientId, ingredientName }: { recipeIngredientId: number; ingredientId: number; ingredientName: string }) =>
      removeRecipeModifier(recipe!.id, recipeIngredientId).then(() => ({ ingredientId, ingredientName })),
    onSuccess: async ({ ingredientId, ingredientName }) => {
      const nextSelectedIds = selectedOptionalIds.filter((id) => id !== ingredientId);
      setSelectedOptionalIds(nextSelectedIds);
      await queryClient.invalidateQueries({ queryKey: ["recipes"] });
      try {
        const data = await upsertRecipePreference(recipe!.id, { selectedModifierIngredientIds: nextSelectedIds });
        queryClient.setQueryData(["recipe-preferences", recipe?.id], data);
      } catch {
        // preview/local fallback
      }
      pushToast(`${ingredientName} removed from optional add-ons.`);
    },
  });

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

  const handleToggleOptional = async (ingredientId: number) => {
    const ingredient = optionalIngredients.find((entry) => entry.ingredientId === ingredientId);
    const nextSelected = selectedOptionalIds.includes(ingredientId)
      ? selectedOptionalIds.filter((id) => id !== ingredientId)
      : [...selectedOptionalIds, ingredientId];

    setSelectedOptionalIds(nextSelected);

    try {
      const data = await saveSelectionMutation.mutateAsync(nextSelected);
      queryClient.setQueryData(["recipe-preferences", recipe.id], data);
      if (ingredient) {
        pushToast(
          nextSelected.includes(ingredientId)
            ? `${ingredient.ingredientName} saved for this recipe.`
            : `${ingredient.ingredientName} removed from this saved version.`,
        );
      }
    } catch {
      if (ingredient) {
        pushToast(
          nextSelected.includes(ingredientId)
            ? `${ingredient.ingredientName} selected in preview.`
            : `${ingredient.ingredientName} removed in preview.`,
        );
      }
    }
  };

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
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <button
              className="button-primary"
              onClick={() => pushToast("Adding into the week grid is the next small wiring step.")}
            >
              Add to this week
            </button>
            <Link to={`/recipes/${recipe.id}/edit`} className="text-sm text-nourish-muted underline underline-offset-4">
              Edit recipe
            </Link>
          </div>
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

      <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="card p-6">
          <h2 className="mb-4 text-2xl font-semibold sm:text-3xl">Core ingredients</h2>
          {coreIngredients.length === 0 ? (
            <p className="text-sm text-nourish-muted">No ingredient list has been added to this preview recipe yet.</p>
          ) : (
            <ul className="divide-y divide-nourish-border text-sm">
              {coreIngredients.map((ingredient) => (
                <li key={ingredient.id} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 py-2.5 first:pt-0">
                  <span className="font-medium text-nourish-ink">{ingredient.ingredientName}</span>
                  <span className="shrink-0 text-nourish-muted">
                    {ingredient.quantity} {ingredient.unit}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold sm:text-3xl">Optional add-ons</h2>
              <p className="mt-1 text-sm text-nourish-muted">Tap to include an extra. Your choices are saved for this recipe.</p>
            </div>
            {optionalIngredients.length === 0 ? (
              <p className="text-sm text-nourish-muted">No optional add-ons have been added to this recipe yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {optionalIngredients.map((ingredient) => {
                  const active = selectedOptionalIds.includes(ingredient.ingredientId);
                  return (
                    <TagPill
                      key={ingredient.id}
                      active={active}
                      onClick={() => void handleToggleOptional(ingredient.ingredientId)}
                    >
                      {ingredient.ingredientName}
                    </TagPill>
                  );
                })}
              </div>
            )}
          </div>

          <div className="card p-6">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold sm:text-3xl">Add your own</h2>
                <p className="mt-1 text-sm text-nourish-muted">Search ingredients and save them as optional add-ons on this recipe.</p>
              </div>
              <Link to={`/recipes/${recipe.id}/edit`} className="text-sm text-nourish-muted underline underline-offset-4">
                Edit add-ons
              </Link>
            </div>
            <div className="space-y-3">
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
                        onClick={() => addModifierMutation.mutate({ ingredientId: ingredient.id, ingredientName: ingredient.name })}
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

              {customAddedModifiers.length > 0 ? (
                <div className="space-y-2 rounded-2xl bg-nourish-bg p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-nourish-muted">Custom add-ons on this recipe</p>
                  <div className="flex flex-wrap gap-2">
                    {customAddedModifiers.map((ingredient) => (
                      <button
                        key={ingredient.id}
                        type="button"
                        className="inline-flex items-center gap-1 rounded-full border border-nourish-border bg-white px-3 py-1.5 text-xs font-medium text-nourish-ink"
                        onClick={() =>
                          removeModifierMutation.mutate({
                            recipeIngredientId: ingredient.id,
                            ingredientId: ingredient.ingredientId,
                            ingredientName: ingredient.ingredientName,
                          })
                        }
                      >
                        {ingredient.ingredientName}
                        <X size={12} aria-hidden />
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
