import { useEffect, useMemo } from "react";
import { getFridgeItems } from "api/fridge";
import { getGroceryList } from "api/groceryList";
import { getIngredients } from "api/ingredients";
import { getRecipes } from "api/recipes";
import { getSavedWeeks } from "api/savedWeeks";
import { getWeek, getWeekSlots, listWeeks } from "api/weeks";
import { shouldUsePreviewFallback, usePreviewQuery } from "./usePreviewQuery";
import { buildBlankSlotsForWeek, injectPlanDates } from "lib/mealPlanDates";
import { mockFridgeItems, mockGroceryList, mockIngredients, mockRecipes, mockSavedTemplates, mockSlots, mockWeek, mockWeeks } from "lib/mockData";
import { mealTypes, weekDays } from "lib/utils";
import { useWeekStore } from "store/weekStore";
import type { FridgeItem, GroceryList, Ingredient, Recipe, SavedWeekTemplate, Week, WeekMealSlot } from "types/models";

function useResolvedWeeks() {
  const previewFallbackEnabled = shouldUsePreviewFallback();
  const activeWeekId = useWeekStore((state) => state.activeWeekId);
  const setActiveWeekId = useWeekStore((state) => state.setActiveWeekId);
  const query = usePreviewQuery({
    queryKey: ["weeks"],
    queryFn: listWeeks,
    fallbackData: mockWeeks,
  });
  const weeks = useMemo(
    () => (query.data ?? (previewFallbackEnabled ? mockWeeks : [])).slice().sort((a, b) => a.weekStartDate.localeCompare(b.weekStartDate)),
    [previewFallbackEnabled, query.data],
  );
  const resolvedWeekId =
    activeWeekId && weeks.some((week) => week.id === activeWeekId) ? activeWeekId : weeks[0]?.id ?? (previewFallbackEnabled ? 1 : null);

  useEffect(() => {
    if (resolvedWeekId && activeWeekId !== resolvedWeekId) {
      setActiveWeekId(resolvedWeekId);
    }
  }, [activeWeekId, resolvedWeekId, setActiveWeekId]);

  return { weeks, activeWeekId: resolvedWeekId, isLoading: query.isLoading, previewFallbackEnabled };
}

export function useWeeks(): { weeks: Week[]; isLoading: boolean } {
  const { weeks, isLoading } = useResolvedWeeks();

  return {
    weeks,
    isLoading,
  };
}

export function useCurrentWeek(): { week: Week; anchorWeekStartDate: string; isLoading: boolean } {
  const { activeWeekId, weeks, previewFallbackEnabled } = useResolvedWeeks();
  const visibleWeekStartDate = useWeekStore((state) => state.visibleWeekStartDate);
  const fallbackWeek = mockWeeks.find((entry) => entry.id === activeWeekId) ?? mockWeek;
  const query = usePreviewQuery({
    queryKey: ["week", activeWeekId ?? "none"],
    queryFn: () => (activeWeekId ? getWeek(activeWeekId) : Promise.reject(new Error("No active week selected."))),
    fallbackData: fallbackWeek,
    enabled: Boolean(activeWeekId),
  });

  const data = query.data ?? (previewFallbackEnabled ? fallbackWeek : weeks[0] ?? fallbackWeek);
  const anchorWeekStartDate = data.weekStartDate;
  const week = { ...data, weekStartDate: visibleWeekStartDate ?? data.weekStartDate };

  return { week, anchorWeekStartDate, isLoading: query.isLoading };
}

