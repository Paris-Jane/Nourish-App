import { buildBlankSlotsForWeek } from "lib/mealPlanDates";
import { mealTypes, sortSlotsByMealType } from "lib/utils";
import type { Recipe, SavedWeekTemplate, WeekMealSlot } from "types/models";

export function mergeSavedTemplateIntoSlots(
  template: SavedWeekTemplate,
  weekId: number,
  weekStartISO: string,
  recipes: Recipe[],
): WeekMealSlot[] {
  const base = buildBlankSlotsForWeek(weekId, weekStartISO, [...mealTypes]);
  const all = [...base];

  template.slots
    .filter((slot) => slot.position > 0)
    .forEach((slot, index) => {
      const dayIndex = base.findIndex((entry) => entry.dayOfWeek === slot.dayOfWeek);
      all.push({
        id: 900_000 + weekId * 100 + index,
        weekId,
        planDate: base.find((entry) => entry.dayOfWeek === slot.dayOfWeek)?.planDate ?? weekStartISO,
        recipeId: null,
        recipeName: null,
        selectedModifierIngredientIds: [],
        dayOfWeek: slot.dayOfWeek,
        mealType: slot.mealType,
        position: slot.position,
        isEatingOut: false,
        isSkipped: false,
        isLocked: false,
        servingsPlanned: 2,
        assumedCompleted: false,
        markedSkippedAt: null,
      });
    });

  return sortSlotsByMealType(
    all.map((slot) => {
      const t = template.slots.find((x) => x.dayOfWeek === slot.dayOfWeek && x.mealType === slot.mealType && x.position === slot.position);
      if (!t) return slot;
      const recipe = t.recipeId ? recipes.find((r) => r.id === t.recipeId) : undefined;
      return {
        ...slot,
        recipeId: t.recipeId,
        recipeName: t.recipeName ?? recipe?.name ?? null,
        selectedModifierIngredientIds: [],
        isEatingOut: false,
        isSkipped: t.isSkipped,
      };
    }),
  );
}
