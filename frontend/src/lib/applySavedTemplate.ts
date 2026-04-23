import { buildBlankSlotsForWeek } from "lib/mealPlanDates";
import { mealTypes } from "lib/utils";
import type { Recipe, SavedWeekTemplate, WeekMealSlot } from "types/models";

export function mergeSavedTemplateIntoSlots(
  template: SavedWeekTemplate,
  weekId: number,
  weekStartISO: string,
  recipes: Recipe[],
): WeekMealSlot[] {
  const base = buildBlankSlotsForWeek(weekId, weekStartISO, [...mealTypes]);
  return base.map((slot) => {
    const t = template.slots.find((x) => x.dayOfWeek === slot.dayOfWeek && x.mealType === slot.mealType);
    if (!t) return slot;
    const recipe = t.recipeId ? recipes.find((r) => r.id === t.recipeId) : undefined;
    return {
      ...slot,
      recipeId: t.recipeId,
      recipeName: t.recipeName ?? recipe?.name ?? null,
      selectedModifierIngredientIds: [],
      isEatingOut: t.isEatingOut,
      isSkipped: t.isSkipped,
    };
  });
}
