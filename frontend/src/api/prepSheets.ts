import { apiClient, unwrap } from "./client";
import type { PrepSheet } from "types/models";

export function getPrepSheets(weekId: number) {
  return unwrap<PrepSheet[]>(apiClient.get(`/api/weeks/${weekId}/prep-sheet`));
}

export function generatePrepSheets(weekId: number) {
  return unwrap<PrepSheet[]>(apiClient.post(`/api/weeks/${weekId}/prep-sheet/generate`));
}
