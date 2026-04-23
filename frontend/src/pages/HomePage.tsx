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
  subMonths,
} from "date-fns";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, PanelRightOpen, Sparkles, SquarePen } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveWeek, createWeek, generateWeek, getWeekSlots, swapSlot } from "api/weeks";
import { BottomSheet } from "components/BottomSheet";
import { DayColumn } from "components/DayColumn";
import { ErrorBoundary } from "components/ErrorBoundary";
import { SwapDrawer } from "components/SwapDrawer";
import { useCurrentWeek, useFridgeItems, useGroupedSlots, useRecipes, useSavedWeeks, useWeekSlots } from "hooks/useAppData";
import { createAutoWeekSlots, createBlankWeekSlots, createSavedWeekSlots, formatWeekRange, mealTypes, weekDays } from "lib/utils";
import { isWeekColumnToday } from "lib/weekCalendar";
import { useToast } from "hooks/useToast";
import { mockSavedWeeks } from "lib/mockData";
import { useWeekStore } from "store/weekStore";
import type { MealType, Week, WeekDay } from "types/models";

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
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { week } = useCurrentWeek();
  const { slots } = useWeekSlots();
  const { grouped } = useGroupedSlots();
  const { recipes } = useRecipes();
  const { items: fridgeItems } = useFridgeItems();
  const { savedWeeks } = useSavedWeeks();
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

  const weekStartDate = useMemo(() => parseISO(week.weekStartDate), [week.weekStartDate]);
  const defaultNextWeekStart = useMemo(() => addDays(weekStartDate, 7), [weekStartDate]);

  const [viewMode, setViewMode] = useState<HomeViewMode>("week");
  const [monthCursor, setMonthCursor] = useState(() => startOfMonth(weekStartDate));
  const [pendingWeekStart, setPendingWeekStart] = useState(defaultNextWeekStart);
  const [selectedPrepStyle, setSelectedPrepStyle] = useState("OnePrepDay");
  const [selectedTime, setSelectedTime] = useState("Under45");
  const [savedWeekSelection, setSavedWeekSelection] = useState<number | null>(savedWeeks[0]?.id ?? null);
  const [simpleNewWeekOpen, setSimpleNewWeekOpen] = useState(false);
  const [approveReviewOpen, setApproveReviewOpen] = useState(false);
  const [mobileContextOpen, setMobileContextOpen] = useState(false);
  const [dotsLegendOpen, setDotsLegendOpen] = useState(false);
  const weekScrollerRef = useRef<HTMLDivElement>(null);
  const [scrollDayIndex, setScrollDayIndex] = useState(0);
  const dayRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    setMonthCursor(startOfMonth(weekStartDate));
  }, [weekStartDate]);

  useEffect(() => {
    if (viewMode !== "week") return;
    const todayDay = weekDays.find((day) => isWeekColumnToday(week.weekStartDate, day as WeekDay));
    if (!todayDay) return;
    dayRefs.current[todayDay]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  }, [viewMode, week.weekStartDate]);

  const selectedSlot = useMemo(
    () => Object.values(grouped).flat().find((slot) => slot.id === selectedSlotId),
    [grouped, selectedSlotId],
  );

  const mainSlots = useMemo(() => slots.filter((slot) => slot.mealType !== "Snack"), [slots]);
  const coveredMainSlots = useMemo(
    () => mainSlots.filter((slot) => slot.recipeId || slot.isEatingOut).length,
    [mainSlots],
  );
  const openMainSlots = Math.max(0, mainSlots.length - coveredMainSlots);
  const completionPercent = mainSlots.length > 0 ? Math.round((coveredMainSlots / mainSlots.length) * 100) : 0;
  const isApproved = week.status === "Active";

  const summaryLabel = isApproved
    ? "Approved week"
    : coveredMainSlots === 0
      ? "Fresh week"
      : openMainSlots > 0
        ? `${openMainSlots} meal${openMainSlots === 1 ? "" : "s"} still open`
        : "Ready to approve";

  const summaryCopy = isApproved
    ? "This week is locked in. Grocery and fridge planning can follow from here."
    : coveredMainSlots === 0
      ? "Start with an auto plan, build it yourself, or load a saved week you already trust."
      : openMainSlots > 0
        ? "You’ve started the week. Fill the remaining gaps, then approve when it feels settled."
        : "Everything looks placed. Give it one quick review and approve when you’re ready.";

  const monthDays = useMemo(
    () =>
      eachDayOfInterval({
        start: getWeekStartForDate(startOfMonth(monthCursor)),
        end: endOfWeek(endOfMonth(monthCursor), { weekStartsOn: 1 }),
      }),
    [monthCursor],
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
        const savedWeek = savedWeeks.find((entry) => entry.id === savedWeekSelection) ?? savedWeeks[0];
        if (savedWeek) {
          const [templateSlots, newSlots] = await Promise.all([getWeekSlots(savedWeek.id), getWeekSlots(createdWeek.id)]);
          const visibleTemplateSlots = templateSlots.filter((slot) => visibleMealTypes.includes(slot.mealType));
          const slotMap = new Map(
            newSlots.map((slot) => [`${slot.dayOfWeek}-${slot.mealType}`, slot] as const),
          );

          for (const templateSlot of visibleTemplateSlots) {
            const targetSlot = slotMap.get(`${templateSlot.dayOfWeek}-${templateSlot.mealType}`);
            if (!targetSlot) continue;
            await swapSlot(createdWeek.id, targetSlot.id, {
              recipeId: templateSlot.recipeId ?? null,
              selectedModifierIngredientIds: templateSlot.selectedModifierIngredientIds ?? [],
              isEatingOut: templateSlot.isEatingOut,
              isSkipped: templateSlot.isSkipped,
              isLocked: templateSlot.isLocked,
              servingsPlanned: templateSlot.servingsPlanned,
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
        const savedWeek = savedWeeks.find((entry) => entry.id === savedWeekSelection) ?? savedWeeks[0];
        setActiveWeekLabel(savedWeek?.templateName ?? "Saved week");
        pushToast("Saved week loaded into a new planner.");
      } else {
        setActiveWeekLabel("Auto-planned week");
        pushToast("New week created and auto-planned.");
      }
    },
    onError: () => {
      const nextWeekId = (week.id ?? 1) + 1;

      if (useWeekStore.getState().planningMode === "manual") {
        setSlotOverrides(createBlankWeekSlots(nextWeekId, visibleMealTypes));
        setActiveWeekLabel("Manual week");
        setSimpleNewWeekOpen(false);
        setViewMode("week");
        pushToast("Blank week ready in preview mode. Tap any slot and we’ll recommend recipes by context.");
        return;
      }

      if (useWeekStore.getState().planningMode === "saved") {
        const savedWeek = savedWeeks.find((entry) => entry.id === savedWeekSelection) ?? savedWeeks[0];
        if (savedWeek) {
          setSlotOverrides(
            createSavedWeekSlots({
              weekId: nextWeekId,
              visibleMealTypes,
              recipes,
              seed: savedWeek.id,
            }),
          );
          setActiveWeekLabel(savedWeek.templateName ?? "Saved week");
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
        status: "Active",
        isSavedTemplate: true,
        templateName,
      };
      queryClient.setQueryData(["week", enriched.id], enriched);
      const existing = queryClient.getQueryData<Week[]>(["saved-weeks"]) ?? [...mockSavedWeeks];
      const idx = existing.findIndex((w) => w.id === enriched.id);
      const nextSaved = idx >= 0 ? existing.map((w, i) => (i === idx ? enriched : w)) : [...existing, enriched];
      queryClient.setQueryData(["saved-weeks"], nextSaved);
      setApproveReviewOpen(false);
      pushToast("Week saved to your library.");
    },
    onError: () => {
      const templateName = `Week of ${format(parseISO(week.weekStartDate), "MMM d")}`;
      const enriched: Week = { ...week, status: "Active", isSavedTemplate: true, templateName };
      queryClient.setQueryData(["week", enriched.id], enriched);
      const existing = queryClient.getQueryData<Week[]>(["saved-weeks"]) ?? [...mockSavedWeeks];
      const idx = existing.findIndex((w) => w.id === enriched.id);
      const nextSaved = idx >= 0 ? existing.map((w, i) => (i === idx ? enriched : w)) : [...existing, enriched];
      queryClient.setQueryData(["saved-weeks"], nextSaved);
      setApproveReviewOpen(false);
      pushToast("Week saved to your library.");
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

    if (next.length > 0) setVisibleMealTypes(next);
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

  function handlePrimaryAction() {
    if (isApproved) {
      navigate("/grocery");
      return;
    }
    if (coveredMainSlots === 0) {
      setPlanningMode("auto");
      openSimpleNewWeek(defaultNextWeekStart, "auto");
      return;
    }
    setApproveReviewOpen(true);
  }

  const primaryActionLabel = isApproved
    ? "View grocery list"
    : coveredMainSlots === 0
      ? "Plan this week"
      : openMainSlots > 0
        ? "Review and approve"
        : "Approve this week";

  const pendingWeekRangeLabel = formatWeekRange(pendingWeekStart);

  const todayDayKey = weekDays.find((d) => isWeekColumnToday(week.weekStartDate, d as WeekDay));
  const todaySlotsPreview = todayDayKey ? grouped[todayDayKey] ?? [] : [];

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
      setScrollDayIndex(Math.min(6, Math.max(0, Math.round(el.scrollLeft / step))));
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(onScroll) : null;
    ro?.observe(el);
    return () => {
      el.removeEventListener("scroll", onScroll);
      ro?.disconnect();
    };
  }, [viewMode, slots, visibleMealTypes]);

  return (
    <ErrorBoundary>
      <div className="space-y-5 pb-28 lg:pb-10">
        <section className="relative overflow-hidden rounded-[1.8rem] border border-nourish-border bg-[radial-gradient(circle_at_top_left,_rgba(196,113,79,0.12),_transparent_32%),linear-gradient(135deg,#fffdf9_0%,#f6efe5_100%)] p-4 shadow-sm lg:rounded-[2rem] lg:p-7">
          <div className="absolute right-4 top-4 hidden h-28 w-28 rounded-full bg-nourish-sage/10 blur-2xl lg:block" aria-hidden />
          <div className="relative flex flex-col gap-3 lg:gap-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold tracking-wide text-nourish-muted">
                    {viewMode === "week" ? "Current planner" : "Calendar browser"}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide ${
                      isApproved ? "bg-nourish-sage/15 text-nourish-sage" : "bg-nourish-terracotta/12 text-nourish-terracotta"
                    }`}
                  >
                    {isApproved ? "Approved" : "Draft"}
                  </span>
                </div>
                <div>
                  <h1 className="text-4xl sm:text-5xl">Nourish</h1>
                  <p className="mt-2 text-sm sm:text-base text-nourish-ink/80">
                    {formatWeekRange(week.weekStartDate)}
                    {activeWeekLabel ? ` · ${activeWeekLabel}` : ""}
                  </p>
                </div>
                <p className="hidden max-w-2xl text-sm leading-6 text-nourish-muted lg:block">{summaryCopy}</p>
              </div>

              <div className="hidden flex-col gap-3 lg:flex lg:min-w-[280px]">
                <div className="inline-flex w-full rounded-full border border-nourish-border bg-white/90 p-1 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setViewMode("week")}
                    className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${
                      viewMode === "week" ? "bg-nourish-sage text-white" : "text-nourish-muted"
                    }`}
                  >
                    Week
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("month")}
                    className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${
                      viewMode === "month" ? "bg-nourish-sage text-white" : "text-nourish-muted"
                    }`}
                  >
                    Month
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" className="button-primary w-full" onClick={() => openSimpleNewWeek(defaultNextWeekStart, "auto")}>
                    New week
                  </button>
                  <button type="button" className="button-secondary w-full" onClick={buildMyself}>
                    Build it myself
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 lg:hidden">
              <button
                type="button"
                className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-2xl border border-nourish-border bg-white px-3 text-sm font-medium text-nourish-ink shadow-sm"
                onClick={() => openSimpleNewWeek(defaultNextWeekStart, "auto")}
              >
                <Sparkles size={16} aria-hidden />
                New week
              </button>
              <button
                type="button"
                className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-2xl border border-nourish-border bg-white px-3 text-sm font-medium text-nourish-ink shadow-sm"
                onClick={buildMyself}
              >
                <SquarePen size={16} aria-hidden />
                Build myself
              </button>
              <button
                type="button"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-2xl border border-nourish-border bg-white px-3 text-sm font-medium text-nourish-ink shadow-sm"
                onClick={() => setMobileContextOpen((o) => !o)}
                aria-expanded={mobileContextOpen}
                aria-label="Quick context details"
              >
                <PanelRightOpen size={18} aria-hidden />
              </button>
            </div>

            <div className="space-y-1 lg:hidden">
              <div className="flex items-center justify-between gap-2 text-xs text-nourish-muted">
                <span className="truncate">{summaryLabel}</span>
                <span className="shrink-0 tabular-nums">{completionPercent}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-nourish-bg">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-nourish-sage to-nourish-terracotta"
                  style={{ width: `${Math.max(completionPercent, 6)}%` }}
                />
              </div>
            </div>

            {mobileContextOpen ? (
              <div className="rounded-2xl border border-nourish-border/80 bg-white/90 p-4 shadow-sm lg:hidden">
                <p className="text-xs font-semibold tracking-wide text-nourish-muted">Quick context</p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div className="rounded-2xl bg-nourish-bg px-2 py-3 text-center">
                    <p className="text-lg text-nourish-ink">{fridgeItems.length}</p>
                    <p className="mt-1 text-[10px] font-medium tracking-wide text-nourish-muted">Kitchen items</p>
                  </div>
                  <div className="rounded-2xl bg-nourish-bg px-2 py-3 text-center">
                    <p className="text-lg text-nourish-ink">{visibleMealTypes.length}</p>
                    <p className="mt-1 text-[10px] font-medium tracking-wide text-nourish-muted">Meal types</p>
                  </div>
                  <div className="rounded-2xl bg-nourish-bg px-2 py-3 text-center">
                    <p className="text-lg text-nourish-ink">{savedWeeks.length}</p>
                    <p className="mt-1 text-[10px] font-medium tracking-wide text-nourish-muted">Saved weeks</p>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-5 text-nourish-muted">{summaryCopy}</p>
              </div>
            ) : null}

            <div className="hidden gap-3 lg:grid lg:grid-cols-[1.3fr,1fr]">
              <div className="rounded-[1.5rem] border border-nourish-border/80 bg-white/92 p-4 shadow-sm">
                <p className="text-xs font-semibold tracking-wide text-nourish-muted">This week</p>
                <p className="mt-2 text-2xl text-nourish-ink">{summaryLabel}</p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-nourish-bg">
                  <div className="h-full rounded-full bg-gradient-to-r from-nourish-sage to-nourish-terracotta" style={{ width: `${Math.max(completionPercent, 6)}%` }} />
                </div>
                <p className="mt-3 text-sm text-nourish-muted">
                  {coveredMainSlots} of {mainSlots.length} core meals accounted for.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-nourish-border/80 bg-white/88 p-4 shadow-sm">
                <p className="text-xs font-semibold tracking-wide text-nourish-muted">Quick context</p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div className="rounded-2xl bg-nourish-bg px-3 py-3 text-center">
                    <p className="text-lg text-nourish-ink">{fridgeItems.length}</p>
                    <p className="mt-1 text-[11px] font-medium tracking-wide text-nourish-muted">Kitchen items</p>
                  </div>
                  <div className="rounded-2xl bg-nourish-bg px-3 py-3 text-center">
                    <p className="text-lg text-nourish-ink">{visibleMealTypes.length}</p>
                    <p className="mt-1 text-[11px] font-medium tracking-wide text-nourish-muted">Meal types</p>
                  </div>
                  <div className="rounded-2xl bg-nourish-bg px-3 py-3 text-center">
                    <p className="text-lg text-nourish-ink">{savedWeeks.length}</p>
                    <p className="mt-1 text-[11px] font-medium tracking-wide text-nourish-muted">Saved weeks</p>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-nourish-muted">
                  {isApproved
                    ? "This week is set. Grocery is the best next step."
                    : coveredMainSlots === 0
                      ? "Auto plan is fastest. Manual plan gives you the most control."
                      : openMainSlots > 0
                        ? "Tap any open slot to keep filling the week."
                        : "You’re close. Approve when the week feels right."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {viewMode === "week" ? (
          <section className="space-y-3 lg:space-y-4">
            <div className="lg:hidden">
              <div className="rounded-[1.35rem] border border-nourish-border bg-white p-4 shadow-sm">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-nourish-sage">Today</p>
                <p className="mt-1 text-xs text-nourish-muted">{todayDayKey ? `${todayDayKey}` : "This week"}</p>
                <ul className="mt-3 space-y-2">
                  {todaySlotsPreview.length === 0 ? (
                    <li className="text-sm text-nourish-muted">No slots for today.</li>
                  ) : (
                    todaySlotsPreview.map((slot) => (
                      <li key={slot.id} className="flex items-start justify-between gap-2 text-sm">
                        <span className="shrink-0 font-medium text-nourish-muted">{slot.mealType}</span>
                        <span className="min-w-0 text-right text-nourish-ink">
                          {slot.isSkipped
                            ? "Didn’t happen"
                            : slot.isEatingOut
                              ? "Eating out"
                              : slot.recipeName ?? "Not planned yet."}
                        </span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-[1.6rem] border border-nourish-border bg-white p-4 shadow-sm sm:flex-row sm:items-end sm:justify-between lg:p-5">
              <div className="min-w-0">
                <h2 className="text-2xl text-nourish-ink sm:text-3xl">
                  This week
                  <span className="mt-1 block text-sm font-normal text-nourish-muted sm:mt-0 sm:inline sm:before:content-['\00a0\00a0·\00a0\00a0']">
                    Today is shown first on small screens so you can start where you are.
                  </span>
                </h2>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button type="button" className="button-secondary min-h-[44px] whitespace-nowrap px-4" onClick={jumpToToday}>
                  Jump to today
                </button>
              </div>
            </div>

            <div className="-mx-1 flex flex-wrap gap-2 px-1 sm:mx-0 sm:px-0">
              {mealTypes.map((mealType) => (
                <button
                  key={mealType}
                  type="button"
                  onClick={() => toggleMealType(mealType)}
                  className={`inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-full border px-4 text-sm font-medium transition ${
                    visibleMealTypes.includes(mealType)
                      ? "border-nourish-terracotta bg-nourish-terracotta text-white"
                      : "border-nourish-border bg-white text-nourish-muted hover:border-nourish-sage/35"
                  }`}
                >
                  {mealType}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-1">
              <button
                type="button"
                className="self-start text-left text-xs font-medium text-nourish-sage underline-offset-2 hover:underline lg:hidden"
                onClick={() => setDotsLegendOpen((o) => !o)}
              >
                What are these dots?
              </button>
              {dotsLegendOpen ? (
                <div className="rounded-xl border border-nourish-border bg-nourish-bg/80 p-3 text-xs leading-relaxed text-nourish-ink lg:hidden">
                  <p className="font-semibold">Food groups under meals</p>
                  <p className="mt-1 text-nourish-muted">Each dot is a food group represented in that recipe (grains, protein, vegetables, fruit, dairy, legumes).</p>
                </div>
              ) : null}
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-10 bg-gradient-to-l from-[#fbf7f2] via-[#fbf7f2]/90 to-transparent lg:hidden" aria-hidden />
              <div
                ref={weekScrollerRef}
                className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2 pt-1 scroll-smooth max-lg:snap-x max-lg:snap-mandatory lg:mx-0 lg:grid lg:grid-cols-7 lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-0 lg:pt-0"
              >
                {weekDays.map((day) => (
                  <div
                    key={day}
                    data-day-snap
                    ref={(node) => {
                      dayRefs.current[day] = node;
                    }}
                    className="w-[min(88vw,320px)] shrink-0 max-lg:snap-start lg:w-auto lg:min-w-0 lg:snap-none"
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
                    />
                  </div>
                ))}
              </div>
              <div className="mt-2 flex flex-col items-center gap-2 lg:hidden">
                <div className="flex items-center gap-1.5 text-[11px] text-nourish-muted">
                  <span aria-hidden>←</span>
                  <span>Swipe for more days</span>
                  <span aria-hidden>→</span>
                </div>
                <div className="flex justify-center gap-1.5" aria-hidden>
                  {weekDays.map((day, i) => (
                    <span
                      key={day}
                      className={`h-1.5 w-1.5 rounded-full ${i === scrollDayIndex ? "bg-nourish-sage" : "bg-nourish-border"}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {isApproved ? (
              <div className="pt-1">
                <Link
                  to="/prep-sheet"
                  className="button-primary inline-flex min-h-[48px] w-full items-center justify-center sm:w-auto"
                >
                  View prep sheet →
                </Link>
              </div>
            ) : null}
          </section>
        ) : (
          <section className="rounded-[1.6rem] border border-nourish-border bg-white p-4 shadow-sm lg:p-5">
            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold tracking-wide text-nourish-muted">Month view</p>
                <h2 className="mt-2 text-2xl sm:text-3xl text-nourish-ink">{format(monthCursor, "MMMM yyyy")}</h2>
                <p className="mt-2 text-sm text-nourish-muted">Use month view to move around quickly, then drop back into week view to actually plan.</p>
              </div>
              <div className="flex items-center gap-2 self-start lg:self-auto">
                <button type="button" className="button-secondary h-11 w-11 p-0" onClick={() => setMonthCursor((current) => subMonths(current, 1))} aria-label="Previous month">
                  <ChevronLeft size={18} className="mx-auto" />
                </button>
                <button type="button" className="button-secondary" onClick={() => setMonthCursor(startOfMonth(new Date()))}>
                  Current month
                </button>
                <button type="button" className="button-secondary h-11 w-11 p-0" onClick={() => setMonthCursor((current) => addMonths(current, 1))} aria-label="Next month">
                  <ChevronRight size={18} className="mx-auto" />
                </button>
              </div>
            </div>

            <div className="mb-3 grid grid-cols-7 gap-2 text-center text-[11px] font-semibold tracking-wide text-nourish-muted">
              {weekDays.map((day) => (
                <div key={day}>{day.slice(0, 3)}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {monthDays.map((date) => {
                const dayWeekStart = getWeekStartForDate(date);
                const inActiveWeek = formatISO(dayWeekStart, { representation: "date" }) === formatISO(weekStartDate, { representation: "date" });
                const inCurrentMonth = isSameMonth(date, monthCursor);

                return (
                  <button
                    key={date.toISOString()}
                    type="button"
                    onClick={() => {
                      if (inActiveWeek) {
                        setViewMode("week");
                        return;
                      }
                      setPlanningMode("auto");
                      openSimpleNewWeek(dayWeekStart, "auto");
                    }}
                    className={`min-h-[68px] rounded-[1.1rem] border p-2 text-left transition sm:min-h-[74px] sm:rounded-2xl ${
                      inActiveWeek
                        ? "border-nourish-sage bg-nourish-sage/12"
                        : inCurrentMonth
                          ? "border-nourish-border bg-[#fcfaf7] hover:border-nourish-sage/30 hover:bg-nourish-bg"
                          : "border-transparent bg-[#f6f1ea] text-nourish-muted/70"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className={`text-sm font-medium ${inCurrentMonth ? "text-nourish-ink" : "text-nourish-muted"}`}>
                        {format(date, "d")}
                      </span>
                      {isToday(date) ? <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-nourish-sage">Today</span> : null}
                    </div>
                    <div className="mt-6 flex flex-wrap gap-1">
                      {inActiveWeek ? <span className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-nourish-sage">Current week</span> : null}
                      {!inActiveWeek && inCurrentMonth ? <span className="rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-nourish-muted">Start week</span> : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        <div className="border-t border-transparent bg-transparent px-0 py-0 shadow-none backdrop-blur-none">
          <div className="mx-auto flex max-w-5xl flex-col gap-2 rounded-[1.6rem] border border-nourish-border bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between lg:p-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold tracking-wide text-nourish-muted">Next step</p>
              <p className="mt-1 text-sm text-nourish-ink">{summaryLabel}</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button type="button" className="button-primary" onClick={handlePrimaryAction}>
                {primaryActionLabel}
              </button>
              {!isApproved ? (
                <button
                  type="button"
                  className="button-secondary"
                  onClick={() => setViewMode((current) => (current === "week" ? "month" : "week"))}
                >
                  {viewMode === "week" ? "Browse months" : "Back to week"}
                </button>
              ) : null}
            </div>
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

        <BottomSheet open={approveReviewOpen} title="Review your week" onClose={() => setApproveReviewOpen(false)}>
          <div className="space-y-4">
            <p className="text-sm text-nourish-muted">Scan every day before you lock the plan in.</p>
            <div className="max-h-[50vh] space-y-3 overflow-y-auto pr-1">
              {weekDays.map((day) => {
                const daySlots = slots.filter((s) => s.dayOfWeek === day);
                return (
                  <div key={day} className="rounded-xl border border-nourish-border bg-nourish-bg/40 p-3">
                    <p className="text-xs font-semibold tracking-wide text-nourish-muted">{day}</p>
                    <ul className="mt-2 space-y-1.5 text-sm text-nourish-ink">
                      {daySlots.map((s) => (
                        <li key={s.id} className="flex justify-between gap-2">
                          <span className="text-nourish-muted">{s.mealType}</span>
                          <span className="min-w-0 text-right">
                            {s.isSkipped ? "Skipped" : s.isEatingOut ? "Eating out" : s.recipeName ?? "Open"}
                          </span>
                        </li>
                      ))}
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
              Looks good — approve →
            </button>
            <button type="button" className="button-secondary w-full" onClick={() => setApproveReviewOpen(false)}>
              Keep editing
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
