import { addDays, formatISO, parseISO } from "date-fns";
import { sortSlotsByMealType, weekDays } from "lib/utils";
import type { MealType, WeekDay, WeekMealSlot } from "types/models";

export function planDateForColumn(weekStartIso: string, columnDay: WeekDay): string {
  const start = parseISO(weekStartIso);
  const idx = weekDays.indexOf(columnDay);
  if (idx < 0) return formatISO(start, { representation: "date" });
  return formatISO(addDays(start, idx), { representation: "date" });
}

export function stableBlankSlotId(weekStartIso: string, dayIndex: number, mealIndex: number): number {
  const [y, m, d] = weekStartIso.split("-").map((n) => parseInt(n, 10));
  const seed = y * 10_000 + m * 100 + d;
  return 800_000 + seed * 100 + dayIndex * 10 + mealIndex;
}

/** Slots for a week with no server data yet — stable ids per (week start × day × meal). */
export function buildBlankSlotsForWeek(weekId: number, weekStartISO: string, types: MealType[]): WeekMealSlot[] {
  return sortSlotsByMealType(
    weekDays.flatMap((day, dayIndex) =>
      types.map((mealType, mealIndex) => ({
        id: stableBlankSlotId(weekStartISO, dayIndex, mealIndex),
        weekId,
        recipeId: null,
        recipeName: null,
        selectedModifierIngredientIds: [],
        dayOfWeek: day,
        mealType,
        planDate: formatISO(addDays(parseISO(weekStartISO), dayIndex), { representation: "date" }),
        isEatingOut: false,
        isSkipped: false,
        isLocked: false,
        servingsPlanned: 2,
        assumedCompleted: false,
        markedSkippedAt: null,
      })),
    ),
  );
}

export function injectPlanDates(slots: WeekMealSlot[], weekStartISO: string): WeekMealSlot[] {
  return slots.map((slot) => {
    const idx = weekDays.indexOf(slot.dayOfWeek);
    const planDate =
      idx >= 0
        ? formatISO(addDays(parseISO(weekStartISO), idx), { representation: "date" })
        : weekStartISO;
    return { ...slot, planDate };
  });
}

export function isSlotInWeekRange(slot: WeekMealSlot, weekStartISO: string): boolean {
  if (!slot.planDate) return true;
  const start = parseISO(weekStartISO);
  const end = addDays(start, 6);
  const d = parseISO(slot.planDate);
  return d >= start && d <= end;
}
