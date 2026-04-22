import { create } from "zustand";

interface WeekState {
  activeWeekId: number | null;
  selectedSlotId: number | null;
  prepStyleOpen: boolean;
  swapDrawerOpen: boolean;
  setActiveWeekId: (weekId: number) => void;
  selectSlot: (slotId: number | null) => void;
  setPrepStyleOpen: (isOpen: boolean) => void;
  setSwapDrawerOpen: (isOpen: boolean) => void;
}

export const useWeekStore = create<WeekState>((set) => ({
  activeWeekId: 1,
  selectedSlotId: null,
  prepStyleOpen: false,
  swapDrawerOpen: false,
  setActiveWeekId: (activeWeekId) => set({ activeWeekId }),
  selectSlot: (selectedSlotId) => set({ selectedSlotId }),
  setPrepStyleOpen: (prepStyleOpen) => set({ prepStyleOpen }),
  setSwapDrawerOpen: (swapDrawerOpen) => set({ swapDrawerOpen }),
}));
