import { addDays, formatISO } from "date-fns";
import { useMemo, useState } from "react";
import { BookCopy, ChevronRight, Sparkles, SquarePen } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveWeek, createWeek, generateWeek, getWeekSlots, swapSlot } from "api/weeks";
import { BottomSheet } from "components/BottomSheet";
import { DayColumn } from "components/DayColumn";
import { ErrorBoundary } from "components/ErrorBoundary";
import { SwapDrawer } from "components/SwapDrawer";
import { useCurrentWeek, useFridgeItems, useGroupedSlots, useRecipes, useSavedWeeks, useWeekSlots } from "hooks/useAppData";
import { createAutoWeekSlots, createBlankWeekSlots, createSavedWeekSlots, formatWeekRange, getCurrentWeekStart, mealTypes, weekDays } from "lib/utils";
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

export function HomePage() {
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
  const [selectedPrepStyle, setSelectedPrepStyle] = useState("OnePrepDay");
  const [selectedTime, setSelectedTime] = useState("Under45");
  const [savedWeekSelection, setSavedWeekSelection] = useState<number | null>(savedWeeks[0]?.id ?? null);

  const selectedSlot = useMemo(
    () => Object.values(grouped).flat().find((slot) => slot.id === selectedSlotId),
    [grouped, selectedSlotId],
  );

  const startWeekMutation = useMutation({
    mutationFn: async () => {
      const baseWeekStart = getCurrentWeekStart();
      const nextWeekStart = addDays(baseWeekStart, 7);
      const createdWeek = await createWeek({
        weekStartDate: formatISO(nextWeekStart, { representation: "date" }),
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

  function toggleMealType(mealType: MealType) {
    const next = visibleMealTypes.includes(mealType)
      ? visibleMealTypes.filter((entry) => entry !== mealType)
      : [...visibleMealTypes, mealType];

    if (next.length > 0) {
      setVisibleMealTypes(next);
    }
  }

  function startWeek() {
    startWeekMutation.mutate();
  }

  return (
    <ErrorBoundary>
      <div className="pb-36 lg:pb-10">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-5xl">Nourish</h1>
            <p className="mt-2 text-sm text-nourish-muted">
              {formatWeekRange(week.weekStartDate)}
              {activeWeekLabel ? ` · ${activeWeekLabel}` : ""}
            </p>
          </div>
          <button type="button" className="button-primary" onClick={() => setPrepStyleOpen(true)}>
            New week
          </button>
        </div>

        <div className="relative mb-2 lg:mb-0">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-8 bg-gradient-to-r from-[#fbf7f2] to-transparent lg:hidden" aria-hidden />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-8 bg-gradient-to-l from-[#fbf7f2] to-transparent lg:hidden" aria-hidden />
          <div className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2 pt-1 scroll-smooth lg:mx-0 lg:grid lg:grid-cols-7 lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-4 lg:pt-0">
            {weekDays.map((day) => (
              <div key={day} className="w-[min(88vw,320px)] shrink-0 snap-center snap-always lg:w-auto lg:min-w-0 lg:snap-normal">
                <DayColumn
                  day={day}
                  slots={grouped[day] ?? []}
                  recipes={recipes}
                  isToday={isWeekColumnToday(week.weekStartDate, day as WeekDay)}
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
            <span>for more days</span>
            <ChevronRight size={14} className="text-nourish-muted" aria-hidden />
          </div>
        </div>

        <div className="fixed bottom-[5.75rem] left-0 right-0 z-20 border-t border-nourish-border bg-nourish-card/95 px-4 py-3 shadow-[0_-4px_24px_rgba(44,36,22,0.08)] backdrop-blur-md lg:static lg:z-0 lg:mt-6 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:shadow-none lg:backdrop-blur-none">
          <div className="mx-auto flex max-w-4xl flex-col gap-2 sm:flex-row sm:items-stretch">
            <button
              type="button"
              className="button-primary flex-1"
              onClick={() => approveWeekMutation.mutate()}
            >
              Approve this week →
            </button>
            <button
              type="button"
              className="button-secondary flex-1"
              onClick={() => {
                setPlanningMode("manual");
                setPrepStyleOpen(true);
              }}
            >
              Build it myself
            </button>
          </div>
        </div>

        <BottomSheet open={prepStyleOpen} title="Start a new week" onClose={() => setPrepStyleOpen(false)}>
          <div className="space-y-4">
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
