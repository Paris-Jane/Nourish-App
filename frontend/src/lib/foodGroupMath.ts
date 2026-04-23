import type { RecipeFormValues } from "types/forms";
import type { Ingredient } from "types/models";

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
