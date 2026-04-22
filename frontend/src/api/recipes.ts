import { apiClient, unwrap } from "./client";
import type { MealType, Recipe, RecipeCandidate, UserRecipePref } from "types/models";

export interface RecipeRequest {
  name: string;
  cuisine: string;
  scalabilityTag: Recipe["scalabilityTag"];
  timeTag: Recipe["timeTag"];
  prepStyleTag: Recipe["prepStyleTag"];
  isFreezerFriendly: boolean;
  isCookFreshOnly: boolean;
  baseYieldServings: number;
  mealTypeTags: MealType[];
  foodGroupServings: Record<string, number>;
  ingredients: Array<{
    ingredientId: number;
    quantity: number;
    unit: string;
    isModifier?: boolean;
    isOptional?: boolean;
  }>;
}

export function getRecipes() {
  return unwrap<Recipe[]>(apiClient.get("/api/recipes"));
}

export function searchRecipes(params?: Record<string, string | boolean | undefined>) {
  return unwrap<Recipe[]>(apiClient.get("/api/recipes/search", { params }));
}

export function getRecipe(id: string) {
  return unwrap<Recipe>(apiClient.get(`/api/recipes/${id}`));
}

export function createRecipe(payload: RecipeRequest) {
  return unwrap<Recipe>(apiClient.post("/api/recipes", payload));
}

export function updateRecipe(id: string, payload: RecipeRequest) {
  return unwrap<Recipe>(apiClient.put(`/api/recipes/${id}`, payload));
}

export function deleteRecipe(id: string) {
  return unwrap<void>(apiClient.delete(`/api/recipes/${id}`));
}

export function analyzeRecipe(rawText: string) {
  return unwrap<RecipeRequest>(apiClient.post("/api/recipes/analyze", { rawText }));
}

export function getRecipePreference(id: number) {
  return unwrap<UserRecipePref>(apiClient.get(`/api/recipes/${id}/preferences`));
}

export function upsertRecipePreference(id: number, payload: Partial<Pick<UserRecipePref, "isFavorite" | "isDisliked">>) {
  return unwrap<UserRecipePref>(apiClient.put(`/api/recipes/${id}/preferences`, payload));
}

export function getWhatCanIMakeCandidates() {
  return unwrap<RecipeCandidate[]>(apiClient.get("/api/fridge/what-can-i-make"));
}
