import { create } from "zustand";
import { mockIngredientPrefs } from "lib/mockData";

function defaultFavorite(ingredientId: number): boolean {
  return mockIngredientPrefs[ingredientId]?.isFavorite ?? false;
}

interface IngredientPrefsState {
  favoriteOverrides: Record<number, boolean>;
  isFavorite: (ingredientId: number) => boolean;
  toggleFavorite: (ingredientId: number) => void;
}

export const useIngredientPrefsStore = create<IngredientPrefsState>((set, get) => ({
  favoriteOverrides: {},
  isFavorite: (ingredientId: number) => {
    const override = get().favoriteOverrides[ingredientId];
    return override !== undefined ? override : defaultFavorite(ingredientId);
  },
  toggleFavorite: (ingredientId: number) =>
    set((state) => {
      const current =
        state.favoriteOverrides[ingredientId] !== undefined
          ? state.favoriteOverrides[ingredientId]
          : defaultFavorite(ingredientId);
      return { favoriteOverrides: { ...state.favoriteOverrides, [ingredientId]: !current } };
    }),
}));
