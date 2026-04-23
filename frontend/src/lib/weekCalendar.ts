import { addDays, isSameDay, parseISO } from "date-fns";
import { weekDays } from "lib/utils";
import type { WeekDay } from "types/models";

export function isWeekColumnToday(weekStartDate: string | Date, columnDay: WeekDay): boolean {
  const start = typeof weekStartDate === "string" ? parseISO(weekStartDate) : weekStartDate;
  const idx = weekDays.indexOf(columnDay);
  if (idx < 0) return false;
  const columnDate = addDays(start, idx);
  return isSameDay(columnDate, new Date());
}
