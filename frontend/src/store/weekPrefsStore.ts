import { create } from "zustand";
import { mockWeekPrefs } from "lib/mockData";

function defaultFavorite(weekId: number): boolean {
  return mockWeekPrefs[weekId]?.isFavorite ?? false;
}

interface WeekPrefsState {
  favoriteOverrides: Record<number, boolean>;
  isFavorite: (weekId: number) => boolean;
  toggleFavorite: (weekId: number) => void;
}

export const useWeekPrefsStore = create<WeekPrefsState>((set, get) => ({
  favoriteOverrides: {},
  isFavorite: (weekId: number) => {
    const override = get().favoriteOverrides[weekId];
    return override !== undefined ? override : defaultFavorite(weekId);
  },
  toggleFavorite: (weekId: number) =>
    set((state) => {
      const current =
        state.favoriteOverrides[weekId] !== undefined ? state.favoriteOverrides[weekId] : defaultFavorite(weekId);
      return { favoriteOverrides: { ...state.favoriteOverrides, [weekId]: !current } };
    }),
}));
