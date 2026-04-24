import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Heart, Pencil, Plus, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createIngredient } from "api/ingredients";
import { addRecipeModifier, getRecipePreference, removeRecipeModifier, upsertRecipePreference } from "api/recipes";
import { StepList } from "components/StepList";
import { TagPill } from "components/TagPill";
import { useIngredients, useRecipes } from "hooks/useAppData";
import { useToast } from "hooks/useToast";
import { mockIngredients, mockRecipePrefs } from "lib/mockData";
import { cn } from "lib/utils";
import { useRecipePrefsStore } from "store/recipePrefsStore";
import type { Ingredient, Recipe, RecipeIngredient, UserRecipePref } from "types/models";

const emptyPreference = (recipeId: number): UserRecipePref => ({
  id: 0,
  recipeId,
  isFavorite: false,
  isDisliked: false,
  selectedModifierIngredientIds: [],
  lastUsedAt: null,
});

function upsertRecipeInCache(recipes: Recipe[] | undefined, recipeId: number, updater: (recipe: Recipe) => Recipe) {
  if (!recipes) return recipes;
  return recipes.map((recipe) => (recipe.id === recipeId ? updater(recipe) : recipe));
}

export function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { recipes } = useRecipes();
  const { ingredients } = useIngredients();
  const { pushToast } = useToast();
  const [tab, setTab] = useState<"Prep ahead" | "Day of">("Prep ahead");
  const [showAddSearch, setShowAddSearch] = useState(false);
  const [customSearch, setCustomSearch] = useState("");
  const [selectedOptionalIds, setSelectedOptionalIds] = useState<number[]>([]);
  const [editingIngredientId, setEditingIngredientId] = useState<number | null>(null);
  const [editorQuantity, setEditorQuantity] = useState("");
  const [editorUnit, setEditorUnit] = useState("");
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
  const optionalIngredients = useMemo(
    () => recipe?.ingredients.filter((ingredient) => ingredient.isModifier || ingredient.isOptional) ?? [],
    [recipe],
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

  const editingIngredient = useMemo(
    () => optionalIngredients.find((ingredient) => ingredient.ingredientId === editingIngredientId) ?? null,
    [editingIngredientId, optionalIngredients],
  );

  useEffect(() => {
    if (!editingIngredient) return;
    setEditorQuantity(String(editingIngredient.quantity));
    setEditorUnit(editingIngredient.unit);
  }, [editingIngredient]);

  const saveSelectionMutation = useMutation({
    mutationFn: (nextSelectedIds: number[]) =>
      upsertRecipePreference(recipe!.id, { selectedModifierIngredientIds: nextSelectedIds }),
    onSuccess: (data) => {
      queryClient.setQueryData(["recipe-preferences", recipe?.id], data);
    },
  });

  const addModifierMutation = useMutation({
    mutationFn: ({
      ingredientId,
      ingredientName,
      quantity,
      unit,
    }: {
      ingredientId: number;
      ingredientName: string;
      quantity?: number;
      unit?: string;
    }) =>
      addRecipeModifier(recipe!.id, {
        ingredientId,
        quantity,
        unit,
        notes: "Added from recipe detail add-ons",
      }).then((result) => ({
        result,
        ingredientName,
      })),
    onSuccess: async ({ result, ingredientName }) => {
      queryClient.setQueryData<Recipe[]>(["recipes"], (current) =>
        upsertRecipeInCache(current, recipe!.id, (entry) => ({
          ...entry,
          ingredients: entry.ingredients.some((ingredient) => ingredient.id === result.id)
            ? entry.ingredients.map((ingredient) => (ingredient.id === result.id ? result : ingredient))
            : [...entry.ingredients, result],
        })),
      );
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
      setShowAddSearch(false);
      setEditingIngredientId(result.ingredientId);
      pushToast(`${ingredientName} added to optional add-ons.`);
    },
  });

  const createIngredientMutation = useMutation({
    mutationFn: async (name: string) => {
      const trimmed = name.trim();
      const created = await createIngredient({
        name: trimmed,
        foodGroup: "Other",
        servingSize: 1,
        servingUnit: "serving",
        purchaseUnit: "item",
        defaultLocation: "Pantry",
        storeSection: "Other",
        isPerishable: false,
        isFlexibleGroup: false,
        isMyPlateCounted: false,
        shelfLifeDays: 180,
        notes: "Created from recipe detail add-ons",
      });
      return created;
    },
    onSuccess: async (ingredient) => {
      queryClient.setQueryData<Ingredient[]>(["ingredients"], (current) => {
        const existing = current ?? mockIngredients;
        return existing.some((item) => item.id === ingredient.id) ? existing : [...existing, ingredient];
      });
      await addModifierMutation.mutateAsync({
        ingredientId: ingredient.id,
        ingredientName: ingredient.name,
        quantity: 1,
        unit: ingredient.servingUnit || "serving",
      });
      pushToast(`${ingredient.name} created and added.`);
    },
  });

  const removeModifierMutation = useMutation({
    mutationFn: ({
      recipeIngredientId,
      ingredientId,
      ingredientName,
    }: {
      recipeIngredientId: number;
      ingredientId: number;
      ingredientName: string;
    }) => removeRecipeModifier(recipe!.id, recipeIngredientId).then(() => ({ ingredientId, ingredientName, recipeIngredientId })),
    onSuccess: async ({ ingredientId, ingredientName, recipeIngredientId }) => {
      const nextSelectedIds = selectedOptionalIds.filter((item) => item !== ingredientId);
      setSelectedOptionalIds(nextSelectedIds);
      queryClient.setQueryData<Recipe[]>(["recipes"], (current) =>
        upsertRecipeInCache(current, recipe!.id, (entry) => ({
          ...entry,
          ingredients: entry.ingredients.filter((ingredient) => ingredient.id !== recipeIngredientId),
        })),
      );
      await queryClient.invalidateQueries({ queryKey: ["recipes"] });
      try {
        const data = await upsertRecipePreference(recipe!.id, { selectedModifierIngredientIds: nextSelectedIds });
        queryClient.setQueryData(["recipe-preferences", recipe?.id], data);
      } catch {
        // preview/local fallback
      }
      setEditingIngredientId((current) => (current === ingredientId ? null : current));
      pushToast(`${ingredientName} removed from optional add-ons.`);
    },
  });

  if (!recipe) {
    return (
      <div className="card p-8">
        <p className="mb-4">Recipe not found.</p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-medium text-nourish-sage underline-offset-4 hover:underline"
        >
          <ArrowLeft size={16} aria-hidden />
          Back
        </button>
      </div>
    );
  }

  const favorited = isFavorite(recipe.id);

  const handleToggleOptional = async (ingredientId: number) => {
    const ingredient = optionalIngredients.find((entry) => entry.ingredientId === ingredientId);
    const nextSelected = selectedOptionalIds.includes(ingredientId)
      ? selectedOptionalIds.filter((entry) => entry !== ingredientId)
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

  const handleAddExistingIngredient = async (ingredient: Ingredient) => {
    await addModifierMutation.mutateAsync({
      ingredientId: ingredient.id,
      ingredientName: ingredient.name,
      quantity: ingredient.servingSize > 0 ? ingredient.servingSize : 1,
      unit: ingredient.servingUnit || ingredient.purchaseUnit || "serving",
    });
  };

  const handleCreateIngredient = async () => {
    const name = customSearch.trim();
    if (!name) return;
    await createIngredientMutation.mutateAsync(name);
  };

  const handleSaveModifierEdit = async (ingredient: RecipeIngredient) => {
    const quantity = Number(editorQuantity);
    const nextQuantity = Number.isFinite(quantity) && quantity > 0 ? quantity : ingredient.quantity;
    const nextUnit = editorUnit.trim() || ingredient.unit;
    await addModifierMutation.mutateAsync({
      ingredientId: ingredient.ingredientId,
      ingredientName: ingredient.ingredientName,
      quantity: nextQuantity,
      unit: nextUnit,
    });
    setEditingIngredientId(null);
    pushToast(`${ingredient.ingredientName} updated.`);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-full border border-nourish-border bg-white px-3 py-2 text-sm font-medium text-nourish-ink shadow-sm transition hover:border-nourish-sage/40 hover:bg-nourish-bg"
        >
          <ArrowLeft size={18} aria-hidden />
          Back
        </button>
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
            <TagPill tone="cuisine">{recipe.cuisine}</TagPill>
            <TagPill tone="accent">{recipe.timeTag}</TagPill>
            <TagPill>{recipe.scalabilityTag}</TagPill>
            {recipe.mealTypeTags.map((mealType) => (
              <TagPill key={mealType}>{mealType}</TagPill>
            ))}
          </div>
          <p className="text-sm leading-relaxed text-nourish-muted">
            Build the version you actually want this week by choosing optional add-ons below. Those choices can flow into groceries and MyPlate once the week is planned.
          </p>
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
              <p className="mt-1 text-sm text-nourish-muted">Tap an add-on to include it. Click the pencil on a custom add-on if you want to adjust it.</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {optionalIngredients.map((ingredient) => {
                const active = selectedOptionalIds.includes(ingredient.ingredientId);
                const isCustom = (ingredient.notes ?? "").toLowerCase().includes("added from recipe detail add-ons");
                return (
                  <div key={ingredient.id} className="flex items-center gap-1 rounded-full">
                    <TagPill active={active} onClick={() => void handleToggleOptional(ingredient.ingredientId)}>
                      {ingredient.ingredientName}
                    </TagPill>
                    {isCustom ? (
                      <>
                        <button
                          type="button"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-nourish-border bg-white text-nourish-muted transition hover:border-nourish-sage/40 hover:text-nourish-ink"
                          onClick={() => setEditingIngredientId(ingredient.ingredientId)}
                          aria-label={`Edit ${ingredient.ingredientName}`}
                        >
                          <Pencil size={14} aria-hidden />
                        </button>
                        <button
                          type="button"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-nourish-border bg-white text-nourish-muted transition hover:border-nourish-terracotta/40 hover:text-nourish-terracotta"
                          onClick={() =>
                            removeModifierMutation.mutate({
                              recipeIngredientId: ingredient.id,
                              ingredientId: ingredient.ingredientId,
                              ingredientName: ingredient.ingredientName,
                            })
                          }
                          aria-label={`Remove ${ingredient.ingredientName}`}
                        >
                          <X size={14} aria-hidden />
                        </button>
                      </>
                    ) : null}
                  </div>
                );
              })}

              <button
                type="button"
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border border-dashed px-3 py-1.5 text-xs font-semibold transition",
                  showAddSearch
                    ? "border-nourish-sage bg-nourish-sage/10 text-nourish-sage"
                    : "border-nourish-border bg-white text-nourish-muted hover:border-nourish-sage/35 hover:text-nourish-ink",
                )}
                onClick={() => setShowAddSearch((current) => !current)}
              >
                <Plus size={12} aria-hidden />
                Add your own
              </button>
            </div>

            {showAddSearch ? (
              <div className="mt-4 rounded-2xl border border-nourish-border bg-nourish-bg/40 p-4">
                <div className="relative">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-nourish-muted" />
                  <input
                    className="input pl-10"
                    placeholder="Search ingredients or create a new one"
                    value={customSearch}
                    onChange={(event) => setCustomSearch(event.target.value)}
                  />
                </div>

                {filteredCustomIngredients.length > 0 ? (
                  <div className="mt-3 space-y-2">
                    {filteredCustomIngredients.map((ingredient) => (
                      <button
                        key={ingredient.id}
                        type="button"
                        className="flex w-full items-center justify-between rounded-xl border border-nourish-border bg-white px-3 py-2 text-left text-sm text-nourish-ink transition hover:border-nourish-sage/40 hover:bg-nourish-bg"
                        onClick={() => void handleAddExistingIngredient(ingredient)}
                      >
                        <span>{ingredient.name}</span>
                        <span className="text-xs text-nourish-muted">
                          {ingredient.servingSize} {ingredient.servingUnit}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : null}

                {customSearch.trim().length > 0 ? (
                  <button
                    type="button"
                    className="mt-3 flex w-full items-center justify-between rounded-xl border border-dashed border-nourish-sage/40 bg-white px-3 py-3 text-left text-sm text-nourish-ink transition hover:bg-nourish-bg"
                    onClick={() => void handleCreateIngredient()}
                    disabled={createIngredientMutation.isPending || addModifierMutation.isPending}
                  >
                    <span>
                      Add <strong>{customSearch.trim()}</strong> as a new ingredient
                    </span>
                    <Plus size={16} aria-hidden className="text-nourish-sage" />
                  </button>
                ) : null}
              </div>
            ) : null}

            {editingIngredient ? (
              <div className="mt-4 rounded-2xl border border-nourish-border bg-white p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-nourish-muted">Edit add-on</p>
                    <h3 className="mt-1 text-base font-semibold text-nourish-ink">{editingIngredient.ingredientName}</h3>
                  </div>
                  <button
                    type="button"
                    className="rounded-full border border-nourish-border p-2 text-nourish-muted transition hover:border-nourish-terracotta/40 hover:text-nourish-terracotta"
                    onClick={() =>
                      removeModifierMutation.mutate({
                        recipeIngredientId: editingIngredient.id,
                        ingredientId: editingIngredient.ingredientId,
                        ingredientName: editingIngredient.ingredientName,
                      })
                    }
                    aria-label={`Remove ${editingIngredient.ingredientName}`}
                  >
                    <X size={16} aria-hidden />
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-[120px,1fr]">
                  <label className="space-y-1 text-sm text-nourish-muted">
                    <span>Quantity</span>
                    <input
                      className="input"
                      inputMode="decimal"
                      value={editorQuantity}
                      onChange={(event) => setEditorQuantity(event.target.value)}
                    />
                  </label>
                  <label className="space-y-1 text-sm text-nourish-muted">
                    <span>Unit</span>
                    <input
                      className="input"
                      value={editorUnit}
                      onChange={(event) => setEditorUnit(event.target.value)}
                    />
                  </label>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    className="button-primary"
                    onClick={() => void handleSaveModifierEdit(editingIngredient)}
                    disabled={addModifierMutation.isPending}
                  >
                    Save add-on
                  </button>
                  <button type="button" className="button-secondary" onClick={() => setEditingIngredientId(null)}>
                    Done
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="card p-6">
        <div className="mb-4 flex gap-2 rounded-2xl bg-nourish-bg p-1">
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
        <div>{tab === "Prep ahead" ? <StepList steps={prepAheadSteps} /> : <StepList steps={dayOfSteps} />}</div>
      </div>
    </div>
  );
}
