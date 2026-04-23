import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  formatISO,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookCopy, CalendarDays, ChevronLeft, ChevronRight, Sparkles, SquarePen } from "lucide-react";
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
import { useWeekStore } from "store/weekStore";
import type { MealType, WeekDay } from "types/models";

const prepStyles = [
  { title: "Cook each night", value: "DayOf" },
  { title: "One prep day", value: "OnePrepDay" },
  { title: "Two prep days", value: "TwoPrepDays" },
];

const planningModes = [
  { value: "auto", title: "Auto plan", description: "Generate a week for me based on my preferences, time, and saved recipe signals.", icon: Sparkles },
  { value: "manual", title: "Manually plan", description: "Start with a blank week and add meals slot by slot with smart recommendations.", icon: SquarePen },
  { value: "saved", title: "Use a saved week", description: "Start from a week you already loved and adapt it for this week.", icon: BookCopy },
] as const;

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
  const prepStyleOpen = useWeekStore((state) => state.prepStyleOpen);
  const setPrepStyleOpen = useWeekStore((state) => state.setPrepStyleOpen);
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
  const weekScrollerRef = useRef<HTMLDivElement | null>(null);
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
      const createdWeek = await createWeek({
        weekStartDate: formatISO(getWeekStartForDate(pendingWeekStart), { representation: "date" }),
        prepStyle: selectedPrepStyle as (typeof week)["prepStyle"],
        maxCookTime: selectedTime as (typeof week)["maxCookTime"],
      });

      if (planningMode === "auto") {
        await generateWeek(createdWeek.id);
      } else if (planningMode === "saved") {
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
      setPrepStyleOpen(false);
      setMonthCursor(startOfMonth(parseISO(createdWeek.weekStartDate)));
      setViewMode("week");
      await queryClient.invalidateQueries({ queryKey: ["week", createdWeek.id] });
      await queryClient.invalidateQueries({ queryKey: ["week-slots", createdWeek.id] });
      await queryClient.invalidateQueries({ queryKey: ["saved-weeks"] });
      queryClient.setQueryData(["week", createdWeek.id], createdWeek);
      queryClient.setQueryData(["week-slots", createdWeek.id], freshSlots);

      if (planningMode === "manual") {
        setActiveWeekLabel("Manual week");
        pushToast("Blank week created. Tap any slot to start adding meals.");
      } else if (planningMode === "saved") {
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

      if (planningMode === "manual") {
        setSlotOverrides(createBlankWeekSlots(nextWeekId, visibleMealTypes));
        setActiveWeekLabel("Manual week");
        setPrepStyleOpen(false);
        setViewMode("week");
        pushToast("Blank week ready in preview mode. Tap any slot and we’ll recommend recipes by context.");
        return;
      }

      if (planningMode === "saved") {
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
        setPrepStyleOpen(false);
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
      setPrepStyleOpen(false);
      setViewMode("week");
      pushToast("New auto-planned week ready in preview mode.");
    },
  });

  const approveWeekMutation = useMutation({
    mutationFn: () => approveWeek(week.id),
    onSuccess: (approvedWeek) => {
      queryClient.setQueryData(["week", approvedWeek.id], approvedWeek);
      pushToast("Week approved.");
    },
    onError: () => {
      pushToast("Week approved in preview mode.");
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

  function openNewWeek(startDate = defaultNextWeekStart, mode?: "auto" | "manual" | "saved") {
    setPendingWeekStart(getWeekStartForDate(startDate));
    if (mode) setPlanningMode(mode);
    setPrepStyleOpen(true);
  }

  function startWeek() {
    startWeekMutation.mutate();
  }

  function handlePrimaryAction() {
    if (isApproved) {
      navigate("/grocery");
      return;
    }
    if (coveredMainSlots === 0) {
      openNewWeek(defaultNextWeekStart, "auto");
      return;
    }
    approveWeekMutation.mutate();
  }

  const primaryActionLabel = isApproved
    ? "View grocery list"
    : coveredMainSlots === 0
      ? "Plan this week"
      : openMainSlots > 0
        ? "Review and approve"
        : "Approve this week";

  const pendingWeekRangeLabel = formatWeekRange(pendingWeekStart);

  return (
    <ErrorBoundary>
      <div className="space-y-6 pb-36 lg:pb-10">
        <section className="relative overflow-hidden rounded-[2rem] border border-nourish-border bg-[radial-gradient(circle_at_top_left,_rgba(196,113,79,0.12),_transparent_32%),linear-gradient(135deg,#fffdf9_0%,#f6efe5_100%)] p-5 shadow-sm lg:p-7">
          <div className="absolute right-4 top-4 hidden h-28 w-28 rounded-full bg-nourish-sage/10 blur-2xl lg:block" aria-hidden />
          <div className="relative flex flex-col gap-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-nourish-muted">
                    {viewMode === "week" ? "Current planner" : "Calendar browser"}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${
                      isApproved ? "bg-nourish-sage/15 text-nourish-sage" : "bg-nourish-terracotta/12 text-nourish-terracotta"
                    }`}
                  >
                    {isApproved ? "Approved" : "Draft"}
                  </span>
                </div>
                <div>
                  <h1 className="text-5xl">Nourish</h1>
                  <p className="mt-2 text-base text-nourish-ink/80">{formatWeekRange(week.weekStartDate)}{activeWeekLabel ? ` · ${activeWeekLabel}` : ""}</p>
                </div>
                <p className="max-w-2xl text-sm leading-6 text-nourish-muted">{summaryCopy}</p>
              </div>

              <div className="flex flex-col gap-3 lg:items-end">
                <div className="inline-flex rounded-full border border-nourish-border bg-white/90 p-1 shadow-sm">
                  {(["week", "month"] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setViewMode(mode)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        viewMode === mode ? "bg-nourish-sage text-white" : "text-nourish-muted"
                      }`}
                    >
                      {mode === "week" ? "Week" : "Month"}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" className="button-primary" onClick={() => openNewWeek(defaultNextWeekStart)}>
                    New week
                  </button>
                  <button
                    type="button"
                    className="button-secondary"
                    onClick={() => {
                      setPlanningMode("manual");
                      openNewWeek(defaultNextWeekStart, "manual");
                    }}
                  >
                    Build it myself
                  </button>
                </div>
              </div>
            </div>

            <div className="grid gap-3 lg:grid-cols-[1.35fr,0.9fr,0.9fr]">
              <div className="rounded-[1.6rem] border border-nourish-border/80 bg-white/90 p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-nourish-muted">This week</p>
                <p className="mt-2 text-2xl text-nourish-ink">{summaryLabel}</p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-nourish-bg">
                  <div className="h-full rounded-full bg-gradient-to-r from-nourish-sage to-nourish-terracotta" style={{ width: `${Math.max(completionPercent, 6)}%` }} />
                </div>
                <p className="mt-3 text-sm text-nourish-muted">{coveredMainSlots} of {mainSlots.length} core meals accounted for.</p>
              </div>

              <div className="rounded-[1.6rem] border border-nourish-border/80 bg-white/85 p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-nourish-muted">Focus now</p>
                <p className="mt-2 text-lg text-nourish-ink">
                  {isApproved ? "Head to grocery and shopping." : coveredMainSlots === 0 ? "Pick how you want to start." : openMainSlots > 0 ? "Fill the remaining gaps." : "Give the plan a final review."}
                </p>
                <p className="mt-2 text-sm leading-6 text-nourish-muted">
                  {isApproved ? "Your plan is already approved, so the next useful action is grocery prep." : coveredMainSlots === 0 ? "Auto plan is the fastest path, manual plan is the most flexible, and saved weeks are the easiest repeat." : openMainSlots > 0 ? "Tap any open slot to choose a meal, then approve once the week feels balanced." : "You’re close — approve when the week looks right, then move into groceries."}
                </p>
              </div>

              <div className="rounded-[1.6rem] border border-nourish-border/80 bg-white/85 p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-nourish-muted">Right now</p>
                <div className="mt-2 space-y-2 text-sm text-nourish-muted">
                  <p><span className="font-medium text-nourish-ink">{fridgeItems.length}</span> ingredient{fridgeItems.length === 1 ? "" : "s"} in your kitchen</p>
                  <p><span className="font-medium text-nourish-ink">{visibleMealTypes.length}</span> meal type{visibleMealTypes.length === 1 ? "" : "s"} visible</p>
                  <p><span className="font-medium text-nourish-ink">{savedWeeks.length}</span> saved week{savedWeeks.length === 1 ? "" : "s"} ready to reuse</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {viewMode === "week" ? (
          <section className="space-y-4">
            <div className="flex flex-col gap-3 rounded-[1.8rem] border border-nourish-border bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between lg:p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-nourish-muted">Week view</p>
                <h2 className="mt-2 text-3xl text-nourish-ink">Plan around the week you’re in</h2>
                <p className="mt-2 text-sm text-nourish-muted">The planner opens on the current week and nudges today into view first on mobile.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {mealTypes.map((mealType) => (
                  <button
                    key={mealType}
                    type="button"
                    onClick={() => toggleMealType(mealType)}
                    className={`rounded-full px-4 py-2 text-sm transition ${visibleMealTypes.includes(mealType) ? "bg-nourish-terracotta text-white" : "bg-nourish-bg text-nourish-muted"}`}
                  >
                    {mealType}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-8 bg-gradient-to-r from-[#fbf7f2] to-transparent lg:hidden" aria-hidden />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-8 bg-gradient-to-l from-[#fbf7f2] to-transparent lg:hidden" aria-hidden />
              <div
                ref={weekScrollerRef}
                className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2 pt-1 scroll-smooth lg:mx-0 lg:grid lg:grid-cols-7 lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-0 lg:pt-0"
              >
                {weekDays.map((day) => (
                  <div
                    key={day}
                    ref={(node) => {
                      dayRefs.current[day] = node;
                    }}
                    className="w-[min(88vw,320px)] shrink-0 snap-center snap-always lg:w-auto lg:min-w-0 lg:snap-normal"
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
                    />
                  </div>
                ))}
              </div>
              <div className="mt-1 flex items-center justify-center gap-2 text-xs text-nourish-muted lg:hidden">
                <span className="rounded-full bg-nourish-border/40 px-2 py-0.5 font-medium text-nourish-ink/80">Swipe</span>
                <span>for the rest of the week</span>
                <ChevronRight size={14} className="text-nourish-muted" aria-hidden />
              </div>
            </div>
          </section>
        ) : (
          <section className="rounded-[1.8rem] border border-nourish-border bg-white p-4 shadow-sm lg:p-5">
            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-nourish-muted">Month view</p>
                <h2 className="mt-2 text-3xl text-nourish-ink">{format(monthCursor, "MMMM yyyy")}</h2>
                <p className="mt-2 text-sm text-nourish-muted">Browse months ahead or behind. Tap any date to start planning that week, or tap the highlighted current week to return to it.</p>
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

            <div className="mb-3 grid grid-cols-7 gap-2 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-nourish-muted">
              {weekDays.map((day) => (
                <div key={day}>{day.slice(0, 3)}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
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
                      openNewWeek(dayWeekStart, "auto");
                    }}
                    className={`min-h-[74px] rounded-2xl border p-2 text-left transition ${
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

        <div className="fixed bottom-[5.75rem] left-0 right-0 z-20 border-t border-nourish-border bg-nourish-card/95 px-4 py-3 shadow-[0_-4px_24px_rgba(44,36,22,0.08)] backdrop-blur-md lg:static lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:shadow-none lg:backdrop-blur-none">
          <div className="mx-auto flex max-w-5xl flex-col gap-2 rounded-[1.6rem] border border-nourish-border bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between lg:p-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-nourish-muted">Next step</p>
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

        <BottomSheet open={prepStyleOpen} title="Start a new week" onClose={() => setPrepStyleOpen(false)}>
          <div className="space-y-4">
            <div className="rounded-2xl bg-nourish-bg p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-nourish-muted">Planning week</p>
              <p className="mt-2 text-lg text-nourish-ink">{pendingWeekRangeLabel}</p>
              <p className="mt-1 text-sm text-nourish-muted">Choose how you want to start this week, then we’ll build the planner from there.</p>
            </div>

            <div className="space-y-3">
              {planningModes.map((mode) => {
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.value}
                    type="button"
                    onClick={() => setPlanningMode(mode.value)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${planningMode === mode.value ? "border-transparent bg-nourish-sage text-white" : "border-nourish-border bg-white"}`}
                  >
                    <div className="mb-2 flex items-center gap-3">
                      <Icon size={18} />
                      <span className="text-base font-medium">{mode.title}</span>
                    </div>
                    <p className={`text-sm leading-6 ${planningMode === mode.value ? "text-white/90" : "text-nourish-muted"}`}>{mode.description}</p>
                  </button>
                );
              })}
            </div>

            <div className="rounded-2xl bg-nourish-bg p-4">
              <p className="mb-3 text-sm text-nourish-muted">Meals to include this week</p>
              <div className="flex flex-wrap gap-2">
                {mealTypes.map((mealType) => (
                  <button
                    key={mealType}
                    type="button"
                    onClick={() => toggleMealType(mealType)}
                    className={`rounded-full px-4 py-2 text-sm transition ${visibleMealTypes.includes(mealType) ? "bg-nourish-terracotta text-white" : "bg-white text-nourish-muted"}`}
                  >
                    {mealType}
                  </button>
                ))}
              </div>
            </div>

            {planningMode === "auto" && (
              <>
                <div className="space-y-3">
                  {prepStyles.map((style) => (
                    <button
                      key={style.value}
                      type="button"
                      onClick={() => setSelectedPrepStyle(style.value)}
                      className={`w-full rounded-2xl border p-4 text-left ${selectedPrepStyle === style.value ? "border-transparent bg-nourish-sage text-white" : "border-nourish-border bg-white"}`}
                    >
                      {style.title}
                    </button>
                  ))}
                </div>
                <div>
                  <p className="mb-3 text-sm text-nourish-muted">Max time per session?</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "20 min", value: "Under20" },
                      { label: "45 min", value: "Under45" },
                      { label: "No limit", value: "NoLimit" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setSelectedTime(option.value)}
                        className={`rounded-xl px-3 py-3 text-sm ${selectedTime === option.value ? "bg-nourish-terracotta text-white" : "bg-white text-nourish-muted"}`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {planningMode === "manual" && (
              <div className="rounded-2xl bg-nourish-bg p-4 text-sm leading-6 text-nourish-muted">
                We’ll start with a blank planner. Tap any slot to add recipes from fridge-aware recommendations, ingredient overlap, favorites, recent meals, or search.
              </div>
            )}

            {planningMode === "saved" && (
              <div className="space-y-3">
                {savedWeeks.map((savedWeek) => (
                  <button
                    key={savedWeek.id}
                    type="button"
                    onClick={() => setSavedWeekSelection(savedWeek.id)}
                    className={`w-full rounded-2xl border p-4 text-left ${savedWeekSelection === savedWeek.id ? "border-transparent bg-nourish-sage text-white" : "border-nourish-border bg-white"}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-base font-medium">{savedWeek.templateName ?? "Saved week"}</span>
                      <span className={`text-xs ${savedWeekSelection === savedWeek.id ? "text-white/80" : "text-nourish-muted"}`}>
                        {formatWeekRange(savedWeek.weekStartDate)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <button type="button" className="button-primary w-full" onClick={startWeek} disabled={startWeekMutation.isPending}>
              {planningMode === "auto" ? "Generate my plan →" : planningMode === "manual" ? "Start blank week →" : "Load saved week →"}
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
