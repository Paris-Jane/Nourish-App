import { apiClient, unwrap } from "./client";
import type { Week } from "types/models";

export function getSavedWeeks() {
  return unwrap<Week[]>(apiClient.get("/api/weeks/saved"));
}

export function loadSavedWeek(id: number) {
  return unwrap<Week>(apiClient.get(`/api/weeks/${id}`));
}

export function toggleSavedWeekRotation(id: number, isInRotation: boolean) {
  return unwrap<Week>(apiClient.put(`/api/weeks/${id}/rotation`, { isInRotation }));
}
