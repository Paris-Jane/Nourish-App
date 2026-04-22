import { useMemo, useState } from "react";
import { BottomSheet } from "components/BottomSheet";
import { DayColumn } from "components/DayColumn";
import { ErrorBoundary } from "components/ErrorBoundary";
import { SwapDrawer } from "components/SwapDrawer";
import { useCurrentWeek, useGroupedSlots, useRecipes } from "hooks/useAppData";
import { formatWeekRange, weekDays } from "lib/utils";
import { useToast } from "hooks/useToast";
import { useWeekStore } from "store/weekStore";

const prepStyles = [
  { title: "Cook each night", value: "DayOf" },
  { title: "One prep day", value: "OnePrepDay" },
  { title: "Two prep days", value: "TwoPrepDays" },
];

export function HomePage() {
  const { week } = useCurrentWeek();
  const { grouped } = useGroupedSlots();
  const { recipes } = useRecipes();
  const { pushToast } = useToast();
  const selectedSlotId = useWeekStore((state) => state.selectedSlotId);
  const selectSlot = useWeekStore((state) => state.selectSlot);
  const prepStyleOpen = useWeekStore((state) => state.prepStyleOpen);
  const setPrepStyleOpen = useWeekStore((state) => state.setPrepStyleOpen);
  const swapDrawerOpen = useWeekStore((state) => state.swapDrawerOpen);
  const setSwapDrawerOpen = useWeekStore((state) => state.setSwapDrawerOpen);
  const [selectedPrepStyle, setSelectedPrepStyle] = useState("OnePrepDay");
  const [selectedTime, setSelectedTime] = useState("Under45");

  const selectedSlot = useMemo(
    () => Object.values(grouped).flat().find((slot) => slot.id === selectedSlotId),
    [grouped, selectedSlotId],
  );

  return (
    <ErrorBoundary>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-5xl">Nourish</h1>
          <p className="mt-2 text-sm text-nourish-muted">{formatWeekRange(week.weekStartDate)}</p>
        </div>
        <button className="button-primary" onClick={() => setPrepStyleOpen(true)}>
          New week
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 lg:grid lg:grid-cols-7 lg:overflow-visible">
        {weekDays.map((day) => (
          <DayColumn
            key={day}
            day={day}
            slots={grouped[day] ?? []}
            recipes={recipes}
            onSlotSelect={(slotId) => {
              selectSlot(slotId);
              setSwapDrawerOpen(true);
            }}
          />
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 lg:flex-row">
        <button className="button-primary flex-1" onClick={() => pushToast("Week approved in preview. We can wire the real mutation when auth is on.")}>
          Approve this week →
        </button>
        <button className="text-sm text-nourish-muted" onClick={() => pushToast("Free-build mode will be easy to add on top of this layout.")}>
          Build it myself
        </button>
      </div>

      <BottomSheet open={prepStyleOpen} title="How do you want to prep this week?" onClose={() => setPrepStyleOpen(false)}>
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
        <div className="mt-6">
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
                className={`rounded-xl px-3 py-3 text-sm ${selectedTime === option.value ? "bg-nourish-terracotta text-white" : "bg-nourish-bg text-nourish-muted"}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          className="button-primary mt-6 w-full"
          onClick={() => {
            setPrepStyleOpen(false);
            pushToast("Week generation is set up for later wiring. The planner UI is ready now.");
          }}
        >
          Generate my plan →
        </button>
      </BottomSheet>

      <SwapDrawer open={swapDrawerOpen} slot={selectedSlot} recipes={recipes} onClose={() => setSwapDrawerOpen(false)} />
    </ErrorBoundary>
  );
}
