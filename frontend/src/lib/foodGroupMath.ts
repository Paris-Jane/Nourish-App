import type { RecipeFormValues } from "types/forms";
import type { Ingredient, Recipe } from "types/models";

function normalizeGroup(group: Ingredient["foodGroup"] | "Other") {
  switch (group) {
    case "Grains":
      return "grains";
    case "Protein":
      return "protein";
    case "Vegetable":
      return "vegetables";
    case "Fruit":
      return "fruit";
    case "Dairy":
      return "dairy";
    case "Legume":
      return "protein";
    default:
      return null;
  }
}

export function estimateFoodGroupServings(
  values: Pick<RecipeFormValues, "ingredients" | "baseYieldServings">,
  ingredients: Ingredient[],
) {
  const totals: Record<string, number> = {};
  const byId = new Map(ingredients.map((ingredient) => [ingredient.id, ingredient]));
  const servings = Math.max(values.baseYieldServings || 1, 1);

  for (const item of values.ingredients) {
    if (item.isModifier) continue;
    const ingredient = byId.get(item.ingredientId);
    if (!ingredient) continue;
    const group = normalizeGroup(ingredient.foodGroup);
    if (!group) continue;
    const servingSize = ingredient.servingSize || 0;
    if (servingSize <= 0) continue;
    const estimated = item.quantity / servingSize / servings;
    if (!Number.isFinite(estimated) || estimated <= 0) continue;
    totals[group] = Math.round(((totals[group] ?? 0) + estimated) * 100) / 100;
  }

  return totals;
}

function normalizeDisplayGroup(group: Ingredient["foodGroup"] | string) {
  switch (group) {
    case "Grains":
    case "grains":
    case "grain":
      return "Grains";
    case "Protein":
    case "protein":
      return "Protein";
    case "Vegetable":
    case "vegetables":
    case "vegetable":
      return "Vegetable";
    case "Fruit":
    case "fruit":
      return "Fruit";
    case "Dairy":
    case "dairy":
      return "Dairy";
    case "Legume":
    case "legume":
    case "legumes":
      return "Protein";
    default:
      return null;
  }
}

export function getSelectedMealFoodGroups(
  recipe: Recipe | undefined,
  selectedModifierIngredientIds: number[],
  ingredients: Ingredient[],
) {
  if (!recipe) return [];

  const groups = new Set<string>();
  const ingredientMap = new Map(ingredients.map((ingredient) => [ingredient.id, ingredient]));

  Object.entries(recipe.foodGroupServings).forEach(([group, servings]) => {
    if (servings <= 0) return;
    const normalized = normalizeDisplayGroup(group);
    if (normalized) groups.add(normalized);
  });

  if (selectedModifierIngredientIds.length > 0) {
    const selectedIds = new Set(selectedModifierIngredientIds);
    recipe.ingredients
      .filter((ingredient) => selectedIds.has(ingredient.ingredientId))
      .forEach((ingredient) => {
        const lookup = ingredientMap.get(ingredient.ingredientId);
        if (!lookup) return;
        const normalized = normalizeDisplayGroup(lookup.foodGroup);
        if (normalized) groups.add(normalized);
      });
  }

  return Array.from(groups);
}