export function useWeekSlots(): { slots: WeekMealSlot[]; isLoading: boolean } {
  const previewFallbackEnabled = shouldUsePreviewFallback();
  const slotOverrides = useWeekStore((state) => state.slotOverrides);
  const { week, anchorWeekStartDate } = useCurrentWeek();
  const activeWeekId = week.id;
  const fallbackSlots = useMemo(
    () =>
      injectPlanDates(
        mockSlots.map((slot) => ({
          ...slot,
          weekId: activeWeekId,
        })),
        week.weekStartDate,
      ),
    [activeWeekId, week.weekStartDate],
  );
  const query = usePreviewQuery({
    queryKey: ["week-slots", activeWeekId],
    queryFn: () => getWeekSlots(activeWeekId),
    fallbackData: fallbackSlots,
    enabled: Boolean(activeWeekId),
  });

  const anchorSlots = query.data ?? (previewFallbackEnabled ? fallbackSlots : []);
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
  const previewFallbackEnabled = shouldUsePreviewFallback();
  const slotOverrides = useWeekStore((state) => state.slotOverrides);
  const { week } = useCurrentWeek();
  const activeWeekId = week.id;
  const fallbackSlots = useMemo(
    () =>
      injectPlanDates(
        mockSlots.map((slot) => ({
          ...slot,
          weekId: activeWeekId,
        })),
        week.weekStartDate,
      ),
    [activeWeekId, week.weekStartDate],
  );
  const query = usePreviewQuery({
    queryKey: ["week-slots", activeWeekId],
    queryFn: () => getWeekSlots(activeWeekId),
    fallbackData: fallbackSlots,
    enabled: Boolean(activeWeekId),
  });
  const anchorSlots = query.data ?? (previewFallbackEnabled ? fallbackSlots : []);
  return { slots: slotOverrides ?? anchorSlots, isLoading: query.isLoading };
}

export function useRecipes(): { recipes: Recipe[]; isLoading: boolean } {
  const previewFallbackEnabled = shouldUsePreviewFallback();
  const query = usePreviewQuery({
    queryKey: ["recipes"],
    queryFn: getRecipes,
    fallbackData: mockRecipes,
  });

  return { recipes: query.data ?? (previewFallbackEnabled ? mockRecipes : []), isLoading: query.isLoading };
}

export function useGroceryList(): { groceryList: GroceryList; isLoading: boolean } {
  const previewFallbackEnabled = shouldUsePreviewFallback();
  const { week } = useCurrentWeek();
  const activeWeekId = week.id;
  const query = usePreviewQuery({
    queryKey: ["grocery-list", activeWeekId],
    queryFn: () => getGroceryList(activeWeekId),
    fallbackData: { ...mockGroceryList, weekId: activeWeekId, generatedAt: new Date().toISOString() },
    enabled: Boolean(activeWeekId),
  });

  return {
    groceryList: query.data ?? (previewFallbackEnabled ? { ...mockGroceryList, weekId: activeWeekId } : { ...mockGroceryList, weekId: activeWeekId, items: [] }),
    isLoading: query.isLoading,
  };
}

export function useFridgeItems(): { items: FridgeItem[]; isLoading: boolean } {
  const previewFallbackEnabled = shouldUsePreviewFallback();
  const query = usePreviewQuery({
    queryKey: ["fridge-items"],
    queryFn: getFridgeItems,
    fallbackData: mockFridgeItems,
  });

  return { items: query.data ?? (previewFallbackEnabled ? mockFridgeItems : []), isLoading: query.isLoading };
}

export function useIngredients(): { ingredients: Ingredient[]; isLoading: boolean } {
  const previewFallbackEnabled = shouldUsePreviewFallback();
  const query = usePreviewQuery({
    queryKey: ["ingredients"],
    queryFn: getIngredients,
    fallbackData: mockIngredients,
  });

  return { ingredients: query.data ?? (previewFallbackEnabled ? mockIngredients : []), isLoading: query.isLoading };
}

export function useSavedWeeks() {
  const previewFallbackEnabled = shouldUsePreviewFallback();
  const query = usePreviewQuery({
    queryKey: ["saved-weeks"],
    queryFn: getSavedWeeks,
    fallbackData: mockSavedTemplates,
  });

  return { savedTemplates: (query.data ?? (previewFallbackEnabled ? mockSavedTemplates : [])) as SavedWeekTemplate[], isLoading: query.isLoading };
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
