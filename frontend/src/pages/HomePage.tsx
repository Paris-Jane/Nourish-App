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
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, CircleHelp, MoreHorizontal } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveWeek, createWeek, generateWeek, getWeekSlots, swapSlot } from "api/weeks";
import { BottomSheet } from "components/BottomSheet";
import { DayColumn } from "components/DayColumn";
import { ErrorBoundary } from "components/ErrorBoundary";
import { SwapDrawer } from "components/SwapDrawer";
import { useCurrentWeek, useFridgeItems, useGroupedSlots, useRecipes, useSavedWeeks, useWeekSlots } from "hooks/useAppData";
import { useMatchMedia } from "hooks/useMatchMedia";
import { mergeSavedTemplateIntoSlots } from "lib/applySavedTemplate";
import { mockSavedTemplates } from "lib/mockData";
import { cn, createAutoWeekSlots, createBlankWeekSlots, formatWeekRange, mealTypes, weekDays } from "lib/utils";
import { isWeekColumnToday } from "lib/weekCalendar";
import { useToast } from "hooks/useToast";
import { useWeekStore } from "store/weekStore";
import type { MealType, SavedWeekTemplate, Week, WeekDay } from "types/models";

const prepStyles = [
  { title: "Cook each night", value: "DayOf" },
  { title: "One prep day", value: "OnePrepDay" },
  { title: "Two prep days", value: "TwoPrepDays" },
];

type HomeViewMode = "week" | "month";

function getWeekStartForDate(date: Date) {
  return startOfWeek(date, { weekStartsOn: 1 });
}

