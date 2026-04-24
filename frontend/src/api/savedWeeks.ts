import { apiClient, unwrap } from "./client";
import type { SavedWeekTemplate, UserWeekPref, Week } from "types/models";

export function getSavedWeeks() {
  return unwrap<SavedWeekTemplate[]>(apiClient.get("/api/weeks/saved"));
}

export function deleteSavedWeekTemplate(id: number) {
  return unwrap<void>(apiClient.delete(`/api/weeks/saved/${id}`));
}

export function loadSavedWeek(id: number) {
  return unwrap<Week>(apiClient.get(`/api/weeks/${id}`));
}

export function toggleSavedWeekRotation(id: number, isInRotation: boolean) {
  return unwrap<Week>(apiClient.put(`/api/weeks/${id}/rotation`, { isInRotation }));
}

export function getWeekPreference(id: number) {
  return unwrap<UserWeekPref>(apiClient.get(`/api/weeks/${id}/preferences`));
}

export function upsertWeekPreference(id: number, payload: Partial<Pick<UserWeekPref, "isFavorite">>) {
  return unwrap<UserWeekPref>(apiClient.put(`/api/weeks/${id}/preferences`, payload));
}
