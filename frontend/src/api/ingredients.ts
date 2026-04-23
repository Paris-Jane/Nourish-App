import { apiClient, unwrap } from "./client";
import type { Ingredient, UserIngredientPref } from "types/models";

export function getIngredients() {
  return unwrap<Ingredient[]>(apiClient.get("/api/ingredients"));
}

export async function searchIngredients(query: string) {
  const items = await getIngredients();
  return items.filter((ingredient) => ingredient.name.toLowerCase().includes(query.toLowerCase()));
}

export function getIngredientPreference(id: number) {
  return unwrap<UserIngredientPref>(apiClient.get(`/api/ingredients/${id}/preferences`));
}

export function upsertIngredientPreference(id: number, payload: Partial<Pick<UserIngredientPref, "isFavorite">>) {
  return unwrap<UserIngredientPref>(apiClient.put(`/api/ingredients/${id}/preferences`, payload));
}
