import { addDays, format, formatISO, parseISO, startOfWeek } from "date-fns";
import { clsx } from "clsx";
import type { MealType, Recipe, WeekMealSlot, WeekDay } from "types/models";

export function cn(...inputs: Array<string | false | null | undefined>) {
  return clsx(inputs);
}

export const weekDays: WeekDay[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const mealTypes: MealType[] = ["Breakfast", "Lunch", "Dinner", "Snack"];

export function getCurrentWeekStart() {
  return startOfWeek(new Date(), { weekStartsOn: 1 });
}

export function formatWeekRange(weekStartDate: string | Date) {
  const start = typeof weekStartDate === "string" ? parseISO(weekStartDate) : weekStartDate;
  const end = addDays(start, 6);
  return `${format(start, "MMM d")} – ${format(end, "MMM d")}`;
}

export function titleCaseEnum(value: string) {
  return value.replace(/([A-Z])/g, " $1").trim();
}

export function daysUntil(dateString?: string | null) {
  if (!dateString) return null;
  const diff = Math.ceil((parseISO(dateString).getTime() - Date.now()) / 86_400_000);
  return diff;
}

export function sortSlotsByMealType(slots: WeekMealSlot[]) {
  return [...slots].sort((a, b) => mealTypes.indexOf(a.mealType) - mealTypes.indexOf(b.mealType));
}

export function createBlankWeekSlots(weekId: number, visibleMealTypes: MealType[], weekStartISO: string): WeekMealSlot[] {
  const start = parseISO(weekStartISO);
  return weekDays.flatMap((day, dayIndex) =>
    visibleMealTypes.map((mealType, mealIndex) => ({
      id: 10_000 + dayIndex * 10 + mealIndex + 1,
      weekId,
      planDate: formatISO(addDays(start, dayIndex), { representation: "date" }),
      recipeId: null,
      recipeName: null,
      selectedModifierIngredientIds: [],
      dayOfWeek: day,
      mealType,
      isEatingOut: false,
      isSkipped: false,
      isLocked: false,
      servingsPlanned: 2,
      assumedCompleted: false,
      markedSkippedAt: null,
    })),
  );
}

export function createAutoWeekSlots({
  baseSlots,
  weekId,
  visibleMealTypes,
}: {
  baseSlots: WeekMealSlot[];
  weekId: number;
  visibleMealTypes: MealType[];
}) {
  return sortSlotsByMealType(
    baseSlots
      .filter((slot) => visibleMealTypes.includes(slot.mealType))
      .map((slot, index) => ({
        ...slot,
        id: weekId * 100 + index + 1,
        weekId,
        planDate: slot.planDate,
        selectedModifierIngredientIds: slot.selectedModifierIngredientIds ?? [],
      })),
  );
}

export function createSavedWeekSlots({
  weekId,
  visibleMealTypes,
  recipes,
  seed,
  weekStartISO,
}: {
  weekId: number;
  visibleMealTypes: MealType[];
  recipes: Recipe[];
  seed: number;
  weekStartISO: string;
}) {
  const start = parseISO(weekStartISO);
  return weekDays.flatMap((day, dayIndex) =>
    visibleMealTypes.map((mealType, mealIndex) => {
      const eligible = recipes.filter((recipe) => recipe.mealTypeTags.includes(mealType));
      const pool = eligible.length > 0 ? eligible : recipes;
      const recipe = pool[(seed + dayIndex + mealIndex) % pool.length];

      return {
        id: weekId * 100 + dayIndex * 10 + mealIndex + 1,
        weekId,
        planDate: formatISO(addDays(start, dayIndex), { representation: "date" }),
        recipeId: recipe?.id ?? null,
        recipeName: recipe?.name ?? null,
        selectedModifierIngredientIds: [],
        dayOfWeek: day,
        mealType,
        isEatingOut: false,
        isSkipped: false,
        isLocked: false,
        servingsPlanned: 2,
        assumedCompleted: false,
        markedSkippedAt: null,
      };
    }),
  );
}
