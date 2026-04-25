import { useMemo } from "react";
import { getFridgeItems } from "api/fridge";
import { getGroceryList } from "api/groceryList";
import { getIngredients } from "api/ingredients";
import { getRecipes } from "api/recipes";
import { getSavedWeeks } from "api/savedWeeks";
import { getWeek, getWeekSlots } from "api/weeks";
import { usePreviewQuery } from "./usePreviewQuery";
import { buildBlankSlotsForWeek } from "lib/mealPlanDates";
import { mockFridgeItems, mockGroceryList, mockIngredients, mockRecipes, mockSavedTemplates, mockSlots, mockWeek } from "lib/mockData";
import { mealTypes, weekDays } from "lib/utils";
import { useWeekStore } from "store/weekStore";
import type { FridgeItem, GroceryList, Ingredient, Recipe, SavedWeekTemplate, Week, WeekMealSlot } from "types/models";

export function useCurrentWeek(): { week: Week; anchorWeekStartDate: string; isLoading: boolean } {
  const activeWeekId = useWeekStore((state) => state.activeWeekId) ?? 1;
  const visibleWeekStartDate = useWeekStore((state) => state.visibleWeekStartDate);
  const query = usePreviewQuery({
    queryKey: ["week", activeWeekId],
    queryFn: () => getWeek(activeWeekId),
    fallbackData: mockWeek,
  });

  const data = query.data ?? mockWeek;
  const anchorWeekStartDate = data.weekStartDate;
  const week = { ...data, weekStartDate: visibleWeekStartDate ?? data.weekStartDate };

  return { week, anchorWeekStartDate, isLoading: query.isLoading };
}

export function useWeekSlots(): { slots: WeekMealSlot[]; isLoading: boolean } {
  const activeWeekId = useWeekStore((state) => state.activeWeekId) ?? 1;
  const slotOverrides = useWeekStore((state) => state.slotOverrides);
  const { week, anchorWeekStartDate } = useCurrentWeek();
  const query = usePreviewQuery({
    queryKey: ["week-slots", activeWeekId],
    queryFn: () => getWeekSlots(activeWeekId),
    fallbackData: mockSlots,
  });

  const anchorSlots = query.data ?? mockSlots;
  const displayedStart = week.weekStartDate;

  const slotsForDisplayedWeek = useMemo(() => {
    if (displayedStart === anchorWeekStartDate) {
      return anchorSlots;
    }
    return buildBlankSlotsForWeek(week.id, displayedStart, [...mealTypes]);
  }, [anchorSlots, anchorWeekStartDate, displayedStart, week.id]);

  return { slots: slotOverrides ?? slotsForDisplayedWeek, isLoading: query.isLoading };
}

/** Anchor week meal cells (ignores “browse another week” blank planner) — for inventory / consumption logic. */
export function usePlannerAnchorSlots(): { slots: WeekMealSlot[]; isLoading: boolean } {
  const activeWeekId = useWeekStore((state) => state.activeWeekId) ?? 1;
  const slotOverrides = useWeekStore((state) => state.slotOverrides);
  const query = usePreviewQuery({
    queryKey: ["week-slots", activeWeekId],
    queryFn: () => getWeekSlots(activeWeekId),
    fallbackData: mockSlots,
  });
  const anchorSlots = query.data ?? mockSlots;
  return { slots: slotOverrides ?? anchorSlots, isLoading: query.isLoading };
}

export function useRecipes(): { recipes: Recipe[]; isLoading: boolean } {
  const query = usePreviewQuery({
    queryKey: ["recipes"],
    queryFn: getRecipes,
    fallbackData: mockRecipes,
  });

  return { recipes: query.data ?? mockRecipes, isLoading: query.isLoading };
}

export function useGroceryList(): { groceryList: GroceryList; isLoading: boolean } {
  const activeWeekId = useWeekStore((state) => state.activeWeekId) ?? 1;
  const query = usePreviewQuery({
    queryKey: ["grocery-list", activeWeekId],
    queryFn: () => getGroceryList(activeWeekId),
    fallbackData: mockGroceryList,
  });

  return { groceryList: query.data ?? mockGroceryList, isLoading: query.isLoading };
}

export function useFridgeItems(): { items: FridgeItem[]; isLoading: boolean } {
  const query = usePreviewQuery({
    queryKey: ["fridge-items"],
    queryFn: getFridgeItems,
    fallbackData: mockFridgeItems,
  });

  return { items: query.data ?? mockFridgeItems, isLoading: query.isLoading };
}

export function useIngredients(): { ingredients: Ingredient[]; isLoading: boolean } {
  const query = usePreviewQuery({
    queryKey: ["ingredients"],
    queryFn: getIngredients,
    fallbackData: mockIngredients,
  });

  return { ingredients: query.data ?? mockIngredients, isLoading: query.isLoading };
}

export function useSavedWeeks() {
  const query = usePreviewQuery({
    queryKey: ["saved-weeks"],
    queryFn: getSavedWeeks,
    fallbackData: mockSavedTemplates,
  });

  return { savedTemplates: (query.data ?? mockSavedTemplates) as SavedWeekTemplate[], isLoading: query.isLoading };
}

export function useGroupedSlots() {
  const { slots, isLoading } = useWeekSlots();
  const visibleMealTypes = useWeekStore((state) => state.visibleMealTypes);

  const grouped = useMemo(() => {
    if (visibleMealTypes.length === 0) {
      return weekDays.reduce<Record<string, WeekMealSlot[]>>((acc, day) => {
        acc[day] = [];
        return acc;
      }, {});
    }
    return slots
      .filter((slot) => visibleMealTypes.includes(slot.mealType))
      .reduce<Record<string, WeekMealSlot[]>>((acc, slot) => {
        acc[slot.dayOfWeek] ??= [];
        acc[slot.dayOfWeek].push(slot);
        return acc;
      }, {});
  }, [slots, visibleMealTypes]);

  return { grouped, isLoading };
}
