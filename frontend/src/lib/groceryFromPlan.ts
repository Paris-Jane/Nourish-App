import type { FridgeItem, GroceryList, Ingredient, Recipe, Week, WeekMealSlot } from "types/models";

type AggregatedItem = {
  ingredientId: number;
  ingredientName: string;
  plannedQuantity: number;
  plannedUnit: string;
  storeSection: string;
  recipeIds: number[];
};

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

export function buildPreviewGroceryListFromPlan(
  week: Pick<Week, "id" | "householdId">,
  slots: WeekMealSlot[],
  recipes: Recipe[],
  ingredients: Ingredient[],
  fridgeItems: FridgeItem[],
): GroceryList {
  const aggregated = new Map<string, AggregatedItem>();
  const recipeMap = new Map(recipes.map((recipe) => [recipe.id, recipe]));
  const ingredientMap = new Map(ingredients.map((ingredient) => [ingredient.id, ingredient]));

  slots
    .filter((slot) => slot.recipeId && !slot.isSkipped)
    .forEach((slot) => {
      const recipe = recipeMap.get(slot.recipeId!);
      if (!recipe) return;
      const scale = recipe.baseYieldServings > 0 ? (slot.servingsPlanned || 1) / recipe.baseYieldServings : 1;
      const selectedModifierIds = new Set(slot.selectedModifierIngredientIds ?? []);

      recipe.ingredients
        .filter((ingredient) => !ingredient.isModifier || selectedModifierIds.has(ingredient.ingredientId))
        .forEach((ingredient) => {
          const meta = ingredientMap.get(ingredient.ingredientId);
          const key = `${ingredient.ingredientId}:${ingredient.unit}`;
          const plannedQuantity = ingredient.quantity * scale;
          const existing = aggregated.get(key);

          if (existing) {
            existing.plannedQuantity += plannedQuantity;
            if (slot.recipeId && !existing.recipeIds.includes(slot.recipeId)) existing.recipeIds.push(slot.recipeId);
            return;
          }

          aggregated.set(key, {
            ingredientId: ingredient.ingredientId,
            ingredientName: ingredient.ingredientName,
            plannedQuantity,
            plannedUnit: ingredient.unit,
            storeSection: meta?.storeSection ?? "Other",
            recipeIds: slot.recipeId ? [slot.recipeId] : [],
          });
        });
    });

  const items = Array.from(aggregated.values())
    .map((item, index) => {
      const fridgeQty = fridgeItems
        .filter(
          (fridgeItem) =>
            fridgeItem.ingredientId === item.ingredientId &&
            fridgeItem.unit.toLowerCase() === item.plannedUnit.toLowerCase(),
        )
        .reduce((sum, fridgeItem) => sum + fridgeItem.quantity, 0);

      const remaining = Math.max(0, item.plannedQuantity - fridgeQty);
      return remaining > 0
        ? {
            id: 5000 + index + 1,
            groceryListId: week.id,
            ingredientId: item.ingredientId,
            ingredientName: item.ingredientName,
            plannedQuantity: round2(remaining),
            plannedUnit: item.plannedUnit,
            purchasedQuantity: null,
            storeSection: item.storeSection,
            isChecked: false,
            addedToFridge: false,
            recipeIds: item.recipeIds,
          }
        : null;
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .sort((a, b) => a.storeSection.localeCompare(b.storeSection) || a.ingredientName.localeCompare(b.ingredientName));

  return {
    id: week.id,
    weekId: week.id,
    householdId: week.householdId,
    generatedAt: new Date().toISOString(),
    status: "Active",
    completedAt: null,
    items,
  };
}
