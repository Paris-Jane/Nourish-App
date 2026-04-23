import { create } from "zustand";
import { mockRecipePrefs } from "lib/mockData";

function defaultFavorite(recipeId: number): boolean {
  return mockRecipePrefs[recipeId]?.isFavorite ?? false;
}

function defaultDisliked(recipeId: number): boolean {
  return mockRecipePrefs[recipeId]?.isDisliked ?? false;
}

interface RecipePrefsState {
  favoriteOverrides: Record<number, boolean>;
  dislikedOverrides: Record<number, boolean>;
  isFavorite: (recipeId: number) => boolean;
  isDisliked: (recipeId: number) => boolean;
  toggleFavorite: (recipeId: number) => void;
  toggleDisliked: (recipeId: number) => void;
}

export const useRecipePrefsStore = create<RecipePrefsState>((set, get) => ({
  favoriteOverrides: {},
  dislikedOverrides: {},
  isFavorite: (recipeId: number) => {
    const o = get().favoriteOverrides[recipeId];
    return o !== undefined ? o : defaultFavorite(recipeId);
  },
  isDisliked: (recipeId: number) => {
    const o = get().dislikedOverrides[recipeId];
    return o !== undefined ? o : defaultDisliked(recipeId);
  },
  toggleFavorite: (recipeId: number) =>
    set((s) => {
      const current = s.favoriteOverrides[recipeId] !== undefined ? s.favoriteOverrides[recipeId] : defaultFavorite(recipeId);
      return { favoriteOverrides: { ...s.favoriteOverrides, [recipeId]: !current } };
    }),
  toggleDisliked: (recipeId: number) =>
    set((s) => {
      const current = s.dislikedOverrides[recipeId] !== undefined ? s.dislikedOverrides[recipeId] : defaultDisliked(recipeId);
      const next = !current;
      const fav = s.favoriteOverrides[recipeId] !== undefined ? s.favoriteOverrides[recipeId] : defaultFavorite(recipeId);
      const favoriteOverrides = { ...s.favoriteOverrides };
      if (next && fav) favoriteOverrides[recipeId] = false;
      return {
        dislikedOverrides: { ...s.dislikedOverrides, [recipeId]: next },
        favoriteOverrides,
      };
    }),
}));
