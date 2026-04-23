import type { Recipe } from "types/models";

/** Lowercase haystack for client-side recipe search. */
export function recipeSearchText(recipe: Recipe): string {
  const parts = [
    recipe.name,
    recipe.cuisine,
    recipe.timeTag,
    recipe.scalabilityTag,
    recipe.prepStyleTag,
    recipe.isFreezerFriendly ? "freezer friendly freezer-friendly" : "",
    recipe.isCookFreshOnly ? "cook fresh" : "",
    ...recipe.mealTypeTags,
    ...recipe.ingredients.flatMap((i) => [i.ingredientName, i.unit, String(i.quantity), i.notes ?? ""]),
    ...recipe.steps.flatMap((s) => [s.instruction, s.timingTag]),
    ...Object.keys(recipe.foodGroupServings),
    ...Object.entries(recipe.foodGroupServings).flatMap(([k, v]) => [k, String(v)]),
  ];
  return parts.join(" ").toLowerCase();
}

export function recipeMatchesSearch(recipe: Recipe, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return recipeSearchText(recipe).includes(q);
}
