import { addDays, format, parseISO, startOfWeek } from "date-fns";
import { clsx } from "clsx";
import type { MealType, WeekDay } from "types/models";

export function cn(...inputs: Array<string | false | null | undefined>) {
  return clsx(inputs);
}

export const weekDays: WeekDay[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const mealTypes: MealType[] = ["Breakfast", "Lunch", "Dinner", "Snack"];

export function getCurrentWeekStart() {
  return startOfWeek(new Date(), { weekStartsOn: 1 });
}

export function formatWeekRange(weekStartDate: string | Date) {
  const start = typeof weekStartDate === "string" ? parseISO(weekStartDate) : weekStartDate;
  const end = addDays(start, 6);
  return `${format(start, "MMM d")} – ${format(end, "MMM d")}`;
}

export function titleCaseEnum(value: string) {
  return value.replace(/([A-Z])/g, " $1").trim();
}

export function daysUntil(dateString?: string | null) {
  if (!dateString) return null;
  const diff = Math.ceil((parseISO(dateString).getTime() - Date.now()) / 86_400_000);
  return diff;
}
