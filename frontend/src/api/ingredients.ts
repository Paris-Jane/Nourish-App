import { apiClient, unwrap } from "./client";
import type { DefaultLocation, FoodGroup, Ingredient, StoreSection, UserIngredientPref } from "types/models";

export function getIngredients() {
  return unwrap<Ingredient[]>(apiClient.get("/api/ingredients"));
}

export interface IngredientRequest {
  name: string;
  foodGroup: FoodGroup;
  servingSize: number;
  servingUnit: string;
  purchaseUnit: string;
  defaultLocation: DefaultLocation;
  storeSection: StoreSection;
  isPerishable: boolean;
  isFlexibleGroup: boolean;
  isMyPlateCounted: boolean;
  shelfLifeDays: number;
  typicalPackageSize?: number | null;
  packageSizeUnit?: string | null;
  isStaple?: boolean;
  aliases?: string[];
  notes?: string | null;
}

export function createIngredient(payload: IngredientRequest) {
  return unwrap<Ingredient>(apiClient.post("/api/ingredients", payload));
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
