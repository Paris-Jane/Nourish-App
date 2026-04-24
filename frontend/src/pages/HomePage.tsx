import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  formatISO,
  isSameMonth,
  isToday,
  parseISO,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
} from "date-fns";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, CircleHelp, PencilRuler } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { applyWeekTemplate, approveWeek, clearWeek, createWeekSlot, deleteWeekSlot, saveWeekAsTemplate, swapSlot } from "api/weeks";
import { BottomSheet } from "components/BottomSheet";
import { DayColumn } from "components/DayColumn";
import { ErrorBoundary } from "components/ErrorBoundary";
import { SwapDrawer } from "components/SwapDrawer";
import { useCurrentWeek, useFridgeItems, useGroupedSlots, useIngredients, useRecipes, useSavedWeeks, useWeekSlots } from "hooks/useAppData";
import { mergeSavedTemplateIntoSlots } from "lib/applySavedTemplate";
import { cn, createBlankWeekSlots, formatWeekRange, mealTypes, weekDays } from "lib/utils";
import { isWeekColumnToday } from "lib/weekCalendar";
import { useToast } from "hooks/useToast";
import { useWeekStore } from "store/weekStore";
import type { GroceryList, Ingredient, MealType, SavedWeekTemplate, Week, WeekDay, WeekMealSlot } from "types/models";

type HomeViewMode = "week" | "month";
type RepeatActionType = "swap" | "remove";

function getWeekStartForDate(date: Date) {
  return startOfWeek(date, { weekStartsOn: 1 });
}

function createEmptyGroceryList(weekId: number, householdId: number): GroceryList {
  return {
    id: 0,
    weekId,
    householdId,
    generatedAt: new Date().toISOString(),
    status: "Active",
    items: [],
  };
}

