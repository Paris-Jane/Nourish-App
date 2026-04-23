import type { MealType, WeekMealSlot } from "types/models";
import { create } from "zustand";

type PlanningMode = "auto" | "manual" | "saved";

interface WeekState {
  activeWeekId: number | null;
  /** When set, planner shows this Monday’s week (ISO date). When null, follows server week anchor. */
  visibleWeekStartDate: string | null;
  selectedSlotId: number | null;
  swapDrawerOpen: boolean;
  planningMode: PlanningMode;
  visibleMealTypes: MealType[];
  slotOverrides: WeekMealSlot[] | null;
  activeWeekLabel: string | null;
  setActiveWeekId: (weekId: number) => void;
  setVisibleWeekStartDate: (isoMonday: string | null) => void;
  selectSlot: (slotId: number | null) => void;
  setSwapDrawerOpen: (isOpen: boolean) => void;
  setPlanningMode: (mode: PlanningMode) => void;
  setVisibleMealTypes: (mealTypes: MealType[]) => void;
  setSlotOverrides: (slots: WeekMealSlot[] | null) => void;
  setActiveWeekLabel: (label: string | null) => void;
}

export const useWeekStore = create<WeekState>((set) => ({
  activeWeekId: 1,
  visibleWeekStartDate: null,
  selectedSlotId: null,
  swapDrawerOpen: false,
  planningMode: "auto",
  visibleMealTypes: ["Breakfast", "Lunch", "Dinner", "Snack"],
  slotOverrides: null,
  activeWeekLabel: null,
  setActiveWeekId: (activeWeekId) => set({ activeWeekId }),
  setVisibleWeekStartDate: (visibleWeekStartDate) => set({ visibleWeekStartDate }),
  selectSlot: (selectedSlotId) => set({ selectedSlotId }),
  setSwapDrawerOpen: (swapDrawerOpen) => set({ swapDrawerOpen }),
  setPlanningMode: (planningMode) => set({ planningMode }),
  setVisibleMealTypes: (visibleMealTypes) => set({ visibleMealTypes }),
  setSlotOverrides: (slotOverrides) => set({ slotOverrides }),
  setActiveWeekLabel: (activeWeekLabel) => set({ activeWeekLabel }),
}));