export function HomePage() {
  const queryClient = useQueryClient();
  const { week, anchorWeekStartDate } = useCurrentWeek();
  const { slots } = useWeekSlots();
  const { grouped } = useGroupedSlots();
  const { recipes } = useRecipes();
  const { items: fridgeItems } = useFridgeItems();
  const { pushToast } = useToast();
  const selectedSlotId = useWeekStore((state) => state.selectedSlotId);
  const selectSlot = useWeekStore((state) => state.selectSlot);
  const swapDrawerOpen = useWeekStore((state) => state.swapDrawerOpen);
  const setSwapDrawerOpen = useWeekStore((state) => state.setSwapDrawerOpen);
  const planningMode = useWeekStore((state) => state.planningMode);
  const setPlanningMode = useWeekStore((state) => state.setPlanningMode);
  const visibleMealTypes = useWeekStore((state) => state.visibleMealTypes);
  const setVisibleMealTypes = useWeekStore((state) => state.setVisibleMealTypes);
  const setSlotOverrides = useWeekStore((state) => state.setSlotOverrides);
  const activeWeekLabel = useWeekStore((state) => state.activeWeekLabel);
  const setActiveWeekLabel = useWeekStore((state) => state.setActiveWeekLabel);
  const setActiveWeekId = useWeekStore((state) => state.setActiveWeekId);
  const setVisibleWeekStartDate = useWeekStore((state) => state.setVisibleWeekStartDate);
  const isDesktopNav = useMatchMedia("(min-width: 1024px)");

  const weekStartDate = useMemo(() => parseISO(week.weekStartDate), [week.weekStartDate]);
  const defaultNextWeekStart = useMemo(() => addDays(weekStartDate, 7), [weekStartDate]);

  const [viewMode, setViewMode] = useState<HomeViewMode>("week");
  const [monthCursor, setMonthCursor] = useState(() => startOfMonth(weekStartDate));
  const [pendingWeekStart, setPendingWeekStart] = useState(defaultNextWeekStart);
  const [selectedPrepStyle, setSelectedPrepStyle] = useState("OnePrepDay");
  const [selectedTime, setSelectedTime] = useState("Under45");
  const { savedTemplates } = useSavedWeeks();
  const [savedWeekSelection, setSavedWeekSelection] = useState<number | null>(savedTemplates[0]?.id ?? null);
  const [simpleNewWeekOpen, setSimpleNewWeekOpen] = useState(false);
  const [approveReviewOpen, setApproveReviewOpen] = useState(false);
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);
  const [loadTemplateOpen, setLoadTemplateOpen] = useState(false);
  const [clearWeekOpen, setClearWeekOpen] = useState(false);
  const [dotsHelpOpen, setDotsHelpOpen] = useState(false);
  const [showJumpToToday, setShowJumpToToday] = useState(false);
  const weekScrollerRef = useRef<HTMLDivElement>(null);
  const [scrollDayIndex, setScrollDayIndex] = useState(0);
  const dayRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const headerMenuRef = useRef<HTMLDivElement>(null);
  const dotsHelpRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMonthCursor(startOfMonth(weekStartDate));
  }, [weekStartDate]);

  useEffect(() => {
    if (!headerMenuOpen) return;
    const close = (e: MouseEvent) => {
      if (headerMenuRef.current && !headerMenuRef.current.contains(e.target as Node)) setHeaderMenuOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [headerMenuOpen]);

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
    () => mainSlots.filter((slot) => slot.recipeId || slot.isEatingOut || slot.isSkipped).length,
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

  const startWeekMutation = useMutation({
    mutationFn: async () => {
      const mode = useWeekStore.getState().planningMode;
      const createdWeek = await createWeek({
        weekStartDate: formatISO(getWeekStartForDate(pendingWeekStart), { representation: "date" }),
        prepStyle: selectedPrepStyle as (typeof week)["prepStyle"],
        maxCookTime: selectedTime as (typeof week)["maxCookTime"],
      });

      if (mode === "auto") {
        await generateWeek(createdWeek.id);
      } else if (mode === "saved") {
        const tmpl = savedTemplates.find((entry) => entry.id === savedWeekSelection) ?? savedTemplates[0];
        if (tmpl) {
          const newSlots = await getWeekSlots(createdWeek.id);
          const slotMap = new Map(newSlots.map((slot) => [`${slot.dayOfWeek}-${slot.mealType}`, slot] as const));

          for (const row of tmpl.slots) {
            if (!visibleMealTypes.includes(row.mealType)) continue;
            const targetSlot = slotMap.get(`${row.dayOfWeek}-${row.mealType}`);
            if (!targetSlot) continue;
            await swapSlot(createdWeek.id, targetSlot.id, {
              recipeId: row.recipeId,
              selectedModifierIngredientIds: [],
              isEatingOut: row.isEatingOut,
              isSkipped: row.isSkipped,
              isLocked: false,
              servingsPlanned: 2,
            });
          }
        }
      }

      const freshSlots = await getWeekSlots(createdWeek.id);
      return { createdWeek, freshSlots };
    },
    onSuccess: async ({ createdWeek, freshSlots }) => {
      setActiveWeekId(createdWeek.id);
      setSlotOverrides(null);
      setSimpleNewWeekOpen(false);
      setMonthCursor(startOfMonth(parseISO(createdWeek.weekStartDate)));
      setViewMode("week");
      await queryClient.invalidateQueries({ queryKey: ["week", createdWeek.id] });
      await queryClient.invalidateQueries({ queryKey: ["week-slots", createdWeek.id] });
      await queryClient.invalidateQueries({ queryKey: ["saved-weeks"] });
      queryClient.setQueryData(["week", createdWeek.id], createdWeek);
      queryClient.setQueryData(["week-slots", createdWeek.id], freshSlots);

      if (useWeekStore.getState().planningMode === "manual") {
        setActiveWeekLabel("Manual week");
        pushToast("Blank week created. Tap any slot to start adding meals.");
      } else if (useWeekStore.getState().planningMode === "saved") {
        const tmpl = savedTemplates.find((entry) => entry.id === savedWeekSelection) ?? savedTemplates[0];
        setActiveWeekLabel(tmpl?.name ?? "Saved week");
        pushToast("Saved week loaded into a new planner.");
      } else {
        setActiveWeekLabel("Auto-planned week");
        pushToast("New week created and auto-planned.");
      }
    },
    onError: () => {
      const nextWeekId = (week.id ?? 1) + 1;

      if (useWeekStore.getState().planningMode === "manual") {
        setSlotOverrides(createBlankWeekSlots(nextWeekId, visibleMealTypes, formatISO(weekStartDate, { representation: "date" })));
        setActiveWeekLabel("Manual week");
        setSimpleNewWeekOpen(false);
        setViewMode("week");
        pushToast("Blank week ready in preview mode. Tap any slot and we’ll recommend recipes by context.");
        return;
      }

      if (useWeekStore.getState().planningMode === "saved") {
        const tmpl = savedTemplates.find((entry) => entry.id === savedWeekSelection) ?? savedTemplates[0];
        if (tmpl) {
          setSlotOverrides(
            mergeSavedTemplateIntoSlots(tmpl, nextWeekId, formatISO(weekStartDate, { representation: "date" }), recipes),
          );
          setActiveWeekLabel(tmpl.name);
        }
        setSimpleNewWeekOpen(false);
        setViewMode("week");
        pushToast("Saved week loaded in preview mode.");
        return;
      }

      setSlotOverrides(
        createAutoWeekSlots({
          baseSlots: slots,
          weekId: nextWeekId,
          visibleMealTypes,
        }),
      );
      setActiveWeekLabel("Auto-planned week");
      setSimpleNewWeekOpen(false);
      setViewMode("week");
      pushToast("New auto-planned week ready in preview mode.");
    },
  });

  const approveWeekMutation = useMutation({
    mutationFn: () => approveWeek(week.id),
    onSuccess: (approvedWeek) => {
      const templateName = `Week of ${format(parseISO(approvedWeek.weekStartDate), "MMM d")}`;
      const enriched: Week = {
        ...approvedWeek,
        status: "Confirmed",
        isSavedTemplate: true,
        templateName,
      };
      queryClient.setQueryData(["week", enriched.id], enriched);
      const snapshot: SavedWeekTemplate = {
        id: enriched.id,
        householdId: enriched.householdId,
        name: templateName,
        createdAt: new Date().toISOString(),
        slots: slots.map((s) => ({
          dayOfWeek: s.dayOfWeek,
          mealType: s.mealType,
          recipeId: s.recipeId ?? null,
          recipeName: s.recipeName ?? null,
          isEatingOut: s.isEatingOut,
          isSkipped: s.isSkipped,
        })),
      };
      const existing = queryClient.getQueryData<SavedWeekTemplate[]>(["saved-weeks"]) ?? [...mockSavedTemplates];
      const idx = existing.findIndex((w) => w.id === snapshot.id);
      const nextSaved = idx >= 0 ? existing.map((w, i) => (i === idx ? snapshot : w)) : [...existing, snapshot];
      queryClient.setQueryData(["saved-weeks"], nextSaved);
      setApproveReviewOpen(false);
      pushToast("Week saved to your library.");
    },
    onError: () => {
      const templateName = `Week of ${format(parseISO(week.weekStartDate), "MMM d")}`;
      const enriched: Week = { ...week, status: "Confirmed", isSavedTemplate: true, templateName };
      queryClient.setQueryData(["week", enriched.id], enriched);
      const snapshot: SavedWeekTemplate = {
        id: enriched.id,
        householdId: enriched.householdId,
        name: templateName,
        createdAt: new Date().toISOString(),
        slots: slots.map((s) => ({
          dayOfWeek: s.dayOfWeek,
          mealType: s.mealType,
          recipeId: s.recipeId ?? null,
          recipeName: s.recipeName ?? null,
          isEatingOut: s.isEatingOut,
          isSkipped: s.isSkipped,
        })),
      };
      const existing = queryClient.getQueryData<SavedWeekTemplate[]>(["saved-weeks"]) ?? [...mockSavedTemplates];
      const idx = existing.findIndex((w) => w.id === snapshot.id);
      const nextSaved = idx >= 0 ? existing.map((w, i) => (i === idx ? snapshot : w)) : [...existing, snapshot];
      queryClient.setQueryData(["saved-weeks"], nextSaved);
      setApproveReviewOpen(false);
      pushToast("Week saved to your library.");
    },
  });

  const clearSlotMutation = useMutation({
    mutationFn: async (slotId: number) => {
      await swapSlot(week.id, slotId, {
        recipeId: null,
        selectedModifierIngredientIds: [],
        isSkipped: false,
        isEatingOut: false,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["week-slots", week.id] });
      setSlotOverrides(null);
      pushToast("Meal removed.");
    },
    onError: (_err, slotId) => {
      const next = slots.map((s) =>
        s.id === slotId
          ? { ...s, recipeId: null, recipeName: null, selectedModifierIngredientIds: [], isSkipped: false, isEatingOut: false }
          : s,
      );
      setSlotOverrides(next);
      pushToast("Meal cleared (preview).");
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

  const toggleDayEatingOutMutation = useMutation({
    mutationFn: async ({ day, next }: { day: WeekDay; next: boolean }) => {
      const daySlots = slots.filter((entry) => entry.dayOfWeek === day);
      await Promise.all(
        daySlots.map((entry) =>
          swapSlot(week.id, entry.id, {
            recipeId: null,
            selectedModifierIngredientIds: [],
            isEatingOut: next,
            isSkipped: false,
          }),
        ),
      );
      return { day, next };
    },
    onSuccess: async ({ day, next }) => {
      await queryClient.invalidateQueries({ queryKey: ["week-slots", week.id] });
      setSlotOverrides(null);
      pushToast(next ? `${day} marked as eating out. Meals were cleared for that day.` : `${day} is back in your planner.`);
    },
    onError: (_error, { day, next }) => {
      const nextSlots = slots.map((entry) =>
        entry.dayOfWeek === day
          ? { ...entry, recipeId: null, recipeName: null, selectedModifierIngredientIds: [], isEatingOut: next, isSkipped: false }
          : entry,
      );
      setSlotOverrides(nextSlots);
      pushToast(next ? `${day} marked as eating out in preview mode.` : `${day} restored in preview mode.`);
    },
  });

  function toggleMealType(mealType: MealType) {
    const next = visibleMealTypes.includes(mealType)
      ? visibleMealTypes.filter((entry) => entry !== mealType)
      : [...visibleMealTypes, mealType];
    setVisibleMealTypes(next);
  }

  function openSimpleNewWeek(startDate = defaultNextWeekStart, mode: "auto" | "manual" = "auto") {
    setPendingWeekStart(getWeekStartForDate(startDate));
    setPlanningMode(mode);
    setSimpleNewWeekOpen(true);
  }

  function buildMyself() {
    setPendingWeekStart(getWeekStartForDate(defaultNextWeekStart));
    setPlanningMode("manual");
    setSimpleNewWeekOpen(false);
    startWeekMutation.mutate();
  }

  function startWeek() {
    startWeekMutation.mutate();
  }

  function jumpToToday() {
    const todayDay = weekDays.find((day) => isWeekColumnToday(week.weekStartDate, day as WeekDay));
    if (!todayDay) return;
    dayRefs.current[todayDay]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  }

  const pendingWeekRangeLabel = formatWeekRange(pendingWeekStart);

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
            <div className="flex min-w-0 flex-1 items-center justify-center gap-1 sm:gap-2">
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
              <p className="min-w-0 truncate px-1 text-center text-[11px] leading-tight text-nourish-muted sm:text-sm">
                {formatWeekRange(week.weekStartDate)}
              </p>
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
            <div className="relative shrink-0 justify-self-end" ref={headerMenuRef}>
              <button
                type="button"
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-nourish-muted transition hover:bg-nourish-border/40 hover:text-nourish-ink"
                aria-expanded={headerMenuOpen}
                aria-haspopup="menu"
                aria-label="Menu"
                onClick={() => setHeaderMenuOpen((o) => !o)}
              >
                <MoreHorizontal size={22} strokeWidth={2} />
              </button>
              {headerMenuOpen && isDesktopNav ? (
                <div
                  role="menu"
                  className="absolute right-0 top-full z-40 mt-1 w-56 overflow-hidden rounded-xl border border-nourish-border bg-white py-1 text-sm shadow-lg"
                >
                  <button
                    type="button"
                    role="menuitem"
                    className="flex w-full px-4 py-3 text-left text-nourish-ink hover:bg-nourish-bg"
                    onClick={() => {
                      setHeaderMenuOpen(false);
                      setLoadTemplateOpen(true);
                    }}
                  >
                    Load a saved week
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    className="flex w-full px-4 py-3 text-left text-nourish-ink hover:bg-nourish-bg"
                    onClick={() => {
                      setHeaderMenuOpen(false);
                      setClearWeekOpen(true);
                    }}
                  >
                    Clear this week
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    className="flex w-full px-4 py-3 text-left text-nourish-ink hover:bg-nourish-bg"
                    onClick={() => {
                      setHeaderMenuOpen(false);
                      setViewMode("month");
                    }}
                  >
                    View month
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    className="flex w-full px-4 py-3 text-left text-nourish-ink hover:bg-nourish-bg"
                    onClick={() => {
                      setHeaderMenuOpen(false);
                      openSimpleNewWeek(defaultNextWeekStart, "auto");
                    }}
                  >
                    New week
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    className="flex w-full px-4 py-3 text-left text-nourish-ink hover:bg-nourish-bg"
                    onClick={() => {
                      setHeaderMenuOpen(false);
                      buildMyself();
                    }}
                  >
                    Build it myself
                  </button>
                  <Link
                    to="/saved-weeks"
                    role="menuitem"
                    className="flex w-full px-4 py-3 text-nourish-ink hover:bg-nourish-bg"
                    onClick={() => setHeaderMenuOpen(false)}
                  >
                    Saved weeks library
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <BottomSheet open={headerMenuOpen && !isDesktopNav} title="Menu" onClose={() => setHeaderMenuOpen(false)}>
          <div className="space-y-2">
            <button
              type="button"
              className="button-secondary w-full"
              onClick={() => {
                setHeaderMenuOpen(false);
                setLoadTemplateOpen(true);
              }}
            >
              Load a saved week
            </button>
            <button
              type="button"
              className="button-secondary w-full"
              onClick={() => {
                setHeaderMenuOpen(false);
                setClearWeekOpen(true);
              }}
            >
              Clear this week
            </button>
            <button
              type="button"
              className="button-secondary w-full"
              onClick={() => {
                setHeaderMenuOpen(false);
                setViewMode("month");
              }}
            >
              View month
            </button>
            <button
              type="button"
              className="button-secondary w-full"
              onClick={() => {
                setHeaderMenuOpen(false);
                openSimpleNewWeek(defaultNextWeekStart, "auto");
              }}
            >
              New week
            </button>
            <button
              type="button"
              className="button-secondary w-full"
              onClick={() => {
                setHeaderMenuOpen(false);
                buildMyself();
              }}
            >
              Build it myself
            </button>
            <Link to="/saved-weeks" className="button-secondary flex w-full justify-center" onClick={() => setHeaderMenuOpen(false)}>
              Saved weeks library
            </Link>
          </div>
        </BottomSheet>

        {viewMode === "week" ? (
          <div className="mx-auto mb-2 flex max-w-[min(100%,1170px)] justify-between gap-0.5 px-4 lg:hidden">
            {weekDays.map((day, i) => {
              const colDate = addDays(weekStartDate, i);
              const colToday = isToday(colDate);
              const daySlots = slots.filter((s) => s.dayOfWeek === day);
              const mains = daySlots.filter((s) => s.mealType !== "Snack");
              const hasOpen = mains.some((s) => !s.recipeId && !s.isEatingOut && !s.isSkipped);
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
                    <div className="absolute right-0 top-full mt-1 w-56 rounded-xl border border-nourish-border bg-white p-3 text-left text-xs leading-relaxed text-nourish-ink shadow-lg">
                      <p className="font-semibold text-nourish-ink">Dots under meals</p>
                      <p className="mt-1 text-nourish-muted">
                        Each dot is a food group in that recipe (grains, protein, vegetables, fruit, dairy, legumes).
                      </p>
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
                        isToday={isWeekColumnToday(week.weekStartDate, day as WeekDay)}
                        dayEatingOut={(grouped[day] ?? []).every((slot) => slot.isEatingOut)}
                        togglePending={toggleDayEatingOutMutation.isPending}
                        onToggleEatingOut={(next) => toggleDayEatingOutMutation.mutate({ day: day as WeekDay, next })}
                        onSlotSelect={(slotId) => {
                          selectSlot(slotId);
                          setSwapDrawerOpen(true);
                        }}
                        onSkipSlot={(slotId) => skipSlotMutation.mutate(slotId)}
                        onClearSlot={(slotId) => clearSlotMutation.mutate(slotId)}
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
              ) : (
                <span>
                  {unplannedMainSlots} meal{unplannedMainSlots === 1 ? "" : "s"} unplanned this week
                </span>
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

        <BottomSheet open={simpleNewWeekOpen} title="Plan your week" onClose={() => setSimpleNewWeekOpen(false)}>
          <div className="space-y-5">
            <p className="text-sm text-nourish-muted">{pendingWeekRangeLabel}</p>
            <div>
              <p className="text-sm font-semibold text-nourish-ink">How do you want to prep this week?</p>
              <div className="mt-3 space-y-2">
                {prepStyles.map((style) => (
                  <button
                    key={style.value}
                    type="button"
                    onClick={() => setSelectedPrepStyle(style.value)}
                    className={`w-full rounded-2xl border p-4 text-left text-sm font-medium transition ${
                      selectedPrepStyle === style.value ? "border-transparent bg-nourish-sage text-white" : "border-nourish-border bg-white text-nourish-ink"
                    }`}
                  >
                    {style.title}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-nourish-ink">Max time per session?</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {[
                  { label: "20 min", value: "Under20" },
                  { label: "45 min", value: "Under45" },
                  { label: "No limit", value: "NoLimit" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSelectedTime(option.value)}
                    className={`min-h-[44px] rounded-xl px-2 text-xs font-medium sm:text-sm ${
                      selectedTime === option.value ? "bg-nourish-terracotta text-white" : "border border-nourish-border bg-white text-nourish-muted"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="button"
              className="button-primary w-full"
              onClick={() => {
                setPlanningMode("auto");
                startWeek();
              }}
              disabled={startWeekMutation.isPending}
            >
              Generate my plan →
            </button>
            <p className="text-center text-xs text-nourish-muted">
              Want a saved template?{" "}
              <Link to="/saved-weeks" className="font-medium text-nourish-sage underline-offset-2 hover:underline">
                Browse saved weeks
              </Link>
            </p>
          </div>
        </BottomSheet>

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
                          s.mealType !== "Snack" && !s.recipeId && !s.isEatingOut && !s.isSkipped;
                        return (
                          <li key={s.id} className="flex justify-between gap-2">
                            <span className="text-nourish-muted">{s.mealType}</span>
                            <span
                              className={`min-w-0 text-right ${open ? "rounded-md bg-amber-100/90 px-2 py-0.5 font-medium text-amber-950" : ""}`}
                            >
                              {s.isSkipped ? "Skipped" : s.isEatingOut ? "Eating out" : s.recipeName ?? "Open"}
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

        <BottomSheet open={loadTemplateOpen} title="Saved weeks" onClose={() => setLoadTemplateOpen(false)}>
          <div className="space-y-3">
            {savedTemplates.map((t) => (
              <button
                key={t.id}
                type="button"
                className="w-full rounded-2xl border border-nourish-border bg-white p-4 text-left transition hover:border-nourish-sage/40 hover:bg-nourish-bg/60"
                onClick={() => {
                  setSlotOverrides(mergeSavedTemplateIntoSlots(t, week.id, week.weekStartDate, recipes));
                  setLoadTemplateOpen(false);
                  pushToast(`Loaded “${t.name}” into this week.`);
                }}
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
        </BottomSheet>

        <BottomSheet open={clearWeekOpen} title="Clear this week?" onClose={() => setClearWeekOpen(false)}>
          <div className="space-y-4">
            <p className="text-sm text-nourish-muted">
              Clear all meals for {formatWeekRange(week.weekStartDate)}? This can&apos;t be undone.
            </p>
            <button
              type="button"
              className="button-primary w-full"
              onClick={() => {
                setSlotOverrides(createBlankWeekSlots(week.id, [...mealTypes], week.weekStartDate));
                setClearWeekOpen(false);
                pushToast("Week cleared.");
              }}
            >
              Clear all meals
            </button>
            <button type="button" className="button-secondary w-full" onClick={() => setClearWeekOpen(false)}>
              Cancel
            </button>
          </div>
        </BottomSheet>

        <SwapDrawer
          open={swapDrawerOpen}
          slot={selectedSlot}
          recipes={recipes}
          fridgeItems={fridgeItems}
          weekSlots={slots}
          onClose={() => setSwapDrawerOpen(false)}
        />
      </div>
    </ErrorBoundary>
  );
}
