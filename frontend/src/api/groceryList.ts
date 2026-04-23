import { apiClient, unwrap } from "./client";
import type { GroceryList, GroceryListItem } from "types/models";

export function getGroceryList(weekId: number) {
  return unwrap<GroceryList>(apiClient.get(`/api/weeks/${weekId}/grocery-list`));
}

export function generateGroceryList(weekId: number) {
  return unwrap<GroceryList>(apiClient.post(`/api/weeks/${weekId}/grocery-list/generate`));
}

export function checkGroceryItem(weekId: number, itemId: number, isChecked: boolean) {
  return unwrap<GroceryListItem>(apiClient.put(`/api/weeks/${weekId}/grocery-list/items/${itemId}/check`, { isChecked }));
}

export function updateGroceryItemQuantity(weekId: number, itemId: number, purchasedQuantity: number) {
  return unwrap<GroceryListItem>(
    apiClient.put(`/api/weeks/${weekId}/grocery-list/items/${itemId}/quantity`, { purchasedQuantity }),
  );
}

export interface CreateGroceryItemRequest {
  ingredientId: number;
  plannedQuantity: number;
  plannedUnit: string;
  storeSection?: string;
}

export function addGroceryItem(weekId: number, payload: CreateGroceryItemRequest) {
  return unwrap<GroceryListItem>(apiClient.post(`/api/weeks/${weekId}/grocery-list/items`, payload));
}

export function deleteGroceryItem(weekId: number, itemId: number) {
  return unwrap<void>(apiClient.delete(`/api/weeks/${weekId}/grocery-list/items/${itemId}`));
}
