import { apiClient, unwrap } from "./client";
import type { FridgeItem, FridgeLocation, RecipeCandidate } from "types/models";

export interface AddFridgeItemRequest {
  ingredientId: number;
  quantity: number;
  unit: string;
  location: FridgeLocation;
  expiresAt?: string;
}

export function getFridgeItems() {
  return unwrap<FridgeItem[]>(apiClient.get("/api/fridge"));
}

export function addFridgeItem(payload: AddFridgeItemRequest) {
  return unwrap<FridgeItem>(apiClient.post("/api/fridge", payload));
}

export function editFridgeItem(id: number, payload: Partial<AddFridgeItemRequest>) {
  return unwrap<FridgeItem>(apiClient.put(`/api/fridge/${id}`, payload));
}

export function deleteFridgeItem(id: number) {
  return unwrap<void>(apiClient.delete(`/api/fridge/${id}`));
}

export function getExpiringItems() {
  return unwrap<FridgeItem[]>(apiClient.get("/api/fridge/expiring"));
}

export function getWhatCanIMake() {
  return unwrap<RecipeCandidate[]>(apiClient.get("/api/fridge/what-can-i-make"));
}
