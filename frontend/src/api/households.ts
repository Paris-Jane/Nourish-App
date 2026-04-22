import { apiClient, unwrap } from "./client";
import type { Household, HouseholdPreferences } from "types/models";

export function getHousehold(id: number) {
  return unwrap<Household>(apiClient.get(`/api/households/${id}`));
}

export function updateHouseholdPreferences(
  id: number,
  payload: Omit<HouseholdPreferences, "id" | "householdId" | "myPlateTargets" | "updatedAt">,
) {
  return unwrap<HouseholdPreferences>(apiClient.put(`/api/households/${id}/preferences`, payload));
}
