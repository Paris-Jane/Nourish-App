import { apiClient, unwrap } from "./client";
import type { Ingredient } from "types/models";

export function getIngredients() {
  return unwrap<Ingredient[]>(apiClient.get("/api/ingredients"));
}

export async function searchIngredients(query: string) {
  const items = await getIngredients();
  return items.filter((ingredient) => ingredient.name.toLowerCase().includes(query.toLowerCase()));
}
