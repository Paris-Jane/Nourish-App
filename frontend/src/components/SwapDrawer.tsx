import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { ArrowRightLeft, Search, X } from "lucide-react";
import { addRecipeModifier } from "api/recipes";
import { swapSlot } from "api/weeks";
import { useToast } from "hooks/useToast";
import { useRecipePrefsStore } from "store/recipePrefsStore";
import { cn, daysUntil } from "lib/utils";
import { useWeekStore } from "store/weekStore";
import { RecipeCard } from "./RecipeCard";
import { TagPill } from "./TagPill";
import type { FridgeItem, Ingredient, Recipe, WeekMealSlot } from "types/models";

const filters = ["All suggestions", "Expiring soon", "In your fridge", "Ingredient overlap", "Favorites", "Recent"] as const;

interface SwapDrawerProps {
  open: boolean;
  slot?: WeekMealSlot;
  recipes: Recipe[];
  ingredients?: Ingredient[];
  fridgeItems?: FridgeItem[];
  weekSlots?: WeekMealSlot[];
  initialTargetIds?: number[];
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

/** When no recipes are tagged for this slot’s meal type, fall back to the full catalog. */
function recipesForSlotOrFallback(recipes: Recipe[], slot: WeekMealSlot | undefined): Recipe[] {
  if (!slot) return recipes;
  const matched = recipes.filter((recipe) => matchesSlotMealType(recipe, slot));
  return matched.length > 0 ? matched : recipes;
}

export function SwapDrawer({
  open,
  slot,
  recipes,
  ingredients = [],
  fridgeItems = [],
  weekSlots = [],
  initialTargetIds,
  onClose,
}: SwapDrawerProps) {
  const queryClient = useQueryClient();
  const { pushToast } = useToast();
  const currentRecipe = recipes.find((recipe) => recipe.id === slot?.recipeId);
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("All suggestions");
  const [query, setQuery] = useState("");
  const [pendingRecipe, setPendingRecipe] = useState<Recipe | null>(null);
  const [selectedTargetIds, setSelectedTargetIds] = useState<number[]>([]);
  const [selectedModifierIds, setSelectedModifierIds] = useState<number[]>([]);
  const [customModifierQuery, setCustomModifierQuery] = useState("");
  const isFavorite = useRecipePrefsStore((s) => s.isFavorite);
  const setSlotOverrides = useWeekStore((state) => state.setSlotOverrides);

  useEffect(() => {
    if (open) {
      setActiveFilter("All suggestions");
      setQuery("");
      setPendingRecipe(null);
      setSelectedTargetIds(initialTargetIds?.length ? initialTargetIds : slot ? [slot.id] : []);
      setSelectedModifierIds(slot?.selectedModifierIngredientIds ?? []);
      setCustomModifierQuery("");
    }
  }, [initialTargetIds, open, slot?.id]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const fridgeIngredientIds = useMemo(() => new Set(fridgeItems.map((item) => item.ingredientId)), [fridgeItems]);

  const usedElsewhereIngredientIds = useMemo(
    () =>
      new Set(
        weekSlots
          .filter((entry) => entry.id !== slot?.id && entry.recipeId)
          .flatMap(
            (entry) => recipes.find((recipe) => recipe.id === entry.recipeId)?.ingredients.map((ingredient) => ingredient.ingredientId) ?? [],
          ),
      ),
    [recipes, slot?.id, weekSlots],
  );

  const eligibleTargetSlots = useMemo(() => {
    if (!slot) return [];

    return weekSlots.filter((entry) => {
      if (entry.mealType !== slot.mealType) return false;
      if (entry.id === slot.id) return true;
      return !entry.isEatingOut && !entry.isSkipped;
    });
  }, [slot, weekSlots]);

  const visibleRecipes = useMemo(() => {
    const pool = recipesForSlotOrFallback(recipes, slot);
    const expiringIngredientIds = new Set(
      fridgeItems
        .filter((fi) => {
          const d = daysUntil(fi.expiresAt);
          return d !== null && d >= 0 && d <= 2;
        })
        .map((fi) => fi.ingredientId),
    );
    const filteredByTab = pool.filter((recipe, index) => {
      switch (activeFilter) {
        case "All suggestions":
          return true;
        case "Expiring soon":
          return recipe.ingredients.some((ingredient) => expiringIngredientIds.has(ingredient.ingredientId));
        case "In your fridge":
          return recipe.ingredients.some((ingredient) => fridgeIngredientIds.has(ingredient.ingredientId));
        case "Ingredient overlap":
          return recipe.ingredients.some((ingredient) => usedElsewhereIngredientIds.has(ingredient.ingredientId));
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
  }, [activeFilter, fridgeIngredientIds, fridgeItems, isFavorite, query, recipes, slot, usedElsewhereIngredientIds]);

  const pendingModifiers = useMemo(
    () => pendingRecipe?.ingredients.filter((ingredient) => ingredient.isModifier || ingredient.isOptional) ?? [],
    [pendingRecipe],
  );

  const customModifierResults = useMemo(() => {
    if (!pendingRecipe) return [];
    const q = customModifierQuery.trim().toLowerCase();
    if (!q) return [];
    const existingIds = new Set(pendingRecipe.ingredients.map((ingredient) => ingredient.ingredientId));
    return ingredients
      .filter((ingredient) => !existingIds.has(ingredient.id) && ingredient.name.toLowerCase().includes(q))
      .slice(0, 6);
  }, [customModifierQuery, ingredients, pendingRecipe]);

  const applyRecipeMutation = useMutation({
    mutationFn: async ({ recipeId, targetIds, modifierIds }: { recipeId: number; targetIds: number[]; modifierIds: number[] }) => {
      if (!slot) throw new Error("No slot selected");
      await Promise.all(
        targetIds.map((slotId) =>
          swapSlot(slot.weekId, slotId, {
            recipeId,
            selectedModifierIngredientIds: modifierIds,
            isSkipped: false,
            isEatingOut: false,
          }),
        ),
      );
      return { recipeId, targetIds, modifierIds };
    },
    onSuccess: async ({ recipeId, targetIds, modifierIds }) => {
      if (!slot) return;
      await queryClient.invalidateQueries({ queryKey: ["week-slots", slot.weekId] });
      setSlotOverrides(null);
      const recipe = recipes.find((entry) => entry.id === recipeId);
      if (recipe) {
        const count = targetIds.length;
        const modifierSuffix = modifierIds.length > 0 ? ` with ${modifierIds.length} add-on${modifierIds.length === 1 ? "" : "s"}` : "";
        pushToast(count > 1 ? `${recipe.name}${modifierSuffix} added to ${count} ${slot.mealType.toLowerCase()} slots.` : `${recipe.name}${modifierSuffix} added to ${slot.dayOfWeek} ${slot.mealType.toLowerCase()}.`);
      }
      onClose();
    },
    onError: (_error, { recipeId, targetIds, modifierIds }) => {
      if (!slot) return;
      const recipe = recipes.find((entry) => entry.id === recipeId);
      const nextSlots = weekSlots.map((entry) =>
        targetIds.includes(entry.id)
          ? { ...entry, recipeId, recipeName: recipe?.name ?? null, selectedModifierIngredientIds: modifierIds, isSkipped: false, isEatingOut: false }
          : entry,
      );
      setSlotOverrides(nextSlots);
      if (recipe) {
        const count = targetIds.length;
        pushToast(count > 1 ? `${recipe.name} added in preview mode to ${count} slots.` : `${recipe.name} added in preview mode.`);
      }
      onClose();
    },
  });

  const addCustomModifierMutation = useMutation({
    mutationFn: async (ingredient: Ingredient) => {
      if (!pendingRecipe) throw new Error("No recipe selected");
      return addRecipeModifier(pendingRecipe.id, {
        ingredientId: ingredient.id,
        quantity: ingredient.servingSize > 0 ? ingredient.servingSize : 1,
        unit: ingredient.servingUnit || ingredient.purchaseUnit,
        notes: "Added while planning this week",
      });
    },
    onSuccess: async (modifier) => {
      if (!pendingRecipe) return;
      await queryClient.invalidateQueries({ queryKey: ["recipes"] });
      setPendingRecipe((current) =>
        current
          ? {
              ...current,
              ingredients: current.ingredients.some((ingredient) => ingredient.ingredientId === modifier.ingredientId)
                ? current.ingredients
                : [...current.ingredients, modifier],
            }
          : current,
      );
      setSelectedModifierIds((current) => (current.includes(modifier.ingredientId) ? current : [...current, modifier.ingredientId]));
      setCustomModifierQuery("");
      pushToast(`${modifier.ingredientName} added to optional add-ons.`);
    },
    onError: (_error, ingredient) => {
      setPendingRecipe((current) =>
        current
          ? {
              ...current,
              ingredients: current.ingredients.some((entry) => entry.ingredientId === ingredient.id)
                ? current.ingredients
                : [
                    ...current.ingredients,
                    {
                      id: 990_000 + ingredient.id,
                      ingredientId: ingredient.id,
                      ingredientName: ingredient.name,
                      quantity: ingredient.servingSize > 0 ? ingredient.servingSize : 1,
                      unit: ingredient.servingUnit || ingredient.purchaseUnit,
                      isModifier: true,
                      isOptional: true,
                      substituteIngredientIds: [],
                      notes: "Added while planning this week",
                    },
                  ],
            }
          : current,
      );
      setSelectedModifierIds((current) => (current.includes(ingredient.id) ? current : [...current, ingredient.id]));
      setCustomModifierQuery("");
      pushToast(`${ingredient.name} added in preview mode.`);
    },
  });

  function beginPlanningRecipe(recipe: Recipe) {
    if (!slot) return;
    setPendingRecipe(recipe);
    setSelectedTargetIds(initialTargetIds?.length ? initialTargetIds : [slot.id]);
    setSelectedModifierIds(slot.recipeId === recipe.id ? (slot.selectedModifierIngredientIds ?? []) : []);
    setCustomModifierQuery("");
  }

  function toggleTargetSlot(slotId: number) {
    if (slot?.id === slotId) return;
    setSelectedTargetIds((current) => (current.includes(slotId) ? current.filter((id) => id !== slotId) : [...current, slotId]));
  }

  function applyPendingRecipe() {
    if (!pendingRecipe || !slot || selectedTargetIds.length === 0) return;
    applyRecipeMutation.mutate({ recipeId: pendingRecipe.id, targetIds: selectedTargetIds, modifierIds: selectedModifierIds });
  }

  function toggleModifier(ingredientId: number) {
    setSelectedModifierIds((current) =>
      current.includes(ingredientId) ? current.filter((id) => id !== ingredientId) : [...current, ingredientId],
    );
  }

  return (
    <div className={cn("fixed inset-0 z-40 transition", open ? "pointer-events-auto" : "pointer-events-none")}>
      <div
        className={cn("absolute inset-0 z-40 bg-[#2c2416]/30 transition", open ? "opacity-100" : "opacity-0")}
        onClick={onClose}
        aria-hidden
      />
      <aside
        className={cn(
          "absolute bottom-0 left-0 right-0 z-50 flex max-h-[90dvh] flex-col rounded-t-[28px] border border-nourish-border bg-nourish-card transition lg:bottom-4 lg:left-auto lg:right-4 lg:top-4 lg:max-h-[min(92vh,800px)] lg:w-[440px] lg:rounded-[28px]",
          open ? "translate-y-0" : "translate-y-full lg:translate-x-full lg:translate-y-0",
        )}
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-nourish-border/70 px-5 pb-4 pt-5 lg:rounded-t-[28px] lg:border-b-0">
          <h2 className="text-xl font-semibold text-nourish-ink sm:text-2xl">
            {slot?.recipeId ? "Plan this meal" : "Add a meal"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] shrink-0 rounded-full p-2.5 text-nourish-muted hover:bg-nourish-bg hover:text-nourish-ink"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6">
            <div className="mb-4 rounded-2xl bg-nourish-bg p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-nourish-muted">
                <ArrowRightLeft size={14} aria-hidden />
                {slot?.recipeId ? "Current pick" : "Open slot"}
              </div>
              <h3 className="text-lg text-nourish-ink">{currentRecipe?.name ?? "Open slot"}</h3>
              {slot ? <p className="mt-2 text-sm text-nourish-muted">{slot.dayOfWeek} · {slot.mealType}</p> : null}
          </div>

          <div
            className="-mx-1 mb-4 flex gap-2 overflow-x-auto px-1 pb-1"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            {filters.map((filter) => (
              <div key={filter} className="shrink-0">
                <TagPill
                  active={activeFilter === filter}
                  onClick={() => {
                    setActiveFilter(filter);
                  }}
                >
                  {filter}
                </TagPill>
              </div>
            ))}
          </div>

          <div className="relative mb-4">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-nourish-muted" />
            <input className="input pl-10" placeholder="Search recipes" value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>

          {pendingRecipe ? (
            <div className="mb-4 rounded-2xl border border-nourish-sage/20 bg-nourish-sage/10 p-4">
              <div className="mb-3">
                <p className="text-xs font-medium uppercase tracking-wide text-nourish-muted">Ready to add</p>
                <h3 className="mt-1 text-lg font-medium text-nourish-ink">{pendingRecipe.name}</h3>
                <p className="mt-1 text-sm text-nourish-muted">
                  Start with {slot?.dayOfWeek}. Then decide whether this is just for that day or other {slot?.mealType.toLowerCase()} slots too.
                </p>
              </div>
              <div className="space-y-2">
                {eligibleTargetSlots.map((entry) => {
                  const checked = selectedTargetIds.includes(entry.id);
                  const disabled = entry.id === slot?.id;
                  return (
                    <label
                      key={entry.id}
                      className={cn(
                        "flex items-center justify-between rounded-xl border px-3 py-2 text-sm",
                        checked ? "border-nourish-sage bg-white" : "border-nourish-border bg-white/70",
                      )}
                    >
                      <span className="text-nourish-ink">
                        {entry.dayOfWeek} · {entry.mealType}
                      </span>
                      <span className="flex items-center gap-2">
                        {entry.recipeName && entry.id !== slot?.id ? <span className="text-xs text-nourish-muted">{entry.recipeName}</span> : null}
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={disabled}
                          onChange={() => toggleTargetSlot(entry.id)}
                          className="h-4 w-4 rounded border-nourish-border text-nourish-sage focus:ring-nourish-sage"
                        />
                      </span>
                    </label>
                  );
                })}
              </div>
              {pendingModifiers.length > 0 ? (
                <div className="mt-4 rounded-2xl border border-nourish-border bg-white/80 p-3">
                  <div className="mb-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-nourish-muted">Optional add-ons</p>
                    <p className="mt-1 text-sm text-nourish-muted">Choose the version you actually want this week before saving so grocery planning and MyPlate math stay accurate.</p>
                  </div>
                  <div className="space-y-2">
                    {pendingModifiers.map((ingredient) => {
                      const selected = selectedModifierIds.includes(ingredient.ingredientId);
                      const inFridge = fridgeIngredientIds.has(ingredient.ingredientId);
                      const overlaps = usedElsewhereIngredientIds.has(ingredient.ingredientId);
                      return (
                        <button
                          key={ingredient.id}
                          type="button"
                          onClick={() => toggleModifier(ingredient.ingredientId)}
                          className={cn(
                            "flex w-full items-start justify-between gap-3 rounded-xl border px-3 py-3 text-left transition",
                            selected ? "border-nourish-sage bg-nourish-sage/10" : "border-nourish-border bg-white",
                          )}
                        >
                          <div className="min-w-0">
                            <p className="font-medium text-nourish-ink">{ingredient.ingredientName}</p>
                            <p className="mt-0.5 text-xs text-nourish-muted">
                              {ingredient.quantity} {ingredient.unit}
                            </p>
                            {ingredient.notes ? <p className="mt-1 text-xs text-nourish-muted">{ingredient.notes}</p> : null}
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {inFridge ? <span className="rounded-full bg-nourish-sage/15 px-2 py-1 text-[11px] font-medium text-nourish-sage">In your fridge</span> : null}
                              {overlaps ? <span className="rounded-full bg-nourish-terracotta/10 px-2 py-1 text-[11px] font-medium text-nourish-terracotta">Used elsewhere this week</span> : null}
                            </div>
                          </div>
                          <span
                            className={cn(
                              "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs font-semibold",
                              selected ? "border-nourish-sage bg-nourish-sage text-white" : "border-nourish-border text-transparent",
                            )}
                            aria-hidden
                          >
                            ✓
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
              <div className="mt-4 rounded-2xl border border-nourish-border bg-white/80 p-3">
                <div className="mb-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-nourish-muted">Add your own</p>
                  <p className="mt-1 text-sm text-nourish-muted">Search ingredients to turn them into optional add-ons for this recipe.</p>
                </div>
                <div className="relative">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-nourish-muted" />
                  <input
                    className="input pl-10"
                    placeholder="Search ingredients"
                    value={customModifierQuery}
                    onChange={(event) => setCustomModifierQuery(event.target.value)}
                  />
                </div>
                {customModifierResults.length > 0 ? (
                  <div className="mt-3 space-y-2">
                    {customModifierResults.map((ingredient) => (
                      <button
                        key={ingredient.id}
                        type="button"
                        className="flex w-full items-center justify-between rounded-xl border border-nourish-border px-3 py-2 text-left text-sm text-nourish-ink transition hover:border-nourish-sage/40 hover:bg-nourish-bg"
                        onClick={() => addCustomModifierMutation.mutate(ingredient)}
                        disabled={addCustomModifierMutation.isPending}
                      >
                        <span>{ingredient.name}</span>
                        <span className="text-xs text-nourish-muted">{ingredient.servingSize} {ingredient.servingUnit}</span>
                      </button>
                    ))}
                  </div>
                ) : customModifierQuery.trim() ? (
                  <p className="mt-3 text-sm text-nourish-muted">No matching ingredients found.</p>
                ) : null}
              </div>
              <div className="mt-4 flex gap-2">
                <button type="button" className="button-primary flex-1" onClick={applyPendingRecipe} disabled={applyRecipeMutation.isPending}>
                  {applyRecipeMutation.isPending ? "Saving..." : `Add to ${selectedTargetIds.length} day${selectedTargetIds.length === 1 ? "" : "s"}`}
                </button>
                <button type="button" className="button-secondary" onClick={() => setPendingRecipe(null)}>
                  Cancel
                </button>
              </div>
            </div>
          ) : null}

          {visibleRecipes.length === 0 ? (
            <p className="mb-4 rounded-2xl border border-dashed border-nourish-border bg-nourish-bg/60 px-4 py-6 text-center text-sm text-nourish-muted">
              No recipes match this filter for this slot. Try <strong className="text-nourish-ink">All suggestions</strong> or another tab.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {visibleRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  compact
                  onSelect={beginPlanningRecipe}
                  actionLabel="Plan this recipe"
                />
              ))}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
