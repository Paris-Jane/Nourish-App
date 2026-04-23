import { create } from "zustand";
import { mockRecipePrefs } from "lib/mockData";

function defaultFavorite(recipeId: number): boolean {
  return mockRecipePrefs[recipeId]?.isFavorite ?? false;
}

interface RecipePrefsState {
  favoriteOverrides: Record<number, boolean>;
  isFavorite: (recipeId: number) => boolean;
  toggleFavorite: (recipeId: number) => void;
}

export const useRecipePrefsStore = create<RecipePrefsState>((set, get) => ({
  favoriteOverrides: {},
  isFavorite: (recipeId: number) => {
    const o = get().favoriteOverrides[recipeId];
    return o !== undefined ? o : defaultFavorite(recipeId);
  },
  toggleFavorite: (recipeId: number) =>
    set((s) => {
      const current = s.favoriteOverrides[recipeId] !== undefined ? s.favoriteOverrides[recipeId] : defaultFavorite(recipeId);
      return { favoriteOverrides: { ...s.favoriteOverrides, [recipeId]: !current } };
    }),
}));
