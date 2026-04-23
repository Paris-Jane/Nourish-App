import { apiClient, unwrap } from "./client";
import type { PrepStyle, Week, WeekMealSlot } from "types/models";

export interface CreateWeekRequest {
  weekStartDate: string;
  prepStyle: PrepStyle;
  maxCookTime: Week["maxCookTime"];
}

export function createWeek(payload: CreateWeekRequest) {
  return unwrap<Week>(apiClient.post("/api/weeks", payload));
}

export function getWeek(id: number) {
  return unwrap<Week>(apiClient.get(`/api/weeks/${id}`));
}

export function getWeekSlots(id: number) {
  return unwrap<WeekMealSlot[]>(apiClient.get(`/api/weeks/${id}/slots`));
}

export function generateWeek(id: number) {
  return unwrap<{ generated: number; weekId: number }>(apiClient.post(`/api/weeks/${id}/generate`));
}

export function approveWeek(id: number) {
  return unwrap<Week>(apiClient.post(`/api/weeks/${id}/approve`));
}

export function swapSlot(
  weekId: number,
  slotId: number,
  payload: Partial<Pick<WeekMealSlot, "recipeId" | "selectedModifierIngredientIds" | "isEatingOut" | "isSkipped" | "isLocked" | "servingsPlanned">>,
) {
  return unwrap<WeekMealSlot>(apiClient.put(`/api/weeks/${weekId}/slots/${slotId}`, payload));
}