export function HomePage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { week } = useCurrentWeek();
  const { slots } = useWeekSlots();
  const { grouped } = useGroupedSlots();
  const { recipes } = useRecipes();
  const { ingredients } = useIngredients();
  const { items: fridgeItems } = useFridgeItems();
  const { pushToast } = useToast();
  const selectedSlotId = useWeekStore((state) => state.selectedSlotId);
  const selectSlot = useWeekStore((state) => state.selectSlot);
  const swapDrawerOpen = useWeekStore((state) => state.swapDrawerOpen);
  const setSwapDrawerOpen = useWeekStore((state) => state.setSwapDrawerOpen);
  const visibleMealTypes = useWeekStore((state) => state.visibleMealTypes);
  const setVisibleMealTypes = useWeekStore((state) => state.setVisibleMealTypes);
  const setSlotOverrides = useWeekStore((state) => state.setSlotOverrides);
  const setActiveWeekLabel = useWeekStore((state) => state.setActiveWeekLabel);
  const setVisibleWeekStartDate = useWeekStore((state) => state.setVisibleWeekStartDate);

  const weekStartDate = useMemo(() => parseISO(week.weekStartDate), [week.weekStartDate]);

  const [viewMode, setViewMode] = useState<HomeViewMode>("week");
  const [monthCursor, setMonthCursor] = useState(() => startOfMonth(weekStartDate));
  const { savedTemplates } = useSavedWeeks();
  const [approveReviewOpen, setApproveReviewOpen] = useState(false);
  const [loadTemplateOpen, setLoadTemplateOpen] = useState(false);
  const [clearWeekOpen, setClearWeekOpen] = useState(false);
  const [saveTemplateOpen, setSaveTemplateOpen] = useState(false);
  const [templateNameDraft, setTemplateNameDraft] = useState("");
  const [dotsHelpOpen, setDotsHelpOpen] = useState(false);
  const [showJumpToToday, setShowJumpToToday] = useState(false);
  const [planMode, setPlanMode] = useState(false);
  const [swapTargetIds, setSwapTargetIds] = useState<number[]>([]);
  const [repeatAction, setRepeatAction] = useState<null | { type: RepeatActionType; slot: WeekMealSlot; matchingSlots: WeekMealSlot[] }>(null);
  const [copyMealSlot, setCopyMealSlot] = useState<WeekMealSlot | null>(null);
  const [copyTargetIds, setCopyTargetIds] = useState<number[]>([]);
  const [draggedSlotId, setDraggedSlotId] = useState<number | null>(null);
  const [dropTargetSlotId, setDropTargetSlotId] = useState<number | null>(null);
  const weekScrollerRef = useRef<HTMLDivElement>(null);
  const [scrollDayIndex, setScrollDayIndex] = useState(0);
  const dayRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const dotsHelpRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMonthCursor(startOfMonth(weekStartDate));
  }, [weekStartDate]);

  useEffect(() => {
    if (!dotsHelpOpen) return;
    const close = (e: MouseEvent) => {
      if (dotsHelpRef.current && !dotsHelpRef.current.contains(e.target as Node)) setDotsHelpOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [dotsHelpOpen]);

  useEffect(() => {
    setSlotOverrides(null);
  }, [week.weekStartDate, setSlotOverrides]);

  useEffect(() => {
    if (viewMode !== "week") return;
    const mq = window.matchMedia("(max-width: 1023px)");
    if (!mq.matches) return;
    const todayDay = weekDays.find((day) => isWeekColumnToday(week.weekStartDate, day as WeekDay));
    if (!todayDay) return;
    const id = requestAnimationFrame(() => {
      dayRefs.current[todayDay]?.scrollIntoView({ behavior: "auto", inline: "start", block: "nearest" });
    });
    return () => cancelAnimationFrame(id);
  }, [week.weekStartDate, viewMode]);

  const selectedSlot = useMemo(
    () => Object.values(grouped).flat().find((slot) => slot.id === selectedSlotId),
    [grouped, selectedSlotId],
  );

  const mainSlots = useMemo(() => slots.filter((slot) => slot.mealType !== "Snack"), [slots]);
  const coveredMainSlots = useMemo(
    () => mainSlots.filter((slot) => slot.recipeId || slot.isSkipped).length,
    [mainSlots],
  );
  const unplannedMainSlots = Math.max(0, mainSlots.length - coveredMainSlots);
  const isApproved = week.status === "Confirmed";

  const monthDays = useMemo(
    () =>
      eachDayOfInterval({
        start: getWeekStartForDate(startOfMonth(monthCursor)),
        end: endOfWeek(endOfMonth(monthCursor), { weekStartsOn: 1 }),
      }),
    [monthCursor],
  );

  const monthWeekRows = useMemo(() => {
    const rows: Date[][] = [];
    for (let i = 0; i < monthDays.length; i += 7) {
      rows.push(monthDays.slice(i, i + 7));
    }
    return rows;
  }, [monthDays]);

  const slotDatesWithRecipes = useMemo(
    () => new Set(slots.filter((s) => s.recipeId).map((s) => s.planDate)),
    [slots],
  );

  const approveWeekMutation = useMutation({
    mutationFn: () => approveWeek(week.id),
    onSuccess: (approvedWeek) => {
      const enriched: Week = { ...approvedWeek, status: "Confirmed" };
      queryClient.setQueryData(["week", enriched.id], enriched);
      setApproveReviewOpen(false);
      pushToast("Week approved.");
    },
    onError: () => {
      const enriched: Week = { ...week, status: "Confirmed" };
      queryClient.setQueryData(["week", enriched.id], enriched);
      setApproveReviewOpen(false);
      pushToast("Week approved in preview mode.");
    },
  });

  const clearSlotMutation = useMutation({
    mutationFn: async (slotIds: number[]) => {
      await Promise.all(
        slotIds.map((slotId) =>
          swapSlot(week.id, slotId, {
            recipeId: null,
            selectedModifierIngredientIds: [],
            isSkipped: false,
            isEatingOut: false,
          }),
        ),
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["week-slots", week.id] });
      setSlotOverrides(null);
      pushToast("Meal removed.");
    },
    onError: (_err, slotIds) => {
      const targetIds = new Set(slotIds);
      const next = slots.map((s) =>
        targetIds.has(s.id)
          ? { ...s, recipeId: null, recipeName: null, selectedModifierIngredientIds: [], isSkipped: false, isEatingOut: false }
          : s,
      );
      setSlotOverrides(next);
      pushToast(targetIds.size > 1 ? "Meals cleared in preview mode." : "Meal cleared in preview mode.");
    },
  });

  const copyMealMutation = useMutation({
    mutationFn: async ({ sourceSlot, targetIds }: { sourceSlot: WeekMealSlot; targetIds: number[] }) => {
      await Promise.all(
        targetIds.map((slotId) =>
          swapSlot(week.id, slotId, {
            recipeId: sourceSlot.recipeId ?? null,
            selectedModifierIngredientIds: sourceSlot.selectedModifierIngredientIds ?? [],
            isSkipped: false,
            isEatingOut: false,
          }),
        ),
      );
    },
    onSuccess: async (_result, { targetIds }) => {
      await queryClient.invalidateQueries({ queryKey: ["week-slots", week.id] });
      setSlotOverrides(null);
      setCopyMealSlot(null);
      setCopyTargetIds([]);
      pushToast(`Meal added to ${targetIds.length} more day${targetIds.length === 1 ? "" : "s"}.`);
    },
    onError: (_error, { sourceSlot, targetIds }) => {
      const recipe = recipes.find((entry) => entry.id === sourceSlot.recipeId);
      const targetSet = new Set(targetIds);
      const nextSlots = slots.map((entry) =>
        targetSet.has(entry.id)
          ? {
              ...entry,
              recipeId: sourceSlot.recipeId ?? null,
              recipeName: recipe?.name ?? null,
              selectedModifierIngredientIds: sourceSlot.selectedModifierIngredientIds ?? [],
              isSkipped: false,
              isEatingOut: false,
            }
          : entry,
      );
      setSlotOverrides(nextSlots);
      setCopyMealSlot(null);
      setCopyTargetIds([]);
      pushToast("Meal copied in preview mode.");
    },
  });

  const addSnackMutation = useMutation({
    mutationFn: async (day: WeekDay) =>
      createWeekSlot(week.id, {
        dayOfWeek: day,
        mealType: "Snack",
        servingsPlanned: 1,
      }),
    onSuccess: async (_, day) => {
      await queryClient.invalidateQueries({ queryKey: ["week-slots", week.id] });
      setSlotOverrides(null);
      pushToast(`Added another snack slot for ${day}.`);
    },
    onError: (_error, day) => {
      const daySnackPositions = slots.filter((slot) => slot.dayOfWeek === day && slot.mealType === "Snack").map((slot) => slot.position ?? 0);
      const nextPosition = (daySnackPositions.length > 0 ? Math.max(...daySnackPositions) : -1) + 1;
      const planDate = formatISO(addDays(weekStartDate, weekDays.indexOf(day)), { representation: "date" });
      const nextSlot: WeekMealSlot = {
        id: 950_000 + slots.length + nextPosition,
        weekId: week.id,
        planDate,
        recipeId: null,
        selectedModifierIngredientIds: [],
        recipeName: null,
        dayOfWeek: day,
        mealType: "Snack",
        position: nextPosition,
        isEatingOut: false,
        isSkipped: false,
        isLocked: false,
        servingsPlanned: 1,
        assumedCompleted: false,
        markedSkippedAt: null,
      };
      setSlotOverrides([...slots, nextSlot]);
      pushToast(`Added another snack slot for ${day} in preview mode.`);
    },
  });

  const deleteSlotMutation = useMutation({
    mutationFn: async (slotId: number) => {
      await deleteWeekSlot(week.id, slotId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["week-slots", week.id] });
      setSlotOverrides(null);
      pushToast("Snack row removed.");
    },
    onError: (_error, slotId) => {
      setSlotOverrides(slots.filter((slot) => slot.id !== slotId));
      pushToast("Snack row removed in preview mode.");
    },
  });

  const skipSlotMutation = useMutation({
    mutationFn: async (slotId: number) => {
      await swapSlot(week.id, slotId, {
        isSkipped: true,
        recipeId: null,
        selectedModifierIngredientIds: [],
        isEatingOut: false,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["week-slots", week.id] });
      setSlotOverrides(null);
      pushToast("Marked as didn’t happen. Fridge assumptions updated (preview).");
    },
    onError: (_err, slotId) => {
      const next = slots.map((s) =>
        s.id === slotId ? { ...s, isSkipped: true, recipeId: null, recipeName: null, selectedModifierIngredientIds: [], isEatingOut: false } : s,
      );
      setSlotOverrides(next);
      pushToast("Marked as didn’t happen (preview).");
    },
  });

  const clearWeekMutation = useMutation({
    mutationFn: () => clearWeek(week.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["week-slots", week.id] });
      queryClient.setQueryData(["grocery-list", week.id], createEmptyGroceryList(week.id, week.householdId));
      setSlotOverrides(null);
      setClearWeekOpen(false);
      pushToast("Week cleared. Grocery list reset too.");
    },
    onError: () => {
      setSlotOverrides(createBlankWeekSlots(week.id, [...mealTypes], week.weekStartDate));
      queryClient.setQueryData(["grocery-list", week.id], createEmptyGroceryList(week.id, week.householdId));
      setClearWeekOpen(false);
      pushToast("Week cleared in preview mode.");
    },
  });

  const applyTemplateMutation = useMutation({
    mutationFn: async (template: SavedWeekTemplate) => {
      await applyWeekTemplate(week.id, template.id);
      return template;
    },
    onSuccess: async (template) => {
      await queryClient.invalidateQueries({ queryKey: ["week-slots", week.id] });
      queryClient.setQueryData(["grocery-list", week.id], createEmptyGroceryList(week.id, week.householdId));
      setSlotOverrides(null);
      setLoadTemplateOpen(false);
      setActiveWeekLabel(template.name);
      pushToast(`Loaded “${template.name}” into this week. Grocery list cleared so it can refresh from the new plan.`);
    },
    onError: (_error, template) => {
      setSlotOverrides(mergeSavedTemplateIntoSlots(template, week.id, week.weekStartDate, recipes));
      queryClient.setQueryData(["grocery-list", week.id], createEmptyGroceryList(week.id, week.householdId));
      setLoadTemplateOpen(false);
      setActiveWeekLabel(template.name);
      pushToast(`Loaded “${template.name}” in preview mode.`);
    },
  });

  const saveTemplateMutation = useMutation({
    mutationFn: async (templateName: string) => saveWeekAsTemplate(week.id, templateName),
    onSuccess: (savedWeek) => {
      const snapshot: SavedWeekTemplate = {
        id: savedWeek.id,
        householdId: savedWeek.householdId,
        name: savedWeek.templateName ?? templateNameDraft.trim(),
        createdAt: savedWeek.createdAt,
        slots: slots.map((s) => ({
          dayOfWeek: s.dayOfWeek,
          mealType: s.mealType,
          position: s.position ?? 0,
          recipeId: s.recipeId ?? null,
          recipeName: s.recipeName ?? null,
          isEatingOut: false,
          isSkipped: s.isSkipped,
        })),
      };
      queryClient.setQueryData<SavedWeekTemplate[]>(["saved-weeks"], (prev) => {
        const existing = prev ?? [];
        const idx = existing.findIndex((item) => item.id === snapshot.id);
        return idx >= 0 ? existing.map((item, index) => (index === idx ? snapshot : item)) : [snapshot, ...existing];
      });
      queryClient.setQueryData(["week", savedWeek.id], savedWeek);
      setSaveTemplateOpen(false);
      setTemplateNameDraft("");
      pushToast("Week saved as a reusable template.");
    },
    onError: () => {
      const snapshot: SavedWeekTemplate = {
        id: week.id,
        householdId: week.householdId,
        name: templateNameDraft.trim(),
        createdAt: new Date().toISOString(),
        slots: slots.map((s) => ({
          dayOfWeek: s.dayOfWeek,
          mealType: s.mealType,
          position: s.position ?? 0,
          recipeId: s.recipeId ?? null,
          recipeName: s.recipeName ?? null,
          isEatingOut: false,
          isSkipped: s.isSkipped,
        })),
      };
      queryClient.setQueryData<SavedWeekTemplate[]>(["saved-weeks"], (prev) => {
        const existing = prev ?? [];
        const idx = existing.findIndex((item) => item.id === snapshot.id);
        return idx >= 0 ? existing.map((item, index) => (index === idx ? snapshot : item)) : [snapshot, ...existing];
      });
      setSaveTemplateOpen(false);
      setTemplateNameDraft("");
      pushToast("Week saved as a template in preview mode.");
    },
  });

  function toggleMealType(mealType: MealType) {
    const next = visibleMealTypes.includes(mealType)
      ? visibleMealTypes.filter((entry) => entry !== mealType)
      : [...visibleMealTypes, mealType];
    setVisibleMealTypes(next);
  }

  function jumpToToday() {
    const todayDay = weekDays.find((day) => isWeekColumnToday(week.weekStartDate, day as WeekDay));
    if (!todayDay) return;
    dayRefs.current[todayDay]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  }

  function openRecipeOrPlanner(slot: WeekMealSlot) {
    if (slot.recipeId && !planMode) {
      navigate(`/recipes/${slot.recipeId}`, { state: { from: "/" } });
      return;
    }

    selectSlot(slot.id);
    setSwapTargetIds([slot.id]);
    setSwapDrawerOpen(true);
  }

  function matchingRecipeSlots(slot: WeekMealSlot) {
    if (!slot.recipeId) return [];
    return slots.filter((entry) => entry.recipeId === slot.recipeId && entry.id !== slot.id);
  }

  function startSwap(slot: WeekMealSlot) {
    const matchingSlots = matchingRecipeSlots(slot);
    if (matchingSlots.length > 0) {
      setRepeatAction({ type: "swap", slot, matchingSlots });
      return;
    }
    selectSlot(slot.id);
    setSwapTargetIds([slot.id]);
    setSwapDrawerOpen(true);
  }

  function startRemove(slot: WeekMealSlot) {
    const matchingSlots = matchingRecipeSlots(slot);
    if (matchingSlots.length > 0) {
      setRepeatAction({ type: "remove", slot, matchingSlots });
      return;
    }
    clearSlotMutation.mutate([slot.id]);
  }

  function confirmRepeatAction(scope: "single" | "all") {
    if (!repeatAction) return;
    const targetIds =
      scope === "all"
        ? [repeatAction.slot.id, ...repeatAction.matchingSlots.map((slot) => slot.id)]
        : [repeatAction.slot.id];

    if (repeatAction.type === "swap") {
      selectSlot(repeatAction.slot.id);
      setSwapTargetIds(targetIds);
      setSwapDrawerOpen(true);
    } else {
      clearSlotMutation.mutate(targetIds);
    }

    setRepeatAction(null);
  }

  function openCopyMeal(slot: WeekMealSlot) {
    if (!slot.recipeId) return;
    const eligibleTargetIds = slots
      .filter((entry) => entry.mealType === slot.mealType && entry.id !== slot.id)
      .map((entry) => entry.id);
    setCopyMealSlot(slot);
    setCopyTargetIds(eligibleTargetIds.filter((id) => {
      const entry = slots.find((slotEntry) => slotEntry.id === id);
      return entry ? entry.recipeId == null : false;
    }));
  }

  function toggleCopyTarget(slotId: number) {
    setCopyTargetIds((current) => (current.includes(slotId) ? current.filter((id) => id !== slotId) : [...current, slotId]));
  }

  function applyCopyMeal() {
    if (!copyMealSlot || copyTargetIds.length === 0) return;
    copyMealMutation.mutate({ sourceSlot: copyMealSlot, targetIds: copyTargetIds });
  }

  function handleDragDrop(targetSlotId: number) {
    if (!planMode || draggedSlotId == null || draggedSlotId === targetSlotId) return;
    const sourceSlot = slots.find((slot) => slot.id === draggedSlotId);
    const targetSlot = slots.find((slot) => slot.id === targetSlotId);
    if (!sourceSlot || !targetSlot || !sourceSlot.recipeId) {
      setDraggedSlotId(null);
      setDropTargetSlotId(null);
      return;
    }

    const sourceRecipeId = sourceSlot.recipeId ?? null;
    const sourceModifierIds = sourceSlot.selectedModifierIngredientIds ?? [];
    const targetRecipeId = targetSlot.recipeId ?? null;
    const targetModifierIds = targetSlot.selectedModifierIngredientIds ?? [];

    Promise.all([
      swapSlot(week.id, targetSlot.id, {
        recipeId: sourceRecipeId,
        selectedModifierIngredientIds: sourceModifierIds,
        isSkipped: false,
        isEatingOut: false,
      }),
      swapSlot(week.id, sourceSlot.id, {
        recipeId: targetRecipeId,
        selectedModifierIngredientIds: targetModifierIds,
        isSkipped: false,
        isEatingOut: false,
      }),
    ])
      .then(async () => {
        await queryClient.invalidateQueries({ queryKey: ["week-slots", week.id] });
        setSlotOverrides(null);
        pushToast(targetRecipeId ? "Meals swapped." : "Meal moved.");
      })
      .catch(() => {
        const sourceRecipe = recipes.find((recipe) => recipe.id === sourceRecipeId);
        const targetRecipe = recipes.find((recipe) => recipe.id === targetRecipeId);
        const nextSlots = slots.map((entry) => {
          if (entry.id === targetSlot.id) {
            return {
              ...entry,
              recipeId: sourceRecipeId,
              recipeName: sourceRecipe?.name ?? null,
              selectedModifierIngredientIds: sourceModifierIds,
              isSkipped: false,
            };
          }
          if (entry.id === sourceSlot.id) {
            return {
              ...entry,
              recipeId: targetRecipeId,
              recipeName: targetRecipe?.name ?? null,
              selectedModifierIngredientIds: targetModifierIds,
              isSkipped: false,
            };
          }
          return entry;
        });
        setSlotOverrides(nextSlots);
        pushToast(targetRecipeId ? "Meals swapped in preview mode." : "Meal moved in preview mode.");
      })
      .finally(() => {
        setDraggedSlotId(null);
        setDropTargetSlotId(null);
      });
  }
  const todayDayKey = weekDays.find((d) => isWeekColumnToday(week.weekStartDate, d as WeekDay));
  const todayColumnIndex = todayDayKey ? weekDays.indexOf(todayDayKey as (typeof weekDays)[number]) : -1;

  useEffect(() => {
    const el = weekScrollerRef.current;
    if (!el || viewMode !== "week") return;
    const measure = () => {
      const first = el.querySelector("[data-day-snap]") as HTMLElement | null;
      if (!first) return 0;
      const cs = getComputedStyle(el);
      const gap = Number.parseFloat(cs.gap || "12") || 12;
      return first.offsetWidth + gap;
    };
    const onScroll = () => {
      const step = measure();
      if (!step) return;
      const idx = Math.min(6, Math.max(0, Math.round(el.scrollLeft / step)));
      setScrollDayIndex(idx);
      const isDesktop = typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches;
      if (isDesktop || todayColumnIndex < 0) {
        setShowJumpToToday(false);
        return;
      }
      setShowJumpToToday(idx !== todayColumnIndex);
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(onScroll) : null;
    ro?.observe(el);
    return () => {
      el.removeEventListener("scroll", onScroll);
      ro?.disconnect();
    };
  }, [viewMode, slots, visibleMealTypes, todayColumnIndex]);

  return (
    <ErrorBoundary>
      <div className="relative pb-[calc(9rem+env(safe-area-inset-bottom))] pt-1 lg:pb-28 lg:pt-2">
        <header className="sticky top-0 z-30 border-b border-nourish-border/80 bg-nourish-bg/95 px-4 py-3 backdrop-blur-md lg:relative lg:z-0 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
          <div className="mx-auto flex w-full max-w-[min(100%,1170px)] items-center gap-2">
            <h1 className="shrink-0 font-heading text-2xl tracking-tight text-nourish-ink sm:text-3xl lg:hidden">Nourish</h1>
            <div className="flex min-w-0 flex-1 items-center justify-center gap-3 sm:gap-4">
              <button
                type="button"
                className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-full border border-nourish-border bg-white text-nourish-ink shadow-sm transition hover:bg-nourish-bg"
                aria-label="Previous week"
                onClick={() =>
                  setVisibleWeekStartDate(formatISO(subDays(parseISO(week.weekStartDate), 7), { representation: "date" }))
                }
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("month")}
                className="min-w-0 rounded-full border border-nourish-border bg-white px-4 py-2 text-center text-[11px] leading-tight text-nourish-muted shadow-sm transition hover:bg-nourish-bg sm:px-5 sm:text-sm"
                aria-label={`Open month view for ${formatWeekRange(week.weekStartDate)}`}
              >
                {formatWeekRange(week.weekStartDate)}
              </button>
              <button
                type="button"
                className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-full border border-nourish-border bg-white text-nourish-ink shadow-sm transition hover:bg-nourish-bg"
                aria-label="Next week"
                onClick={() =>
                  setVisibleWeekStartDate(formatISO(addDays(parseISO(week.weekStartDate), 7), { representation: "date" }))
                }
              >
                <ChevronRight size={22} />
              </button>
            </div>
          </div>
        </header>

        {viewMode === "week" ? (
          <div className="mx-auto mb-2 flex max-w-[min(100%,1170px)] justify-between gap-0.5 px-4 lg:hidden">
            {weekDays.map((day, i) => {
              const colDate = addDays(weekStartDate, i);
              const colToday = isToday(colDate);
              const daySlots = slots.filter((s) => s.dayOfWeek === day);
              const mains = daySlots.filter((s) => s.mealType !== "Snack");
              const hasOpen = mains.some((s) => !s.recipeId && !s.isSkipped);
              const allSettled = mains.length > 0 && !hasOpen;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => {
                    dayRefs.current[day]?.scrollIntoView({ behavior: "auto", inline: "start", block: "nearest" });
                  }}
                  className={cn(
                    "flex min-h-[44px] min-w-0 flex-1 flex-col items-center justify-center rounded-xl px-0.5 py-1 text-[11px] leading-tight transition",
                    colToday ? "bg-nourish-sage font-semibold text-white shadow-sm" : "text-nourish-ink hover:bg-nourish-bg",
                  )}
                >
                  <span className="font-semibold">{day.slice(0, 3)}</span>
                  <span className={colToday ? "text-white/95" : "text-nourish-muted"}>{format(colDate, "d")}</span>
                  <span className="mt-0.5 flex h-2 items-center justify-center">
                    {allSettled ? <span className="h-1.5 w-1.5 rounded-full bg-nourish-sage" /> : null}
                    {!allSettled && hasOpen ? <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> : null}
                  </span>
                </button>
              );
            })}
          </div>
        ) : null}

        {showJumpToToday && viewMode === "week" ? (
          <button
            type="button"
            className="fixed bottom-[calc(9.5rem+env(safe-area-inset-bottom))] right-4 z-[28] rounded-full border border-nourish-border bg-white px-4 py-2.5 text-xs font-semibold text-nourish-sage shadow-md transition hover:bg-nourish-bg lg:bottom-24"
            onClick={() => {
              jumpToToday();
              setShowJumpToToday(false);
            }}
          >
            Today
          </button>
        ) : null}

        {viewMode === "week" ? (
          <section className="mx-auto w-full max-w-[min(100%,1170px)] px-4 pb-2">
            <div className="overflow-hidden rounded-2xl border border-nourish-border bg-white shadow-sm">
              <div className="flex flex-wrap items-center gap-2 border-b border-nourish-border/70 px-4 py-3">
                {mealTypes.map((mealType) => (
                  <button
                    key={mealType}
                    type="button"
                    onClick={() => toggleMealType(mealType)}
                    className={`inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-full border-2 px-4 text-sm font-medium transition ${
                      visibleMealTypes.includes(mealType)
                        ? "border-nourish-sage bg-nourish-sage text-white"
                        : "border-nourish-sage/50 bg-white text-nourish-sage hover:border-nourish-sage"
                    }`}
                  >
                    {mealType}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPlanMode((current) => !current)}
                  className={cn(
                    "inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-full border px-4 text-sm font-medium transition",
                    planMode
                      ? "border-nourish-terracotta bg-nourish-terracotta text-white"
                      : "border-nourish-border bg-white text-nourish-ink hover:border-nourish-terracotta/40 hover:text-nourish-terracotta",
                  )}
                >
                  <PencilRuler size={16} />
                  {planMode ? "Plan mode on" : "Plan mode"}
                </button>
                {planMode ? (
                  <>
                    <button
                      type="button"
                      className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-full border border-nourish-border bg-white px-4 text-sm font-medium text-nourish-ink transition hover:border-nourish-sage/40 hover:text-nourish-sage"
                      onClick={() => setLoadTemplateOpen(true)}
                    >
                      Choose template
                    </button>
                    <button
                      type="button"
                      className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-full border border-nourish-border bg-white px-4 text-sm font-medium text-nourish-ink transition hover:border-nourish-sage/40 hover:text-nourish-sage"
                      onClick={() => {
                        setTemplateNameDraft(week.templateName ?? `Week of ${format(parseISO(week.weekStartDate), "MMM d")}`);
                        setSaveTemplateOpen(true);
                      }}
                    >
                      Save template
                    </button>
                    <button
                      type="button"
                      className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-full border border-nourish-border bg-white px-4 text-sm font-medium text-nourish-ink transition hover:border-nourish-terracotta/40 hover:text-nourish-terracotta"
                      onClick={() => setClearWeekOpen(true)}
                    >
                      Clear this week
                    </button>
                  </>
                ) : null}
                <div className="relative z-10 ml-auto" ref={dotsHelpRef}>
                  <button
                    type="button"
                    className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-nourish-border text-nourish-muted transition hover:bg-nourish-bg hover:text-nourish-ink"
                    aria-expanded={dotsHelpOpen}
                    aria-label="What do the meal dots mean?"
                    onClick={() => setDotsHelpOpen((o) => !o)}
                  >
                    <CircleHelp size={18} />
                  </button>
                  {dotsHelpOpen ? (
                    <div className="absolute right-0 top-full mt-1 w-72 rounded-xl border border-nourish-border bg-white p-4 text-left text-xs leading-relaxed text-nourish-ink shadow-lg">
                      <p className="font-semibold text-nourish-ink">Weekly planner guide</p>
                      <div className="mt-3 space-y-3 text-nourish-muted">
                        <div>
                          <p className="font-semibold text-nourish-ink">Amber dot on a day</p>
                          <p className="mt-1">This day has a nutrition gap. Add or adjust meals and snacks to round it out.</p>
                        </div>
                        <div>
                          <p className="font-semibold text-nourish-ink">Colored dots under meals</p>
                          <p className="mt-1">Each dot is a MyPlate-style food group in that meal, including any add-ons you selected.</p>
                        </div>
                        <div>
                          <p className="font-semibold text-nourish-ink">Plan mode</p>
                          <p className="mt-1">Use plan mode to add meals, drag them between days, load templates, or clear the week.</p>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="relative">
                <div
                  ref={weekScrollerRef}
                  className="flex w-full snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-4 pb-24 pt-3 max-lg:pb-24 lg:grid lg:min-w-0 lg:grid-cols-7 lg:gap-2 lg:overflow-visible lg:px-3 lg:pb-6 lg:pt-3"
                >
                  {weekDays.map((day) => (
                    <div
                      key={day}
                      data-day-snap
                      ref={(node) => {
                        dayRefs.current[day] = node;
                      }}
                      className="w-[calc(100%-1.25rem)] max-w-[calc(100%-1.25rem)] shrink-0 snap-start max-lg:flex-none lg:w-auto lg:max-w-none lg:min-w-0"
                    >
                      <DayColumn
                        day={day}
                        slots={grouped[day] ?? []}
                        recipes={recipes}
                        ingredients={ingredients}
                        isToday={isWeekColumnToday(week.weekStartDate, day as WeekDay)}
                        planningMode={planMode}
                        onSlotPrimaryAction={openRecipeOrPlanner}
                        onSlotEdit={startSwap}
                        onCopyMeal={openCopyMeal}
                        onSkipSlot={(slotId) => skipSlotMutation.mutate(slotId)}
                        onClearSlot={(slotId) => {
                          const slot = slots.find((entry) => entry.id === slotId);
                          if (slot) startRemove(slot);
                        }}
                        onDeleteSlot={(slotId) => deleteSlotMutation.mutate(slotId)}
                        onAddSnack={() => addSnackMutation.mutate(day as WeekDay)}
                        dragState={{
                          draggedSlotId,
                          dropTargetSlotId,
                          onDragStart: (slotId) => setDraggedSlotId(slotId),
                          onDragEnd: () => {
                            setDraggedSlotId(null);
                            setDropTargetSlotId(null);
                          },
                          onDragOver: (slotId) => setDropTargetSlotId(slotId),
                          onDrop: handleDragDrop,
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center gap-1.5 px-4 pb-3 lg:hidden" aria-hidden>
                {weekDays.map((day, i) => (
                  <span
                    key={day}
                    className={`h-1.5 w-1.5 rounded-full ${i === scrollDayIndex ? "bg-nourish-sage" : "bg-nourish-border"}`}
                  />
                ))}
              </div>
            </div>
          </section>
        ) : (
          <section className="mx-auto w-full max-w-[min(100%,1170px)] px-4 pb-2">
            <div className="rounded-2xl border border-nourish-border bg-white p-4 shadow-sm lg:p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  className="button-secondary flex min-h-11 min-w-11 shrink-0 items-center justify-center p-0"
                  onClick={() => setMonthCursor((current) => subMonths(current, 1))}
                  aria-label="Previous month"
                >
                  <ChevronLeft size={20} className="mx-auto" />
                </button>
                <h2 className="min-w-0 flex-1 text-center text-lg font-semibold text-nourish-ink sm:text-xl">
                  {format(monthCursor, "MMMM yyyy")}
                </h2>
                <button
                  type="button"
                  className="button-secondary flex min-h-11 min-w-11 shrink-0 items-center justify-center p-0"
                  onClick={() => setMonthCursor((current) => addMonths(current, 1))}
                  aria-label="Next month"
                >
                  <ChevronRight size={20} className="mx-auto" />
                </button>
              </div>
              <button type="button" className="button-secondary mb-4 w-full" onClick={() => setViewMode("week")}>
                Back to week
              </button>
              <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase tracking-wide text-nourish-muted">
                {weekDays.map((day) => (
                  <div key={day}>{day.slice(0, 3)}</div>
                ))}
              </div>
              <div className="space-y-1.5">
                {monthWeekRows.map((row) => {
                  const rowStart = getWeekStartForDate(row[0]);
                  const rowWeekIso = formatISO(rowStart, { representation: "date" });
                  const isPlannerWeek = rowWeekIso === formatISO(parseISO(week.weekStartDate), { representation: "date" });
                  return (
                    <button
                      key={rowWeekIso}
                      type="button"
                      onClick={() => {
                        setVisibleWeekStartDate(rowWeekIso);
                        setViewMode("week");
                      }}
                      className={cn(
                        "flex w-full rounded-2xl border p-1.5 text-left transition sm:p-2",
                        isPlannerWeek ? "border-nourish-sage bg-nourish-sage/10" : "border-nourish-border bg-[#fcfaf7] hover:border-nourish-sage/30",
                      )}
                    >
                      {row.map((date) => {
                        const iso = formatISO(date, { representation: "date" });
                        const inMonth = isSameMonth(date, monthCursor);
                        const planned = slotDatesWithRecipes.has(iso);
                        const today = isToday(date);
                        return (
                          <div key={iso} className="flex min-w-0 flex-1 flex-col items-center gap-1 py-1 text-center">
                            <span
                              className={cn(
                                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
                                today ? "border-2 border-nourish-sage text-nourish-sage" : "",
                                !inMonth ? "text-nourish-muted/60" : "text-nourish-ink",
                              )}
                            >
                              {format(date, "d")}
                            </span>
                            {planned ? (
                              <span className="h-1.5 w-1.5 rounded-full bg-nourish-sage" aria-hidden />
                            ) : (
                              <span className="h-1.5 w-1.5" aria-hidden />
                            )}
                          </div>
                        );
                      })}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        <div className="pointer-events-none fixed inset-x-0 z-[26] flex justify-center px-4 pt-2 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] lg:bottom-8 lg:px-8">
          <div className="pointer-events-auto flex w-full max-w-[min(100%,1170px)] items-center justify-between gap-3 rounded-2xl border border-nourish-border bg-white/95 px-4 py-3 shadow-lg backdrop-blur-md">
            <div className="min-w-0 flex-1 text-sm text-nourish-ink">
              {isApproved ? (
                <Link to="/prep-sheet" className="font-medium text-nourish-sage underline-offset-2 hover:underline">
                  Approved · View prep sheet →
                </Link>
              ) : unplannedMainSlots === 0 ? (
                <span>Ready to approve</span>
              ) : planMode ? (
                <span>
                  {unplannedMainSlots} meal{unplannedMainSlots === 1 ? "" : "s"} unplanned this week
                </span>
              ) : (
                <span>Keep planning this week when you’re ready.</span>
              )}
            </div>
            {!isApproved && unplannedMainSlots === 0 ? (
              <button
                type="button"
                className="shrink-0 rounded-full bg-nourish-sage px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-nourish-sage/90"
                onClick={() => {
                  setSwapDrawerOpen(false);
                  setApproveReviewOpen(true);
                }}
              >
                Approve →
              </button>
            ) : null}
          </div>
        </div>

        <BottomSheet open={approveReviewOpen} title="Confirm week" onClose={() => setApproveReviewOpen(false)}>
          <div className="space-y-4">
            <p className="text-sm text-nourish-muted">Review this week before saving it to your library.</p>
            <div className="max-h-[50vh] space-y-3 overflow-y-auto pr-1">
              {weekDays.map((day) => {
                const daySlots = slots.filter((s) => s.dayOfWeek === day);
                return (
                  <div key={day} className="rounded-xl border border-nourish-border bg-nourish-bg/40 p-3">
                    <p className="text-xs font-semibold tracking-wide text-nourish-muted">{day}</p>
                    <ul className="mt-2 space-y-1.5 text-sm text-nourish-ink">
                      {daySlots.map((s) => {
                        const open =
                          s.mealType !== "Snack" && !s.recipeId && !s.isSkipped;
                        return (
                          <li key={s.id} className="flex justify-between gap-2">
                            <span className="text-nourish-muted">{s.mealType}</span>
                            <span
                              className={`min-w-0 text-right ${open ? "rounded-md bg-amber-100/90 px-2 py-0.5 font-medium text-amber-950" : ""}`}
                            >
                              {s.isSkipped ? "Skipped" : s.recipeName ?? "Open"}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
            <button
              type="button"
              className="button-primary w-full"
              onClick={() => approveWeekMutation.mutate()}
              disabled={approveWeekMutation.isPending}
            >
              Confirm & approve
            </button>
            <button type="button" className="button-secondary w-full" onClick={() => setApproveReviewOpen(false)}>
              Keep editing
            </button>
          </div>
        </BottomSheet>

        <BottomSheet
          open={repeatAction != null}
          title={repeatAction?.type === "swap" ? "Swap repeated meal?" : "Remove repeated meal?"}
          onClose={() => setRepeatAction(null)}
        >
          {repeatAction ? (
            <div className="space-y-4">
              <p className="text-sm text-nourish-muted">
                {repeatAction.slot.recipeName ?? "This meal"} appears on{" "}
                {repeatAction.matchingSlots.map((slot) => slot.dayOfWeek).join(", ")} too.
              </p>
              <button type="button" className="button-primary w-full" onClick={() => confirmRepeatAction("single")}>
                {repeatAction.type === "swap" ? `Only ${repeatAction.slot.dayOfWeek}` : `Remove only ${repeatAction.slot.dayOfWeek}`}
              </button>
              <button type="button" className="button-secondary w-full" onClick={() => confirmRepeatAction("all")}>
                {repeatAction.type === "swap"
                  ? `Also change ${repeatAction.matchingSlots.map((slot) => slot.dayOfWeek).join(", ")}`
                  : `Remove from ${[repeatAction.slot, ...repeatAction.matchingSlots].map((slot) => slot.dayOfWeek).join(", ")}`}
              </button>
            </div>
          ) : null}
        </BottomSheet>

        <BottomSheet
          open={copyMealSlot != null}
          title="Add to other days"
          onClose={() => {
            setCopyMealSlot(null);
            setCopyTargetIds([]);
          }}
        >
          {copyMealSlot ? (
            <div className="space-y-4">
              <p className="text-sm text-nourish-muted">
                Add {copyMealSlot.recipeName} to more {copyMealSlot.mealType.toLowerCase()} slots this week.
              </p>
              <div className="space-y-2">
                {slots
                  .filter((entry) => entry.mealType === copyMealSlot.mealType && entry.id !== copyMealSlot.id)
                  .map((entry) => (
                    <label
                      key={entry.id}
                      className={cn(
                        "flex items-center justify-between rounded-xl border px-3 py-2 text-sm",
                        copyTargetIds.includes(entry.id) ? "border-nourish-sage bg-white" : "border-nourish-border bg-white/70",
                      )}
                    >
                      <span className="text-nourish-ink">
                        {entry.dayOfWeek}
                        {entry.position > 0 ? ` · Snack ${entry.position + 1}` : ""}
                      </span>
                      <span className="flex items-center gap-2">
                        {entry.recipeName ? <span className="text-xs text-nourish-muted">{entry.recipeName}</span> : null}
                        <input
                          type="checkbox"
                          checked={copyTargetIds.includes(entry.id)}
                          onChange={() => toggleCopyTarget(entry.id)}
                          className="h-4 w-4 rounded border-nourish-border text-nourish-sage focus:ring-nourish-sage"
                        />
                      </span>
                    </label>
                  ))}
              </div>
              <button type="button" className="button-primary w-full" onClick={applyCopyMeal} disabled={copyTargetIds.length === 0 || copyMealMutation.isPending}>
                Add to {copyTargetIds.length} day{copyTargetIds.length === 1 ? "" : "s"}
              </button>
            </div>
          ) : null}
        </BottomSheet>

        <BottomSheet open={loadTemplateOpen} title="Choose weekly template" onClose={() => setLoadTemplateOpen(false)}>
          {savedTemplates.length > 0 ? (
            <div className="space-y-3">
              {savedTemplates.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className="w-full rounded-2xl border border-nourish-border bg-white p-4 text-left transition hover:border-nourish-sage/40 hover:bg-nourish-bg/60"
                  onClick={() => applyTemplateMutation.mutate(t)}
                  disabled={applyTemplateMutation.isPending}
                >
                  <p className="font-semibold text-nourish-ink">{t.name}</p>
                  <p className="mt-2 line-clamp-2 text-xs text-nourish-muted">
                    {t.slots
                      .filter((s) => s.recipeName)
                      .slice(0, 4)
                      .map((s) => s.recipeName)
                      .join(" · ")}
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4 text-center">
              <p className="text-sm text-nourish-muted">You don’t have any saved weekly templates yet.</p>
              <button
                type="button"
                className="button-primary w-full"
                onClick={() => {
                  setLoadTemplateOpen(false);
                  setTemplateNameDraft(`Week of ${format(parseISO(week.weekStartDate), "MMM d")}`);
                  setSaveTemplateOpen(true);
                }}
              >
                Save this week as your first template
              </button>
            </div>
          )}
        </BottomSheet>

        <BottomSheet open={clearWeekOpen} title="Clear this week?" onClose={() => setClearWeekOpen(false)}>
          <div className="space-y-4">
            <p className="text-sm text-nourish-muted">
              Clear all meals for {formatWeekRange(week.weekStartDate)}? This can&apos;t be undone.
            </p>
            <button
              type="button"
              className="button-primary w-full"
              onClick={() => clearWeekMutation.mutate()}
              disabled={clearWeekMutation.isPending}
            >
              Clear all meals and grocery
            </button>
            <button type="button" className="button-secondary w-full" onClick={() => setClearWeekOpen(false)}>
              Cancel
            </button>
          </div>
        </BottomSheet>

        <BottomSheet open={saveTemplateOpen} title="Save as a Weekly Template" onClose={() => setSaveTemplateOpen(false)}>
          <div className="space-y-4">
            <p className="text-sm text-nourish-muted">
              Save this week so you can drop it into a future planner with one tap.
            </p>
            <div className="space-y-2">
              <label htmlFor="template-name" className="text-sm font-semibold text-nourish-ink">
                Template name
              </label>
              <input
                id="template-name"
                className="input w-full"
                value={templateNameDraft}
                onChange={(event) => setTemplateNameDraft(event.target.value)}
                placeholder="Weeknight staples"
              />
            </div>
            <button
              type="button"
              className="button-primary w-full"
              disabled={saveTemplateMutation.isPending || !templateNameDraft.trim()}
              onClick={() => saveTemplateMutation.mutate(templateNameDraft.trim())}
            >
              Save template
            </button>
            <button type="button" className="button-secondary w-full" onClick={() => setSaveTemplateOpen(false)}>
              Cancel
            </button>
          </div>
        </BottomSheet>

        <SwapDrawer
          open={swapDrawerOpen}
          slot={selectedSlot}
          recipes={recipes}
          ingredients={ingredients}
          fridgeItems={fridgeItems}
          weekSlots={slots}
          initialTargetIds={swapTargetIds}
          onClose={() => setSwapDrawerOpen(false)}
        />
      </div>
    </ErrorBoundary>
  );
}
