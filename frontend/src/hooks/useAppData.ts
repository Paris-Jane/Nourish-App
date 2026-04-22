import { useMemo } from "react";
import { getFridgeItems } from "api/fridge";
import { getGroceryList } from "api/groceryList";
import { getIngredients } from "api/ingredients";
import { getRecipes } from "api/recipes";
import { getSavedWeeks } from "api/savedWeeks";
import { getWeek, getWeekSlots } from "api/weeks";
import { usePreviewQuery } from "./usePreviewQuery";
import { mockFridgeItems, mockGroceryList, mockIngredients, mockRecipes, mockSavedWeeks, mockSlots, mockWeek } from "lib/mockData";
import { useWeekStore } from "store/weekStore";
import type { FridgeItem, GroceryList, Ingredient, Recipe, Week, WeekMealSlot } from "types/models";

export function useCurrentWeek(): { week: Week; isLoading: boolean } {
  const activeWeekId = useWeekStore((state) => state.activeWeekId) ?? 1;
  const query = usePreviewQuery({
    queryKey: ["week", activeWeekId],
    queryFn: () => getWeek(activeWeekId),
    fallbackData: mockWeek,
  });

  return { week: query.data ?? mockWeek, isLoading: query.isLoading };
}

export function useWeekSlots(): { slots: WeekMealSlot[]; isLoading: boolean } {
  const activeWeekId = useWeekStore((state) => state.activeWeekId) ?? 1;
  const slotOverrides = useWeekStore((state) => state.slotOverrides);
  const query = usePreviewQuery({
    queryKey: ["week-slots", activeWeekId],
    queryFn: () => getWeekSlots(activeWeekId),
    fallbackData: mockSlots,
  });

  return { slots: slotOverrides ?? query.data ?? mockSlots, isLoading: query.isLoading };
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
    fallbackData: mockSavedWeeks,
  });

  return { savedWeeks: query.data ?? mockSavedWeeks, isLoading: query.isLoading };
}

export function useGroupedSlots() {
  const { slots, isLoading } = useWeekSlots();
  const visibleMealTypes = useWeekStore((state) => state.visibleMealTypes);

  const grouped = useMemo(
    () =>
      slots
        .filter((slot) => visibleMealTypes.includes(slot.mealType))
        .reduce<Record<string, WeekMealSlot[]>>((acc, slot) => {
        acc[slot.dayOfWeek] ??= [];
        acc[slot.dayOfWeek].push(slot);
        return acc;
      }, {}),
    [slots, visibleMealTypes],
  );

  return { grouped, isLoading };
}
